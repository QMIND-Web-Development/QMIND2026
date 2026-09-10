import { z } from "zod";
import { DEMOGRAPHIC_QUESTIONS, REFERRAL_OPTIONS } from "./config";

const optionalUrl = z.union([z.literal(""), z.string().url("Enter a complete URL.")]).optional();
const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

export const demographicSchema = z.record(z.string()).superRefine((responses, ctx) => {
  for (const [key, value] of Object.entries(responses)) {
    const question = DEMOGRAPHIC_QUESTIONS.find((item) => item.id === key);
    if (!question || ![...question.options, "Prefer not to answer"].includes(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Choose one of the available demographic responses." });
    }
  }
});

export const applicationDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120, "Keep your name to 120 characters."),
  pronouns: z.string().trim().max(60, "Keep your pronouns to 60 characters.").optional(),
  queensEmail: z
    .string()
    .email("Enter a valid email.")
    .refine((value) => value.toLowerCase().endsWith("@queensu.ca"), "Use your Queen's email."),
  preferredEmail: z.string().email("Enter a valid email."),
  graduationYear: z.string().regex(/^20\d{2}$/, "Enter a four-digit graduation year."),
  faculty: z.string().trim().min(2, "Enter your faculty.").max(100, "Keep your faculty to 100 characters."),
  major: z.string().trim().min(2, "Enter your major.").max(100, "Keep your major to 100 characters."),
  linkedIn: optionalUrl,
  github: optionalUrl,
  additionalProjects: z.string().trim().max(500, "Keep this response to 500 characters.").optional(),
  videoUrl: z.string().url("Enter a shareable video URL."),
  whyQmind: z
    .string()
    .trim()
    .min(20, "Tell us a little more.")
    .refine((value) => wordCount(value) <= 200, "Keep your response to 200 words."),
  skillsExperience: z
    .string()
    .trim()
    .min(20, "Tell us a little more.")
    .refine((value) => wordCount(value) <= 200, "Keep your response to 200 words."),
  funFact: z.string().trim().min(2, "Share a fun fact.").max(500, "Keep your fun fact to 500 characters."),
  referralSource: z.string().refine(
    (value) => REFERRAL_OPTIONS.some((option) => option === value),
    "Choose an option."
  ),
  referralOther: z.string().trim().max(120, "Keep this response to 120 characters.").optional(),
  socialConfirmed: z.boolean().refine(Boolean, "Please confirm that you have followed QMIND on Instagram and joined the Discord."),
  demographicResponses: demographicSchema,
  consent: z.boolean().refine(Boolean, "Consent is required to submit."),
});

export function hasValidReferralOther(data: { referralSource: string; referralOther?: string }) {
  return data.referralSource !== "Other" || Boolean(data.referralOther?.trim());
}
