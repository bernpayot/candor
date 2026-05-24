import { z } from "zod";

export const AssessmentResponseSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
      questionRating: z.number().int().min(1).max(10),
      remarks: z.string(),
      topicReferences: z.array(z.string()),
    }),
  ),
  overall: z.object({
    overallGrade: z.number().int().min(1).max(10),
    description: z.string(),
  }),
});

export type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>;
