import type { ApplicationPayload } from "./types";

type SpreadsheetApplication = ApplicationPayload & {
  applicationId: string;
  submittedAt: string;
  resumeStoragePath: string;
  resumeUrl: string;
};

export async function exportApplicationToSpreadsheet(
  application: SpreadsheetApplication
) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return { status: "not_configured" as const };
  }

  // Individual demographics must never leave restricted database storage.
  const {
    resumeStoragePath: _resumeStoragePath,
    demographicResponses: _demographicResponses,
    ...spreadsheetApplication
  } = application;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhookSecret,
      application: spreadsheetApplication,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spreadsheet export failed with status ${response.status}`);
  }

  const result = (await response.json()) as { ok?: boolean; error?: string };
  if (!result.ok) {
    throw new Error(result.error || "Spreadsheet export was rejected");
  }

  return { status: "synced" as const };
}
