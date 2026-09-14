type SpreadsheetSyncAlert = {
  applicationId: string;
  attempts: number;
  status: "failed" | "not_configured" | "status_update_failed";
  error?: unknown;
};

function safeFailureReason(error: unknown) {
  if (!(error instanceof Error)) return "webhook request failed";
  if (error.name === "AbortError") return "webhook request timed out";

  const status = error.message.match(/status (\d{3})/i)?.[1];
  return status ? `webhook returned HTTP ${status}` : "webhook request failed";
}

export async function notifySpreadsheetSyncFailure({
  applicationId,
  attempts,
  status,
  error,
}: SpreadsheetSyncAlert) {
  const webhookUrl = process.env.DISCORD_CAREERS_ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("Careers spreadsheet sync needs attention, but the Discord alert webhook is not configured.");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "QMIND Careers Alerts",
        allowed_mentions: { parse: [] },
        content: [
          `[QMIND CAREERS ALERT] Spreadsheet sync ${status.replaceAll("_", " ")}`,
          `Application ID: ${applicationId}`,
          `Attempts: ${attempts}`,
          `Reason: ${safeFailureReason(error)}`,
          "Recovery: node scripts/recover-careers-spreadsheet.cjs",
        ].join("\n"),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) console.error("Discord careers alert failed:", response.status);
  } catch {
    console.error("Discord careers alert request failed");
  } finally {
    clearTimeout(timeout);
  }
}
