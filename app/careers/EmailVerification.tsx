"use client";

import { useState } from "react";
import { requestEmailCode, verifyEmailCode } from "./verificationActions";

export default function EmailVerification({ email, purpose }: { email: string; purpose: "queens" | "preferred" }) {
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const verified = verifiedEmail === email.trim().toLowerCase();

  async function run(check: boolean) {
    setBusy(true);
    try {
      const result = check ? await verifyEmailCode(code, purpose) : await requestEmailCode(email, purpose);
      setMessage(result.message);
      if (result.ok) {
        if ("email" in result && typeof result.email === "string") setVerifiedEmail(result.email);
        else setSent(true);
      }
    } catch {
      setMessage("We could not reach the verification service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div>
    {!verified && <button type="button" disabled={busy || !email} onClick={() => run(false)}>{sent ? "Send a new code" : "Send verification code"}</button>}
    {sent && !verified && <div>
      <label htmlFor={`verification-${purpose}`}>Email verification code</label>
      <input id={`verification-${purpose}`} value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={8} />
      <button type="button" disabled={busy || code.length !== 8} onClick={() => run(true)}>Verify email</button>
    </div>}
    <p role="status">{verified ? "Email verified. Verification lasts one hour." : message}</p>
  </div>;
}
