-- Keep project catalogue visibility independent from careers eligibility.
-- Existing projects retain the previous careers behaviour unless explicitly
-- excluded below.
alter table public.projects
  add column if not exists is_hiring boolean not null default true;

update public.projects
   set is_hiring = false
 where id between 98 and 115;

update public.projects
   set is_hiring = true
 where id between 118 and 127;

comment on column public.projects.is_hiring is
  'Whether this published project is available for selection in the careers application.';

drop policy if exists "Read prompts for published hiring projects"
  on public.hiring_project_prompts;

create policy "Read prompts for published hiring projects"
on public.hiring_project_prompts for select to anon, authenticated
using (exists (
  select 1
    from public.projects
   where projects.id = hiring_project_prompts.project_id
     and projects.published = true
     and projects.is_hiring = true
     and projects.category in ('Consulting', 'Research')
));
