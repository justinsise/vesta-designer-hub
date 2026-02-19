-- ============================================================
-- Vesta Designer Hub - Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Reference table for project lookups (autofill)
-- Populate this from your Asset Manager / Eames data
create table if not exists projects (
  id text primary key,                    -- your internal project ID
  market text not null,                   -- SF, LA, NYC, FL
  address text not null,
  client_name text,
  sales_person text,
  designer text,
  created_at timestamptz default now()
);

-- 2. Main form submissions table
create table if not exists project_close_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by text not null,             -- email of submitter
  submitted_at timestamptz default now(),
  status text default 'submitted',        -- submitted, reviewed, flagged

  -- Section 1: Project Details
  project_id text not null,
  market text,
  address text,
  is_project_complete boolean,
  service_in_focus text,                  -- e.g. Staging, Design, Install
  design_style text,
  sales_personnel text,
  designer text,
  other_partners text,

  -- Section 2: Design & Inspiration
  design_inspiration text,
  hero_pieces text,                       -- min 3, SKUs with names
  favourite_aspect text,
  what_makes_property_unique text,
  favourite_room text,

  -- Section 3: Procurement & Inventory
  crew_performed_as_expected boolean,
  crew_notes text,
  procurement_purchased boolean,
  procured_items_added_to_eames boolean,
  items_usable_condition boolean,
  items_condition_notes text,
  reserving_difficult_categories text,
  design_ops_communication_clear boolean,
  design_ops_communication_notes text,

  -- Section 4: Install Day Operations
  adequate_prep_time text,               -- Yes / No / Other:reason
  schedule_received_before_5pm text,     -- Yes / No / Other:when
  notified_truck_departure boolean,
  team_arrived_on_time text,             -- Yes / No / Other:time
  lead_reviewed_plan boolean,
  adequate_property_protection boolean,
  received_everything_requested boolean,
  offloading_delays text,               -- Yes/No + details
  team_had_tools boolean,
  team_tools_missing text,
  client_onsite boolean,
  client_interfering text,              -- Yes/No + details
  trash_removed boolean,
  install_surprises text,               -- Yes/No + details
  other_contractors text,               -- Yes/No + details
  appropriate_resources text,           -- Yes / No / Other:reason
  had_reception_internet boolean,
  additional_services text,

  -- Section 5: Photography & Marketing
  worthy_of_photography boolean,
  photography_folder_link text,
  google_drive_photos_link text,
  social_campaign_notes text,

  -- Section 6: Final Reflections
  enough_time_to_prep boolean,
  prep_time_notes text
);

-- 3. Row Level Security (RLS)
alter table project_close_submissions enable row level security;
alter table projects enable row level security;

-- Anyone authenticated can read projects (for autofill)
create policy "Authenticated users can read projects"
  on projects for select
  to authenticated
  using (true);

-- Users can insert their own submissions
create policy "Users can insert own submissions"
  on project_close_submissions for insert
  to authenticated
  with check (submitted_by = auth.jwt() ->> 'email');

-- Users can read their own submissions
create policy "Users can read own submissions"
  on project_close_submissions for select
  to authenticated
  using (submitted_by = auth.jwt() ->> 'email');

-- 4. Create index for common queries
create index idx_submissions_project_id on project_close_submissions(project_id);
create index idx_submissions_submitted_by on project_close_submissions(submitted_by);
create index idx_submissions_submitted_at on project_close_submissions(submitted_at desc);
create index idx_submissions_market on project_close_submissions(market);

-- 5. Optional: Insert sample project data for testing
-- Uncomment and modify as needed:
-- insert into projects (id, market, address, sales_person, designer) values
--   ('VH-2025-001', 'SF', '123 Pacific Heights Blvd, San Francisco, CA', 'Jane Smith', 'Alex Rivera'),
--   ('VH-2025-002', 'LA', '456 Beverly Glen, Los Angeles, CA', 'Mike Johnson', 'Sarah Chen'),
--   ('VH-2025-003', 'NYC', '789 Park Avenue, New York, NY', 'Lisa Park', 'David Kim'),
--   ('VH-2025-004', 'FL', '321 Ocean Drive, Miami, FL', 'Tom Brown', 'Maria Lopez');
