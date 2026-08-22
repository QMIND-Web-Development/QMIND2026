import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import CareersApplication from "./CareersApplication";
import type { HiringProject } from "./types";

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

  return (
    <main id="main-content">
      <CareersApplication
        projects={(data || []) as HiringProject[]}
        projectsUnavailable={Boolean(error)}
      />
    </main>
  );
}
