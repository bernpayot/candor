import { prisma } from "../configs/database.js";
import {
  InterviewStatus,
  AssessmentStatus,
} from "../generated/prisma/enums.js";
import type { AssessmentResponse } from "../utils/assessment.schema.js";
import { TranscriptQuestion } from "../types/interview.types.js";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export class InterviewRepository {
  async getLevels() {
    const levels = await prisma.interviewLevel.findMany({
      select: { id: true, levelName: true },
    });

    return levels;
  }

  async getSpecialties() {
    const specialties = await prisma.interviewSpecialty.findMany({
      select: { id: true, specialtyName: true },
    });

    return specialties;
  }

  async getInterview(interviewId: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    return interview;
  }

  async getInterviewPrompt(levelId: string, specialtyId: string) {
    const prompt = await prisma.interviewPrompt.findFirst({
      where: { levelId: levelId, specialtyId: specialtyId },
      include: {
        level: { select: { levelName: true } },
        specialty: { select: { specialtyName: true } },
      },
    });

    return prompt;
  }

  async getInterviewResult(interviewId: string) {
    const result = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: {
        id: true,
        userId: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            userAnswer: true,
          },
        },
        assessment: {
          select: {
            questionRating: true,
            remarks: true,
            topicReferences: true,
          },
        },
        result: {
          select: {
            overallGrade: true,
            description: true,
          },
        },
      },
    });

    return result;
  }

  async getInterviewForAssessment(interviewId: string) {
    const assess = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: {
        id: true,
        level: { select: { levelName: true } },
        specialty: { select: { specialtyName: true } },
        questions: {
          select: {
            id: true,
            questionText: true,
            userAnswer: true,
            sequenceOrder: true,
          },
        },
      },
    });

    return assess;
  }

  async createInterview(
    userId: string,
    levelId: string,
    specialtyId: string,
    promptId: string,
  ) {
    const interview = await prisma.interview.create({
      data: {
        userId: userId,
        levelId: levelId,
        specialtyId: specialtyId,
        promptId: promptId,
      },
    });

    return interview;
  }

  async checkActiveInterview(userId: string) {
    const check = await prisma.interview.findFirst({
      where: { userId: userId, status: InterviewStatus.IN_PROGRESS },
    });

    return check;
  }

  async completeInterview(interviewId: string, question: TranscriptQuestion[]) {
    return prisma.$transaction(async (tx) => {
      await tx.interviewQuestion.deleteMany({
        where: { interviewId },
      });

      await tx.interviewQuestion.createMany({
        data: question.map((question) => ({
          interviewId,
          questionText: question.questionText,
          userAnswer: question.userAnswer,
          sequenceOrder: question.sequenceOrder,
        })),
      });

      await tx.interview.update({
        where: { id: interviewId },
        data: {
          status: InterviewStatus.COMPLETED,
          assessmentStatus: AssessmentStatus.PROCESSING,
          completedAt: new Date(),
        },
      });
    });
  }

  async deleteInterview(interviewId: string) {
    await prisma.interview.delete({
      where: { id: interviewId },
    });
  }

  async assessmentTransaction(data: AssessmentResponse, interviewId: string) {
    const transaction = await prisma.$transaction(async (tx) => {
      await tx.assessment.deleteMany({
        where: { interviewId },
      });

      await tx.assessment.createMany({
        data: data.questions.map((question) => ({
          interviewId,
          questionId: question.questionId,
          questionRating: question.questionRating,
          remarks: question.remarks,
          topicReferences: question.topicReferences,
        })),
      });

      await tx.assessmentResult.upsert({
        where: { interviewId },
        create: {
          interviewId,
          overallGrade: data.overall.overallGrade,
          description: data.overall.description,
        },
        update: {
          overallGrade: data.overall.overallGrade,
          description: data.overall.description,
        },
      });

      await tx.interview.update({
        where: { id: interviewId },
        data: { assessmentStatus: AssessmentStatus.COMPLETED },
      });
    });

    return transaction;
  }

  async countTodayInterviews(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });
    const timezone = user?.timezone ?? "UTC";

    const now = new Date();
    const userMidnight = toZonedTime(now, timezone);
    userMidnight.setHours(0, 0, 0, 0);

    const userTomorrow = new Date(userMidnight);
    userTomorrow.setDate(userTomorrow.getDate() + 1);

    const startOfDay = fromZonedTime(userMidnight, timezone);
    const endOfDay = fromZonedTime(userTomorrow, timezone);

    const count = await prisma.interview.count({
      where: {
        userId,
        startedAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return count;
  }
}
