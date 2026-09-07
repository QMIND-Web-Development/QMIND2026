create table if not exists public.applications (
  id uuid primary key,
  submitted_at timestamptz not null default now(),
  full_name text not null,
  pronouns text,
  queens_email text not null,
  preferred_email text not null unique,
  graduation_year integer not null,
  faculty text not null,
  major text not null,
  linkedin_url text,
  github_url text,
  additional_projects text,
  video_url text not null,
  why_qmind text not null,
  skills_experience text not null,
  fun_fact text not null,
  referral_source text not null,
  referral_other text,
  social_confirmed boolean not null default false,
  demographic_responses jsonb not null default '{}'::jsonb,
  consent boolean not null,
  ranked_project_ids bigint[] not null,
  ranked_project_titles text[] not null,
  resume_storage_path text not null,
  spreadsheet_status text not null default 'pending',
  constraint exactly_three_projects check (
    cardinality(ranked_project_ids) = 3 and cardinality(ranked_project_titles) = 3
  )
);

alter table public.applications enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-resumes',
  'application-resumes',
  false,
  8388608,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.applications is
  'Immutable careers applications. Access is restricted to the service role.';
