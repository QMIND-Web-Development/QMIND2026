import { createClient } from "@/utils/supabase/server";
import LoginForm from "./loginForm";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const supabase = createClient();
  const userRes = await supabase.auth.getUser();
  //@ts-ignore
  if (userRes?.user) redirect("/");
  const next = searchParams?.next;
  const redirectTo = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  return <LoginForm redirectTo={redirectTo} />;
}
