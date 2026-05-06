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

  herbDetails: z
    .object({
      commonName: z.string().max(200).nullable().optional(),
      family: z.string().max(200).nullable().optional(),
      genus: z.string().max(200).nullable().optional(),
      observationOrgan: z.string().max(100).nullable().optional(),
      confidence: z.number().min(0).max(1).nullable().optional(),
      wikipediaUrl: z.string().url().nullable().optional(),
    })
    .optional(),

  activeModel: z.enum(["gemini", "groq"]).nullable().optional(),

  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .max(20)
    .optional(),
});