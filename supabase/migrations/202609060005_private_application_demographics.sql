begin;

create schema if not exists careers_private;
revoke all on schema careers_private from public, anon, authenticated;
grant usage on schema careers_private to service_role;

create table careers_private.application_demographics (
  application_id uuid primary key references public.applications(id) on delete cascade,
  responses jsonb not null check (jsonb_typeof(responses) = 'object')
);
alter table careers_private.application_demographics enable row level security;
revoke all on careers_private.application_demographics from public, anon, authenticated;
grant select, insert, update, delete on careers_private.application_demographics to service_role;

-- Preserve existing responses before removing them from the reviewer-facing row.
insert into careers_private.application_demographics (application_id, responses)
select id, demographic_responses from public.applications;
alter table public.applications drop column demographic_responses;

revoke all on public.applications from public, anon, authenticated;
grant select, insert, update, delete on public.applications to service_role;

-- Both records commit together; a failed private insert cannot lose responses.
create function public.save_careers_application(p_application jsonb, p_demographics jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.applications
  select * from jsonb_populate_record(null::public.applications, p_application);
  insert into careers_private.application_demographics (application_id, responses)
  values ((p_application->>'id')::uuid, p_demographics);
end;
$$;
revoke all on function public.save_careers_application(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.save_careers_application(jsonb, jsonb) to service_role;

-- A broad pre-existing storage policy must not accidentally include resumes.
-- Restrictive policies AND with existing permissive policies. The service role
-- bypasses RLS and retains access for uploads and bearer download links.
create policy "Exclude application resumes from browser roles"
on storage.objects as restrictive for all to anon, authenticated
using (bucket_id <> 'application-resumes')
with check (bucket_id <> 'application-resumes');

commit;
