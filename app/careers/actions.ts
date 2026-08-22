"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { CAREERS_CONFIG } from "./config";
import { createAdminClient } from "@/utils/supabase/admin";
import { exportApplicationToSpreadsheet } from "./spreadsheet";
import type { ApplicationPayload } from "./types";

const optionalUrl = z.union([z.literal(""), z.string().url()]).optional();
const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  pronouns: z.string().trim().max(60).optional(),
  queensEmail: z.string().email().refine((value) => value.toLowerCase().endsWith("@queensu.ca"), {
    message: "Use your Queen's email address.",
  }),
  preferredEmail: z.string().email(),
  graduationYear: z.string().regex(/^20\d{2}$/),
  faculty: z.string().trim().min(2).max(100),
  major: z.string().trim().min(2).max(100),
  linkedIn: optionalUrl,
  github: optionalUrl,
  additionalProjects: z.string().trim().max(500).optional(),
  videoUrl: z.string().url(),
  whyQmind: z.string().trim().min(20).refine((value) => wordCount(value) <= 200),
  skillsExperience: z.string().trim().min(20).refine((value) => wordCount(value) <= 200),
  funFact: z.string().trim().min(2).max(500),
  referralSource: z.enum(["Social Media", "Word of Mouth", "Through Queen's", "Google", "Other"]),
  referralOther: z.string().trim().max(120).optional(),
  socialConfirmed: z.boolean(),
  demographicResponses: z.record(z.string()),
  consent: z.literal(true),
  rankedProjectIds: z.array(z.number().int()).length(3).refine((ids) => new Set(ids).size === 3),
  rankedProjectTitles: z.array(z.string()).length(3),
});

export type SubmitApplicationResult =
  | { ok: true; applicationId: string; spreadsheetStatus: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitApplication(formData: FormData): Promise<SubmitApplicationResult> {
  const rawPayload = formData.get("application");
  const resume = formData.get("resume");

  if (typeof rawPayload !== "string" || !(resume instanceof File)) {
    return { ok: false, message: "Your application or resume is missing." };
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(rawPayload);
  } catch {
    return { ok: false, message: "We could not read your application." };
  }

  const result = applicationSchema.safeParse(parsedPayload);
  if (!result.success) {
    return {
      ok: false,
      message: "Review the highlighted fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const payload = result.data as ApplicationPayload;
  const extension = resume.name.split(".").pop()?.toLowerCase();
  const validExtension = extension === "pdf" || extension === "docx";
  const validMime = CAREERS_CONFIG.resumeTypes.includes(resume.type as never) || resume.type === "";

  if (!validExtension || !validMime || resume.size > CAREERS_CONFIG.resumeMaxBytes) {
    return { ok: false, message: "Upload a PDF or DOCX resume no larger than 8 MB." };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { ok: false, message: "Applications are not configured yet. Please try again later." };
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, projectTitle, category")
    .in("id", payload.rankedProjectIds)
    .in("category", ["Consulting", "Research"])
    .eq("published", true);

  if (!projects || projects.length !== 3) {
    return { ok: false, message: "One of your selected projects is no longer accepting applications." };
  }

  const applicationId = randomUUID();
  const safeEmail = payload.preferredEmail.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
  const resumePath = `${applicationId}/${safeEmail}.${extension}`;
  const resumeBuffer = Buffer.from(await resume.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("application-resumes")
    .upload(resumePath, resumeBuffer, { contentType: resume.type, upsert: false });

  if (uploadError) {
    return { ok: false, message: "We could not upload your resume. Please try again." };
  }

  const submittedAt = new Date().toISOString();
  const { error: insertError } = await supabase.from("applications").insert({
    id: applicationId,
    submitted_at: submittedAt,
    full_name: payload.fullName,
    pronouns: payload.pronouns || null,
    queens_email: payload.queensEmail.toLowerCase(),
    preferred_email: payload.preferredEmail.toLowerCase(),
    graduation_year: Number(payload.graduationYear),
    faculty: payload.faculty,
    major: payload.major,
    linkedin_url: payload.linkedIn || null,
    github_url: payload.github || null,
    additional_projects: payload.additionalProjects || null,
    video_url: payload.videoUrl,
    why_qmind: payload.whyQmind,
    skills_experience: payload.skillsExperience,
    fun_fact: payload.funFact,
    referral_source: payload.referralSource,
    referral_other: payload.referralOther || null,
    social_confirmed: payload.socialConfirmed,
    demographic_responses: payload.demographicResponses,
    consent: payload.consent,
    ranked_project_ids: payload.rankedProjectIds,
    ranked_project_titles: payload.rankedProjectTitles,
    resume_storage_path: resumePath,
    spreadsheet_status: "pending",
  });

  if (insertError) {
    await supabase.storage.from("application-resumes").remove([resumePath]);
    const duplicate = insertError.code === "23505";
    return {
      ok: false,
      message: duplicate
        ? "An application has already been submitted with this preferred email."
        : "We could not save your application. Please try again.",
    };
  }

  let spreadsheetStatus = "not_configured";
  try {
    const spreadsheet = await exportApplicationToSpreadsheet({
      ...payload,
      applicationId,
      submittedAt,
      resumeStoragePath: resumePath,
    });
    spreadsheetStatus = spreadsheet.status;
  } catch {
    spreadsheetStatus = "failed";
  }

  await supabase
    .from("applications")
    .update({ spreadsheet_status: spreadsheetStatus })
    .eq("id", applicationId);

  return { ok: true, applicationId, spreadsheetStatus };
}
