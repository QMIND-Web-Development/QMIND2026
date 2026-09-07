import { createHmac, timingSafeEqual } from "crypto";

export const EMAIL_PROOF_SECONDS = 60 * 60;
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

function secret() {
  const value = process.env.CAREERS_VERIFICATION_SECRET;
  if (!value || value.length < 32) throw new Error("Email verification is not configured");
  return value;
}

export function hashEmailCode(challengeId: string, code: string) {
  return createHmac("sha256", secret()).update(`code:${challengeId}:${code}`).digest("hex");
}

export function createEmailProof(email: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email: normalizeEmail(email), expires: now + EMAIL_PROOF_SECONDS * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(`proof:${payload}`).digest("base64url");
  return `${payload}.${signature}`;
}

export function validateEmailProof(proof: string | undefined, email: string, now = Date.now()) {
  if (!proof || proof.length > 2048) return false;
  try {
    const [payload, signature, extra] = proof.split(".");
    if (!payload || !signature || extra !== undefined) return false;
    const expected = createHmac("sha256", secret()).update(`proof:${payload}`).digest();
    const supplied = Buffer.from(signature, "base64url");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.email === normalizeEmail(email) && typeof data.expires === "number" && data.expires > now;
  } catch {
    return false;
  }
}
