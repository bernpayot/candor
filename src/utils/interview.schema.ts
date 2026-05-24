import { z } from "zod";

const InterviewParamsSchema = z.object({
  id: z.string().uuid(),
});

const TranscriptQuestionSchema = z.object({
  questionText: z.string(),
  userAnswer: z.string(),
  sequenceOrder: z.number(),
});

export const CreateInterviewSchema = z.object({
  body: z.object({
    levelId: z.string().uuid(),
    specialtyId: z.string().uuid(),
  }),
});

export const CompleteInterviewSchema = z.object({
  body: z.object({
    transcript: z.array(TranscriptQuestionSchema).min(1),
  }),
  params: InterviewParamsSchema,
});
