import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import CareersApplication from "./CareersApplication";
import type { HiringProject } from "./types";
import { getDrivePreviewUrl } from "./driveVideo";

export const metadata: Metadata = {
  title: "Careers | QMIND",
  description:
    "Explore QMIND Consulting and Research projects and apply to join a design team.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, projectTitle, category, shortDescription, impactDescription, tags")
    .in("category", ["Consulting", "Research"])
    .eq("published", true)
    .order("category")
    .order("projectTitle");

  const projects = (data || []) as HiringProject[];
  if (projects.length) {
    // Keep listings usable when the optional prompt configuration is unavailable.
    const { data: prompts, error: promptError } = await supabase
      .from("hiring_project_prompts")
      .select("project_id, prompt_text, video_url")
      .in("project_id", projects.map((project) => project.id));

    if (promptError) console.error("Unable to load hiring prompts:", promptError.code);
    for (const project of projects) {
      const prompt = prompts?.find((item) => item.project_id === project.id);
      if (!prompt) continue;
      project.promptText = prompt.prompt_text;
      project.promptVideoUrl = getDrivePreviewUrl(prompt.video_url);
    }
  }

  return (
    <main id="main-content">
      <CareersApplication
        projects={projects}
        projectsUnavailable={Boolean(error)}
      />
    </main>
  );
}
