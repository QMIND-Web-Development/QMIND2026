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

  const { data: signedUrl, error: signedUrlError } = await admin.storage
    .from("application-resumes")
    .createSignedUrl(application.resume_storage_path, 60);

  if (signedUrlError || !signedUrl?.signedUrl) {
    return NOT_FOUND();
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}
