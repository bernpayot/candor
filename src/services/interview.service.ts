import { InterviewRepository } from "../repositories/interview.repository.js";
import AppError, {
  ConflictError,
  NotFoundError,
  ExternalAPIError,
  UnauthorizedError,
} from "../utils/errors.js";
import requireEnv from "../configs/env.checker.js";
import { AI_MODEL, AI_VOICE } from "../configs/constants.js";

export class InterviewService {
  constructor(private repository: InterviewRepository) {}

  async getLevels() {
    const levels = await this.repository.getLevels();

    if (levels === null) {
      throw new NotFoundError("Levels not found.");
    }

    return levels;
  }

  async getSpecialties() {
    const specialties = await this.repository.getSpecialties();

    if (specialties === null) {
      throw new NotFoundError("Specialties not found.");
    }

    return specialties;
  }

  async createInterview(userId: string, levelId: string, specialtyId: string) {
    const checkActiveInterview =
      await this.repository.checkActiveInterview(userId);

    if (checkActiveInterview !== null) {
      throw new ConflictError(
        "You are already inside an interview! Finish that first.",
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

  async updateInterviewStatus(userId: string, interviewId: string) {
    const interview = await this.repository.getInterview(interviewId);

    if (!interview) {
      throw new NotFoundError("Interview doesn't exist.");
    }

    if (interview.userId !== userId) {
      throw new UnauthorizedError("");
    }
  }
}
