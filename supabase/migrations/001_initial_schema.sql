-- CareerNify MVP schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  college text,
  degree text,
  department text,
  graduation_year integer,
  cgpa numeric(4,2),
  preferred_role text,
  preferred_location text,
  avatar_path text,
  resume_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'admin')),
  created_at timestamptz default now(),
  unique (user_id, role)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  description text
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  proficiency_level integer not null check (proficiency_level between 0 and 100),
  target_level integer not null check (target_level between 0 and 100),
  updated_at timestamptz default now(),
  unique (user_id, skill_id)
);

create table if not exists public.career_paths (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.career_path_skills (
  id uuid primary key default gen_random_uuid(),
  career_path_id uuid not null references public.career_paths(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  required_level integer not null default 50 check (required_level between 0 and 100),
  unique (career_path_id, skill_id)
);

create table if not exists public.career_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb,
  result_summary text,
  created_at timestamptz default now()
);

create table if not exists public.career_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_path_id uuid not null references public.career_paths(id) on delete cascade,
  match_score integer not null check (match_score between 0 and 100),
  created_at timestamptz default now()
);

create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  career_path_id uuid references public.career_paths(id) on delete set null,
  title text not null,
  description text,
  estimated_hours integer,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  title text not null,
  resource_url text,
  resource_type text not null,
  sort_order integer default 1,
  created_at timestamptz default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  learning_resource_id uuid not null references public.learning_resources(id) on delete cascade,
  status text not null check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, learning_resource_id)
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('technical', 'hr', 'behavioral', 'general')),
  target_role text,
  question_text text not null,
  difficulty text default 'medium',
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.mock_interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text,
  category text not null,
  status text not null check (status in ('draft', 'in_progress', 'completed')) default 'draft',
  score integer,
  feedback text,
  started_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.mock_interviews(id) on delete cascade,
  question_id uuid not null references public.interview_questions(id) on delete cascade,
  answer_text text,
  feedback text,
  score integer,
  created_at timestamptz default now(),
  unique (interview_id, question_id)
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  title text not null,
  description text,
  location text,
  required_skills jsonb,
  salary_min integer,
  salary_max integer,
  application_url text,
  deadline timestamptz,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, job_id)
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  status text not null check (status in ('saved', 'applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'withdrawn')) default 'saved',
  applied_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, job_id)
);

create table if not exists public.placement_drives (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  title text not null,
  description text,
  eligibility_criteria text,
  event_date timestamptz,
  deadline timestamptz,
  application_url text,
  status text not null check (status in ('draft', 'published', 'closed')) default 'draft',
  created_at timestamptz default now()
);

create table if not exists public.drive_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  drive_id uuid not null references public.placement_drives(id) on delete cascade,
  status text not null check (status in ('applied', 'under_review', 'selected', 'rejected', 'withdrawn')) default 'applied',
  applied_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, drive_id)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  duration_minutes integer,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_text text not null,
  options jsonb,
  correct_answer text,
  points integer default 1,
  sort_order integer default 1
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb,
  score integer,
  status text not null check (status in ('in_progress', 'submitted')) default 'in_progress',
  started_at timestamptz default now(),
  submitted_at timestamptz
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  issuer text,
  issue_date date,
  credential_id text,
  file_path text,
  verification_status text not null check (verification_status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  category text not null,
  description text not null,
  status text not null check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  admin_response text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notification_preferences jsonb default '{"email": true, "push": true, "sms": false}'::jsonb,
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_user on public.profiles(id);
create index if not exists idx_user_skills_user on public.user_skills(user_id);
create index if not exists idx_career_recommendations_user on public.career_recommendations(user_id);
create index if not exists idx_learning_progress_user on public.learning_progress(user_id);
create index if not exists idx_jobs_published on public.jobs(is_published);
create index if not exists idx_drives_status on public.placement_drives(status);
create index if not exists idx_support_tickets_user on public.support_tickets(user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

create trigger user_skills_updated_at
before update on public.user_skills
for each row
execute function public.handle_updated_at();

create trigger user_preferences_updated_at
before update on public.user_preferences
for each row
execute function public.handle_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'admin'
  );
$$;

create or replace function public.create_profile_for_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, created_at, updated_at)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New User'), now(), now())
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  insert into public.user_preferences (user_id, notification_preferences)
  values (new.id, '{"email": true, "push": true, "sms": false}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.create_profile_for_user();
