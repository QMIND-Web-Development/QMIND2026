const {
  buildSpreadsheetApplication,
  postToWebhook,
  readAllApplications,
} = require('./recover-careers-spreadsheet.cjs');

async function backfillApplications({
  supabase,
  webhookUrl,
  webhookSecret,
  siteUrl,
  fetchImpl = fetch,
  sleepImpl,
  logError = console.error,
}) {
  const rows = await readAllApplications(supabase);
  let added = 0;
  let existing = 0;
  let failed = 0;

  for (const [index, row] of rows.entries()) {
    try {
      const result = await postToWebhook({
        application: buildSpreadsheetApplication(row, siteUrl),
        webhookUrl,
        webhookSecret,
        fetchImpl,
        sleepImpl,
      });

      if (result.duplicate === true) existing += 1;
      else added += 1;

      const { error: updateError } = await supabase
        .from('applications')
        .update({ spreadsheet_status: 'synced' })
        .eq('id', row.id);
      if (updateError) throw new Error(`Could not update sync status: ${updateError.message}`);
    } catch (error) {
      failed += 1;
      logError(`Backfill failed for record ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { found: rows.length, added, existing, failed };
}

async function main() {
  require('@next/env').loadEnvConfig(process.cwd());

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'GOOGLE_SHEETS_WEBHOOK_URL',
    'GOOGLE_SHEETS_WEBHOOK_SECRET',
  ];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  const summary = await backfillApplications({
    supabase,
    webhookUrl: process.env.GOOGLE_SHEETS_WEBHOOK_URL,
    webhookSecret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
    siteUrl,
  });

  console.log(JSON.stringify(summary));
  if (summary.failed > 0) process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Spreadsheet backfill failed');
    process.exitCode = 1;
  });
}

module.exports = { backfillApplications };
