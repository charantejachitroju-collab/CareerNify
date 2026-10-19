alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.career_paths enable row level security;
alter table public.career_path_skills enable row level security;
alter table public.career_assessments enable row level security;
alter table public.career_recommendations enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_resources enable row level security;
alter table public.learning_progress enable row level security;
alter table public.interview_questions enable row level security;
alter table public.mock_interviews enable row level security;
alter table public.interview_answers enable row level security;
alter table public.jobs enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.placement_drives enable row level security;
alter table public.drive_applications enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.user_preferences enable row level security;

create policy "profiles_are_viewable_by_owner"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_can_be_updated_by_owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "user_roles_readable_by_owner_only"
on public.user_roles
for select
using (auth.uid() = user_id);

create policy "students_cannot_modify_roles"
on public.user_roles
for update
using (false)
with check (false);

create policy "skills_are_publicly_readable"
on public.skills
for select
using (true);

create policy "user_skills_are_owned"
on public.user_skills
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_career_paths_are_readable"
on public.career_paths
for select
using (is_published = true);

create policy "career_path_skills_readable_publicly"
on public.career_path_skills
for select
using (true);

create policy "career_assessments_are_owned"
on public.career_assessments
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "career_recommendations_are_owned"
on public.career_recommendations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "published_learning_paths_are_public"
on public.learning_paths
for select
using (is_published = true);

create policy "learning_resources_are_public_if_parent_published"
on public.learning_resources
for select
using (exists (
  select 1 from public.learning_paths lp
  where lp.id = learning_path_id and lp.is_published = true
));

create policy "learning_progress_owned"
on public.learning_progress
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "published_interview_questions_public"
on public.interview_questions
for select
using (is_published = true);

create policy "mock_interviews_owned"
on public.mock_interviews
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "interview_answers_owned"
on public.interview_answers
for all
using (exists (
  select 1 from public.mock_interviews mi
  where mi.id = interview_id and mi.user_id = auth.uid()
))
with check (exists (
  select 1 from public.mock_interviews mi
  where mi.id = interview_id and mi.user_id = auth.uid()
));

create policy "public_jobs_readable_when_published"
on public.jobs
for select
using (is_published = true);

create policy "saved_jobs_owned"
on public.saved_jobs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "applications_owned"
on public.job_applications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "published_drives_readable"
on public.placement_drives
for select
using (status = 'published');

create policy "drive_applications_owned"
on public.drive_applications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "published_assessments_readable"
on public.assessments
for select
using (is_published = true);

create policy "assessment_questions_readable_when_assessment_published"
on public.assessment_questions
for select
using (exists (
  select 1 from public.assessments a
  where a.id = assessment_id and a.is_published = true
));

create policy "assessment_attempts_owned"
on public.assessment_attempts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "certificates_owned"
on public.certificates
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notifications_owned"
on public.notifications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "support_tickets_owned"
on public.support_tickets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "preferences_owned"
on public.user_preferences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "admin_can_manage_content"
on public.career_paths
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_can_manage_jobs"
on public.jobs
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_can_manage_drives"
on public.placement_drives
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_can_manage_assessments"
on public.assessments
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_can_manage_tickets"
on public.support_tickets
for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin_can_manage_questions"
on public.interview_questions
for all
using (public.is_admin())
with check (public.is_admin());
