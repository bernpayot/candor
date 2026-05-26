import { InterviewRepository } from "../repositories/interview.repository.js";
import AppError, {
  ConflictError,
  NotFoundError,
  ExternalAPIError,
  UnauthorizedError,
  JobError,
  ValidationError,
  RateLimitError,
} from "../utils/errors.js";
import requireEnv from "../configs/env.checker.js";
import { AI_MODEL, AI_VOICE } from "../configs/constants.js";
import { assessmentQueue } from "../jobs/assessment.queue.js";
import { buildPrompt } from "../utils/prompt.builder.js";
import { TranscriptQuestion } from "../types/interview.types.js";

export class InterviewService {
  constructor(private repository: InterviewRepository) {}

  async getLevels() {
    const levels = await this.repository.getLevels();

    if (levels.length === 0) {
      throw new NotFoundError("Levels not found.");
    }

    return levels.map((level) => ({
      id: level.id,
      levelName: level.levelName,
    }));
  }

  async getSpecialties() {
    const specialties = await this.repository.getSpecialties();

    if (specialties.length === 0) {
      throw new NotFoundError("Specialties not found.");
    }

    return specialties.map((specialty) => ({
      id: specialty.id,
      specialtyName: specialty.specialtyName,
    }));
  }

  async getUserInterviews(userId: string) {
    const userInterviews = await this.repository.getUserInterviews(userId);

    return userInterviews;
  }

  async getInterview(interviewId: string, userId: string) {
    const interview = await this.repository.getInterview(interviewId);

    if (interview === null) {
      throw new NotFoundError("This interview doesn't exist.");
    }

    if (interview.userId !== userId) {
      throw new UnauthorizedError(
        "You don't have the permission to access this interview.",
      );
    }

    return interview;
  }

  async getInterviewResult(interviewId: string, userId: string) {
    const interviewResult =
      await this.repository.getInterviewResult(interviewId);

    if (interviewResult === null) {
      throw new NotFoundError("This interview doesn't exist.");
    }

    if (interviewResult.userId !== userId) {
      throw new UnauthorizedError(
        "You don't have the permission to access this interview.",
      );
    }

    return interviewResult;
  }

  async createInterview(userId: string, levelId: string, specialtyId: string) {
    const interviewLimit = requireEnv("INTERVIEW_CREATE_LIMIT");

    const checkActiveInterview =
      await this.repository.checkActiveInterview(userId);

    if (checkActiveInterview !== null) {
      throw new ConflictError(
        "You are already inside an interview! Finish that first.",
      );
    }

    const interviewCount = await this.repository.countTodayInterviews(userId);

    if (interviewCount >= Number(interviewLimit)) {
      throw new RateLimitError(
        `You have used up all your interview attempts. Please try again tomorrow.`,
      );
    }

    const prompt = await this.repository.getInterviewPrompt(
      levelId,
      specialtyId,
    );

    if (prompt === null) {
      throw new NotFoundError("This prompt doesn't exist. Please try again.");
    }

    const interview = await this.repository.createInterview(
      userId,
      levelId,
      specialtyId,
      prompt.id,
    );

    const interviewId = interview.id;

    const sessionConfig = JSON.stringify({
      session: {
        type: "realtime",
        model: AI_MODEL,
        instructions: buildPrompt(
          prompt.level.levelName,
          prompt.specialty.specialtyName,
          prompt.topics,
          prompt.avoidTopics,
        ),

        audio: {
          output: {
            voice: AI_VOICE,
          },
        },
      },
    });

    try {
      const response = await fetch(
        "https://api.openai.com/v1/realtime/client_secrets",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${requireEnv("OPENAI_API_KEY")}`,
            "Content-Type": "application/json",
            "OpenAI-Safety-Identifier": userId,
          },
          body: sessionConfig,
        },
      );

      if (!response.ok) {
        throw new ExternalAPIError(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

      const ephemeralToken = data.value;

      return { interviewId, ephemeralToken };
    } catch (error) {
      await this.repository.deleteInterview(interview.id);
      if (error instanceof AppError) {
        throw error;
      }
      throw new ExternalAPIError(
        "Token generation error. Failed to generate token.",
      );
    }
  }

  async updateInterviewStatus(
    userId: string,
    interviewId: string,
    questions: TranscriptQuestion[],
  ) {
    const interview = await this.repository.getInterview(interviewId);

    if (!interview) {
      throw new NotFoundError("Interview doesn't exist.");
    }

    if (interview.userId !== userId) {
      throw new UnauthorizedError(
        "You don't have the permission to update this interview",
      );
    }

    if (!questions || questions.length === 0) {
      throw new ValidationError("Interview transcript cannot be empty.");
    }

    const updatedInterview = await this.repository.completeInterview(
      interviewId,
      questions,
    );

    try {
      await assessmentQueue.add(
        "assessments",
        { interviewId },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        },
      );
    } catch (error) {
      throw new JobError("Failed to add assessment job to queue");
    }

    return updatedInterview;
  }
}
