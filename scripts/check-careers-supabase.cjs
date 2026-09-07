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
      const { count, error, status } = await client.from(table).select('*', { head: true, count: 'exact' });
      console.log(JSON.stringify({ table, role, status, count, error: error ? { code: error.code, message: error.message } : null }));
      // HEAD permission failures have no JSON error body; use the HTTP status.
      const deniedApplicationRead = role === 'anon' && table === 'applications' && (error?.code === '42501' || status === 401 || status === 403);
      if ((error && !deniedApplicationRead) || (role === 'anon' && table === 'applications' && count > 0)) process.exitCode = 1;
    }
  }
  const { data, error } = await clients.service_role.storage.getBucket('application-resumes');
  console.log(JSON.stringify({ bucket: data ? {
    id: data.id, public: data.public, file_size_limit: data.file_size_limit,
    allowed_mime_types: data.allowed_mime_types,
  } : null, error: error?.message }));
  if (error || !data || data.public || Number(data.file_size_limit) !== 8388608) process.exitCode = 1;
  if (clients.anon) {
    const listing = await clients.anon.storage.from('application-resumes').list('', { limit: 1 });
    console.log(JSON.stringify({ check: 'anonymous resume listing', returnedEntries: listing.data?.length ?? null, errorCode: listing.error?.statusCode ?? null }));
    if (listing.data?.length || (listing.error && !['401', '403'].includes(String(listing.error.statusCode)))) process.exitCode = 1;
  }
  const response = await fetch(`${url}/rest/v1/`, { headers: {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  } });
  if (!response.ok) throw new Error('API schema unavailable');
  const schema = await response.json();
  const migrated = Boolean(schema.paths?.['/rpc/save_careers_application']) && !schema.definitions?.applications?.properties?.demographic_responses;
  console.log(JSON.stringify({ check: 'demographic migration API schema', migrated }));
  if (!migrated) process.exitCode = 1;
})().catch(() => { console.error('Deployment check failed'); process.exitCode = 1; });
