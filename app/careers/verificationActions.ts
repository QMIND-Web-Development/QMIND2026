"use server";

import { randomInt, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/utils/supabase/admin";
import { createEmailProof, EMAIL_PROOF_SECONDS, hashEmailCode, normalizeEmail } from "./emailProof";

const emailSchema = z.string().trim().email().max(254);
const purposeSchema = z.enum(["queens", "preferred"]);

export async function requestEmailCode(email: string, purpose: "queens" | "preferred") {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success || !purposeSchema.safeParse(purpose).success) return { ok: false as const, message: "Enter a valid email address." };
  const address = normalizeEmail(parsed.data);
  if (purpose === "queens" && !address.endsWith("@queensu.ca")) return { ok: false as const, message: "Use your Queen's email address." };
  const admin = createAdminClient();
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CAREERS_EMAIL_FROM;
  if (!admin || !apiKey || !from) return { ok: false as const, message: "Email verification is not configured. Please try again later." };

  try {
    const challengeId = randomUUID();
    const code = randomInt(0, 100000000).toString().padStart(8, "0");
    const { data, error } = await admin.rpc("request_careers_email_code", {
      p_email: address, p_challenge_id: challengeId, p_code_hash: hashEmailCode(challengeId, code),
    });
    if (error) return { ok: false as const, message: "We could not request a code. Please try again later." };
    if (data !== true) return { ok: false as const, message: "Please wait before requesting another code. Each address can receive up to five codes per hour." };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": challengeId },
      body: JSON.stringify({ from, to: [address], subject: "Verify your QMIND application email", text: `Your QMIND application verification code is ${code}. It expires in 10 minutes. Enter it only on the QMIND application form. If you did not request this code, ignore this email.` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { ok: false as const, message: "We could not send your code. Please wait a minute and try again." };
    // Bind the code exchange to this browser and the selected email field.
    cookies().set(`careers-challenge-${purpose}`, challengeId, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/careers", maxAge: 600,
    });
    return { ok: true as const, message: "Code sent. Check your inbox and spam folder." };
  } catch {
    return { ok: false as const, message: "We could not send your code. Please try again later." };
  }
}

export async function verifyEmailCode(code: string, purpose: "queens" | "preferred") {
  if (!z.string().regex(/^\d{8}$/).safeParse(code).success || !purposeSchema.safeParse(purpose).success) {
    return { ok: false as const, message: "Enter the eight-digit code from your email." };
  }
  const challengeId = cookies().get(`careers-challenge-${purpose}`)?.value;
  const admin = createAdminClient();
  if (!admin || !challengeId || !z.string().uuid().safeParse(challengeId).success) return { ok: false as const, message: "Request a new code in this browser." };
  try {
    const { data, error } = await admin.rpc("verify_careers_email_code", {
      p_challenge_id: challengeId, p_code_hash: hashEmailCode(challengeId, code),
    });
    if (error || typeof data !== "string") return { ok: false as const, message: "That code is invalid or expired. After five attempts, request a new code." };
    cookies().set(`careers-verified-${purpose}`, createEmailProof(data), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/careers", maxAge: EMAIL_PROOF_SECONDS,
    });
    return { ok: true as const, email: data, message: "Email verified for one hour." };
  } catch {
    return { ok: false as const, message: "We could not verify your code. Please try again." };
  }
}
