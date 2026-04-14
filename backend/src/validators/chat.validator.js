import { z } from "zod";

export const chatSchema = z.object({
  herbName: z
    .string()
    .min(1, "Herb name is required")
    .max(100, "Herb name too long"),

  question: z
    .string()
    .min(1, "Question is required")
    .max(500, "Question must be under 500 characters"),

  herbDetails: z.any().optional(),

  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      }),
    )
    .max(20)
    .optional(),
});
