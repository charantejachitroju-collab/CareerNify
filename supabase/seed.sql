-- Demo seed data for CareerNify
insert into public.skills (id, name, category, description)
values
  (gen_random_uuid(), 'JavaScript', 'Programming', 'Modern front-end and backend scripting'),
  (gen_random_uuid(), 'HTML/CSS', 'Web Development', 'Structure and styling skills'),
  (gen_random_uuid(), 'SQL', 'Databases', 'Querying and analysis'),
  (gen_random_uuid(), 'Problem Solving', 'Problem Solving', 'Analytical thinking and debugging'),
  (gen_random_uuid(), 'Communication', 'Communication', 'Presentation and collaboration')
on conflict do nothing;

insert into public.career_paths (id, title, description, category, is_published)
values
  (gen_random_uuid(), 'Full-Stack Developer', 'Designs interfaces and builds backend systems.', 'Technology', true),
  (gen_random_uuid(), 'Data Analyst', 'Transforms raw data into business insight.', 'Analytics', true),
  (gen_random_uuid(), 'UI/UX Designer', 'Designs user-friendly digital experiences.', 'Design', true)
on conflict do nothing;

insert into public.jobs (id, company_name, title, description, location, required_skills, salary_min, salary_max, application_url, deadline, is_published)
values
  (gen_random_uuid(), 'Demo Company', 'Junior Frontend Engineer', 'Build polished user interfaces and accessible interactions.', 'Bengaluru', '["JavaScript", "HTML/CSS"]', 500000, 900000, 'https://example.com/apply', now() + interval '20 days', true),
  (gen_random_uuid(), 'Demo Hiring', 'Data Analyst Intern', 'Support dashboarding and reporting.', 'Remote', '["SQL", "Communication"]', 300000, 600000, 'https://example.com/apply', now() + interval '15 days', true)
on conflict do nothing;

insert into public.placement_drives (id, company_name, title, description, eligibility_criteria, event_date, deadline, application_url, status)
values
  (gen_random_uuid(), 'Infosys', 'Campus Software Engineer Drive', 'Engineering roles for final-year students.', 'B.Tech final year / 2026 graduates', now() + interval '10 days', now() + interval '6 days', 'https://example.com/drive', 'published'),
  (gen_random_uuid(), 'TCS', 'Professional Hiring Program', 'Operations and product talent recruitment.', 'Open to students with internships and good communication skills', now() + interval '18 days', now() + interval '12 days', 'https://example.com/drive', 'published')
on conflict do nothing;

insert into public.interview_questions (id, category, target_role, question_text, difficulty, is_published)
values
  (gen_random_uuid(), 'technical', 'Frontend Developer', 'What is the difference between let and var in JavaScript?', 'easy', true),
  (gen_random_uuid(), 'hr', 'General', 'Why do you want to work with this company?', 'easy', true),
  (gen_random_uuid(), 'behavioral', 'General', 'Describe a time you solved a problem under pressure.', 'medium', true)
on conflict do nothing;

insert into public.assessments (id, title, description, category, duration_minutes, is_published)
values
  (gen_random_uuid(), 'Career Readiness Check', 'A quick assessment on communication, logic, and problem solving.', 'career', 20, true),
  (gen_random_uuid(), 'Technical Fundamentals', 'A short general technical assessment.', 'technical', 30, true)
on conflict do nothing;

insert into public.learning_paths (id, career_path_id, title, description, estimated_hours, is_published)
values
  (gen_random_uuid(), null, 'Frontend Foundations', 'Build core front-end knowledge and UI design skills.', 12, true),
  (gen_random_uuid(), null, 'Data Analytics Core', 'Learn data analysis, queries, and dashboarding.', 15, true)
on conflict do nothing;
