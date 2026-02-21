-- ============================================================
-- Vesta Designer Hub — Production Migration
-- Moves existing tables from public → vesta / designer_hub
-- Run this on your EXISTING production Supabase project
-- ============================================================

-- IMPORTANT: This will move your existing data. Back up first if needed.
-- In Supabase: Settings → Database → Backups

begin;

-- 1. Create schemas
create schema if not exists vesta;
create schema if not exists designer_hub;

-- 2. Grant access to Supabase roles
grant usage on schema vesta to anon, authenticated, service_role;
grant usage on schema designer_hub to anon, authenticated, service_role;

alter default privileges in schema vesta grant all on tables to anon, authenticated, service_role;
alter default privileges in schema designer_hub grant all on tables to anon, authenticated, service_role;

-- 3. Move tables (this preserves all data, indexes, and constraints)
alter table public.projects set schema vesta;
alter table public.project_close_submissions set schema designer_hub;

-- 4. Drop old RLS policies (they reference the old schema path)
drop policy if exists "Authenticated users can read projects" on vesta.projects;
drop policy if exists "Users can insert own submissions" on designer_hub.project_close_submissions;
drop policy if exists "Users can read own submissions" on designer_hub.project_close_submissions;

-- 5. Recreate RLS policies on new schema
create policy "Authenticated users can read projects"
  on vesta.projects for select
  to authenticated
  using (true);

create policy "Users can insert own submissions"
  on designer_hub.project_close_submissions for insert
  to authenticated
  with check (submitted_by = auth.jwt() ->> 'email');

create policy "Users can read own submissions"
  on designer_hub.project_close_submissions for select
  to authenticated
  using (submitted_by = auth.jwt() ->> 'email');

commit;

-- ============================================================
-- AFTER running this migration:
-- 1. Go to Supabase → Settings → API → Exposed schemas
-- 2. Add: vesta, designer_hub
-- 3. Save
-- ============================================================
