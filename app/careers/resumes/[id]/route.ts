import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

const NOT_FOUND = () => new NextResponse("Resume not found", { status: 404 });

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(params.id)) {
    return NOT_FOUND();
  }

  const admin = createAdminClient();
  if (!admin) {
    return new NextResponse("Resume service is not configured", { status: 503 });
  }

  const { data: application, error: applicationError } = await admin
    .from("applications")
    .select("resume_storage_path")
    .eq("id", params.id)
    .maybeSingle();

  if (applicationError || !application?.resume_storage_path) {
    return NOT_FOUND();
  }

  const { data: resume, error: resumeError } = await admin.storage
    .from("application-resumes")
    .download(application.resume_storage_path);

  if (resumeError || !resume) {
    return NOT_FOUND();
  }

  const fileName = application.resume_storage_path.split("/").pop() || "resume";
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const contentType = safeFileName.toLowerCase().endsWith(".docx")
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/pdf";

  return new NextResponse(resume, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `inline; filename="${safeFileName}"`,
      "Content-Type": contentType,
    },
  });
}
