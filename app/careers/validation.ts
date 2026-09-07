import { z } from "zod";
import { DEMOGRAPHIC_QUESTIONS } from "./config";

export const demographicSchema = z.record(z.string()).superRefine((responses, ctx) => {
  for (const [key, value] of Object.entries(responses)) {
    const question = DEMOGRAPHIC_QUESTIONS.find((item) => item.id === key);
    if (!question || ![...question.options, "Prefer not to answer"].includes(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Choose one of the available demographic responses." });
    }
  }
});
