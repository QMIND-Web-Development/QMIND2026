"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { CAREERS_CONFIG } from "./config";
import { createAdminClient } from "@/utils/supabase/admin";
import { exportApplicationToSpreadsheet } from "./spreadsheet";
import type { ApplicationPayload } from "./types";
import { applicationDetailsSchema, hasValidReferralOther } from "./validation";

const applicationSchema = applicationDetailsSchema.extend({
  rankedProjectIds: z.array(z.number().int()).length(3).refine((ids) => new Set(ids).size === 3),
  rankedProjectTitles: z.array(z.string()).length(3),
}).refine(hasValidReferralOther, {
  path: ["referralOther"],
  message: "Tell us how you heard about QMIND.",
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
    .eq("published", true)
    .eq("is_hiring", true);

  if (!projects || projects.length !== 3) {
    return { ok: false, message: "One of your selected projects is no longer accepting applications." };
  }

  // Titles displayed to reviewers must come from the validated project records.
  payload.rankedProjectTitles = payload.rankedProjectIds.map((id) =>
    projects.find((project) => project.id === id)!.projectTitle
  );

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
  const { error: insertError } = await supabase.rpc("save_careers_application", { p_application: {
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
    consent: payload.consent,
    ranked_project_ids: payload.rankedProjectIds,
    ranked_project_titles: payload.rankedProjectTitles,
    resume_storage_path: resumePath,
    spreadsheet_status: "pending",
  }, p_demographics: payload.demographicResponses });

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
  let spreadsheetError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const spreadsheet = await exportApplicationToSpreadsheet({
        ...payload,
        applicationId,
        submittedAt,
        resumeStoragePath: resumePath,
        resumeUrl: getResumeUrl(applicationId),
      });
      spreadsheetStatus = spreadsheet.status;
      spreadsheetError = undefined;
      break;
    } catch (error) {
      spreadsheetError = error;
    }
  }
  if (spreadsheetError) {
    spreadsheetStatus = "failed";
    console.error(
      "Careers spreadsheet export failed after retry:",
      spreadsheetError instanceof Error ? spreadsheetError.message : "Unknown error"
    );
  }

  await supabase
    .from("applications")
    .update({ spreadsheet_status: spreadsheetStatus })
    .eq("id", applicationId);

  return { ok: true, applicationId, spreadsheetStatus };
}

function getResumeUrl(applicationId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  }

  return `${siteUrl}/careers/resumes/${applicationId}`;
}
