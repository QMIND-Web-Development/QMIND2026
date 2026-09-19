-- Allow the trusted server-only backfill command to replay every application,
-- including records whose status was incorrectly marked as synced.
create or replace function public.get_all_careers_applications()
returns setof jsonb
language sql
security definer
set search_path = pg_catalog, public, careers_private
as $$
  select (to_jsonb(applications) - 'resume_storage_path') || jsonb_build_object(
    'demographic_responses', coalesce(application_demographics.responses, '{}'::jsonb)
  )
    from public.applications
    left join careers_private.application_demographics
      on application_demographics.application_id = applications.id
   order by applications.submitted_at, applications.id;
$$;

revoke all on function public.get_all_careers_applications() from public, anon, authenticated;
grant execute on function public.get_all_careers_applications() to service_role;
