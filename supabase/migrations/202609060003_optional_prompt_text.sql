-- Support a custom text question OR a Drive video without requiring a transcript.
alter table public.hiring_project_prompts
  add column if not exists prompt_text text;

alter table public.hiring_project_prompts
  alter column prompt_text drop not null;

comment on column public.hiring_project_prompts.prompt_text is
  'Optional custom text question. Leave NULL for video-only prompts; may also contain a video transcript.';
