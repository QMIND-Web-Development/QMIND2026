const RECOVERY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;
const RECOVERY_PAGE_SIZE = 1000;

function buildSpreadsheetApplication(row, siteUrl) {
  return {
    applicationId: row.id,
    submittedAt: row.submitted_at,
    fullName: row.full_name,
    pronouns: row.pronouns,
    queensEmail: row.queens_email,
    preferredEmail: row.preferred_email,
    graduationYear: row.graduation_year,
    faculty: row.faculty,
    major: row.major,
    linkedIn: row.linkedin_url,
    github: row.github_url,
    additionalProjects: row.additional_projects,
    videoUrl: row.video_url,
    whyQmind: row.why_qmind,
    skillsExperience: row.skills_experience,
    funFact: row.fun_fact,
    referralSource: row.referral_source,
    referralOther: row.referral_other,
    socialConfirmed: row.social_confirmed,
    demographicResponses: row.demographic_responses || {},
    consent: row.consent,
    rankedProjectTitles: row.ranked_project_titles,
    resumeUrl: `${siteUrl}/careers/resumes/${encodeURIComponent(row.id)}`,
  };
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readApplications(supabase, rpcName, missingMigrationMessage) {
  const rows = [];
  let offset = 0;

  while (true) {
    const request = supabase.rpc(rpcName);
    const canPaginate = typeof request.range === 'function';
    const pageRequest = canPaginate
      ? request.range(offset, offset + RECOVERY_PAGE_SIZE - 1)
      : request;
    const { data, error } = await pageRequest;
    if (error) {
      if (error.code === 'PGRST202') {
        throw new Error(missingMigrationMessage);
      }
      throw new Error(`Could not read applications: ${error.message}`);
    }

    const page = data || [];
    rows.push(...page);
    if (page.length < RECOVERY_PAGE_SIZE || !canPaginate) break;
    offset += page.length;
  }

  return rows;
}

function readFailedApplications(supabase) {
  return readApplications(
    supabase,
    'get_failed_careers_applications',
    'The recovery migration is not available to Supabase yet. Apply ' +
      'supabase/migrations/careers/202609140001_failed_application_recovery.sql, ' +
      "then run NOTIFY pgrst, 'reload schema'; and retry."
  );
}

function readAllApplications(supabase) {
  return readApplications(
    supabase,
    'get_all_careers_applications',
    'The spreadsheet backfill migration is not available to Supabase yet. Apply ' +
      'supabase/migrations/careers/202609170001_all_careers_spreadsheet_backfill.sql, ' +
      "then run NOTIFY pgrst, 'reload schema'; and retry."
  );
}

async function postToWebhook({ application, webhookUrl, webhookSecret, fetchImpl, sleepImpl = sleep }) {
  let lastError;

  for (let attempt = 0; attempt < RECOVERY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchImpl(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookSecret, application }),
        cache: 'no-store',
      });
      const result = await response.json();

      if (!response.ok) throw new Error(`Webhook returned HTTP ${response.status}`);
      if (!result.ok) throw new Error(result.error || 'Webhook rejected the application');
      return result;
    } catch (error) {
      lastError = error;
      if (attempt + 1 < RECOVERY_ATTEMPTS) await sleepImpl(RETRY_DELAY_MS);
    }
  }

  throw lastError;
}

async function recoverFailedApplications({
  supabase,
  webhookUrl,
  webhookSecret,
  siteUrl,
  fetchImpl = fetch,
  sleepImpl = sleep,
  logError = console.error,
}) {
  const rows = await readFailedApplications(supabase);

  let synced = 0;
  let failed = 0;

  for (const [index, row] of (rows || []).entries()) {
    try {
      await postToWebhook({
        application: buildSpreadsheetApplication(row, siteUrl),
        webhookUrl,
        webhookSecret,
        fetchImpl,
        sleepImpl,
      });

      const { error: updateError } = await supabase
        .from('applications')
        .update({ spreadsheet_status: 'synced' })
        .eq('id', row.id)
        .eq('spreadsheet_status', 'failed');
      if (updateError) throw new Error(`Could not update sync status: ${updateError.message}`);

      synced += 1;
    } catch (error) {
      failed += 1;
      logError(`Recovery failed for record ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { found: (rows || []).length, synced, failed };
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
  const summary = await recoverFailedApplications({
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
    console.error(error instanceof Error ? error.message : 'Recovery failed');
    process.exitCode = 1;
  });
}

module.exports = {
  buildSpreadsheetApplication,
  postToWebhook,
  readAllApplications,
  readFailedApplications,
  recoverFailedApplications,
};
