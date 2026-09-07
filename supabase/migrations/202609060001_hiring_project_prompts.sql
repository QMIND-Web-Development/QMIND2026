create table public.hiring_project_prompts (
  project_id bigint primary key references public.projects(id) on delete cascade,
  prompt_text text not null check (length(btrim(prompt_text)) > 0),
  video_url text
);

alter table public.hiring_project_prompts enable row level security;
grant select on public.hiring_project_prompts to anon, authenticated;

create policy "Read prompts for published hiring projects"
on public.hiring_project_prompts for select to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = hiring_project_prompts.project_id
    and projects.published = true
    and projects.category in ('Consulting', 'Research')
));

comment on column public.hiring_project_prompts.prompt_text is
  'Written question, or equivalent transcript of the video prompt for accessibility and playback fallback.';
comment on column public.hiring_project_prompts.video_url is
  'Optional public Google Drive video share link. NULL for text-only prompts.';
