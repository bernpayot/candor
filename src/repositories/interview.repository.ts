import { prisma } from "../configs/database.js";
import {
  InterviewStatus,
  AssessmentStatus,
} from "../generated/prisma/enums.js";

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

  async completeInterview(interviewId: string) {
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: InterviewStatus.COMPLETED,
        assessmentStatus: AssessmentStatus.PROCESSING,
      },
    });

    return updatedInterview;
  }

  async deleteInterview(interviewId: string) {
    await prisma.interview.delete({
      where: { id: interviewId },
    });
  }
}
