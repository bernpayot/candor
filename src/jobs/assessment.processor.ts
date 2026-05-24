import { Job } from "bullmq";
import { formatTranscript } from "../utils/transcript.formatter.js";
import { InterviewRepository } from "../repositories/interview.repository.js";
import AppError, {
  NotFoundError,
  ExternalAPIError,
  ValidationError,
} from "../utils/errors.js";
import { buildAssessmentPrompt } from "../utils/prompt.builder.js";
import requireEnv from "../configs/env.checker.js";
import { AssessmentResponseSchema } from "../utils/assessment.schema.js";
import { logger } from "../configs/logger.js";

const repository = new InterviewRepository();

export async function assessmentProcessor(job: Job) {
  const { interviewId } = job.data;
  logger.info({ interviewId }, "Processing assessment.");

  const interviewAssessment =
    await repository.getInterviewForAssessment(interviewId);

  if (!interviewAssessment) {
    throw new NotFoundError(
      `Interview not found for assessment: ${interviewId}`,
    );
  }

  const transcript = formatTranscript(interviewAssessment.questions);

  const prompt = buildAssessmentPrompt(
    interviewAssessment.level.levelName,
    interviewAssessment.specialty.specialtyName,
    transcript,
  );

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("GROQ_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!response.ok) {
    throw new ExternalAPIError(`Groq API error: ${response.status}`);
  }

  const data = await response.json();

  const content = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    const validated = AssessmentResponseSchema.safeParse(parsed);

    if (!validated.success) {
      throw new ValidationError(
        `Groq assessment JSON failed validation: ${validated.error.message}`,
      );
    }

    return await repository.assessmentTransaction(validated.data, interviewId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new ValidationError("Invalid assessment response format");
  }
}
