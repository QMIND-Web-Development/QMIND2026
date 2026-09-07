-- Compatibility for installations that already applied the original storage-based migration.
alter table public.hiring_project_prompts add column if not exists video_url text;
comment on column public.hiring_project_prompts.video_url is
  'Optional public Google Drive video share link. NULL for text-only prompts.';
-- Old video_path values and any existing bucket are left untouched; the app uses video_url.
