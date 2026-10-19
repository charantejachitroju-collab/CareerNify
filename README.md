# CareerNify

CareerNify is a responsive career guidance and placement platform built with plain HTML, CSS, and vanilla JavaScript using Supabase as the backend.

## Features

- Student authentication with Supabase Auth
- Protected routes and role-aware UI
- Dashboard with progress cards and career insights
- Skill analysis with progress tracking
- Learning paths and mock interview practice
- Job recommendations and placement drive management
- Assessment workflow and certificate management
- Support tickets and notification tracking
- Admin dashboard for moderated content and student oversight
- Private PDF, DOCX, and TXT resume uploads with browser-based career matching and improvement suggestions on the dashboard

## Project structure

- `index.html` – landing page
- `login.html`, `register.html`, `forgot-password.html`, `reset-password.html` – auth flows
- Module pages under the root for dashboard, career intelligence, learning paths, and more
- `admin/` – admin-only pages
- `css/` – shared design system styles
- `js/` – app logic and Supabase integration
- `supabase/migrations/` – SQL schema and RLS policies
- `supabase/seed.sql` – sample content and demo data

## Local setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set your project URL and anon key.
3. In the frontend, configure the values in `js/config.js` or update the runtime globals used by the app.
4. Apply SQL migrations from `supabase/migrations/`, including `003_resume_analysis.sql` for private resume uploads and analysis history.
5. Seed sample data from `supabase/seed.sql`.
6. Run a static server, for example:

   ```bash
   python -m http.server 8000
   ```

7. Open `http://localhost:8000` in your browser.

## Supabase setup checklist

1. Create a new project in Supabase.
2. Enable Email auth and configure redirect URLs.
3. Create storage buckets for `avatars`, `resumes`, and `certificates`.
4. Apply all migration files under `supabase/migrations/`.
5. Add RLS policies and seed sample records.
6. Create an admin account using a secure SQL or admin workflow, not by opening a browser-only loophole.

Resume review supports text-based PDF, DOCX, and TXT files up to 5 MB. Resume text is analyzed in the browser; the original file and its generated summary are saved in the private `resumes` bucket and owner-protected `resume_analyses` table. The matching is keyword-based guidance, not an employment or qualification guarantee.

## Deployment

Deploy the static frontend to Netlify or Vercel. Set the production redirect URL inside Supabase auth settings and ensure the publishable key is exposed only as a client-side API key.

## Notes

- Sample content is clearly labeled as demo data.
- Real credentials must never be committed to this repository.
- This MVP favors secure, rule-based logic and protected database access rather than exposing secrets in the browser.

## SQL and security references

The database schema under `supabase/migrations/` includes:

- User profile tables
- Role checks and admin permissions
- Skills and career-path tracking
- Jobs, placement drives, assessments, and certificates
- Notifications and support tickets
- Storage-access-aware RLS policies

## Current status

The project is structured for a working MVP and includes scaffolded UI pages, shared styling, and the core database/migration design needed for deployment with Supabase.
