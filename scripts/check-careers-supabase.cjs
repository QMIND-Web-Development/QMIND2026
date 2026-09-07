// Read-only deployment checks. Prints counts/configuration, never applicant data or keys.
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');

(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  let role;
  try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch {}
  const clients = { service_role: createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY) };
  if (key.startsWith('sb_publishable_') || role === 'anon') {
    clients.anon = createClient(url, key);
  } else {
    console.error('Public key is not a publishable/anon key. Anonymous access checks skipped. Replace it; rotate it if a privileged key was exposed.');
    process.exitCode = 1;
  }
  for (const table of ['applications', 'hiring_project_prompts']) {
    for (const [role, client] of Object.entries(clients)) {
      const { count, error } = await client.from(table).select('*', { head: true, count: 'exact' });
      console.log(JSON.stringify({ table, role, count, error: error ? { code: error.code, message: error.message } : null }));
    }
  }
  const { data, error } = await clients.service_role.storage.getBucket('application-resumes');
  console.log(JSON.stringify({ bucket: data ? {
    id: data.id, public: data.public, file_size_limit: data.file_size_limit,
    allowed_mime_types: data.allowed_mime_types,
  } : null, error: error?.message }));
})().catch(() => { console.error('Deployment check failed'); process.exitCode = 1; });
