create table if not exists public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists resume_analyses_user_created_idx
  on public.resume_analyses (user_id, created_at desc);

alter table public.resume_analyses enable row level security;

drop policy if exists "resume_analyses_owned" on public.resume_analyses;
create policy "resume_analyses_owned"
on public.resume_analyses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, delete on table public.resume_analyses to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "resume_files_owned_select" on storage.objects;
create policy "resume_files_owned_select"
on storage.objects
for select
using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "resume_files_owned_insert" on storage.objects;
create policy "resume_files_owned_insert"
on storage.objects
for insert
with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "resume_files_owned_delete" on storage.objects;
create policy "resume_files_owned_delete"
on storage.objects
for delete
using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
