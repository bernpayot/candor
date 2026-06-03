import { z } from "zod";

export const CompleteProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    timezone: z.string().min(1),
  }),
});
