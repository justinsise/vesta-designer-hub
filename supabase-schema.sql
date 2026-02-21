-- ============================================================
-- Vesta Designer Hub — Fresh Schema Setup
-- Run this on any NEW Supabase project (e.g. staging)
-- ============================================================

-- 1. Create schemas
create schema if not exists vesta;
create schema if not exists designer_hub;

-- 2. Grant access to Supabase roles
grant usage on schema vesta to anon, authenticated, service_role;
grant usage on schema designer_hub to anon, authenticated, service_role;

-- Grant default privileges so future tables are also accessible
alter default privileges in schema vesta grant all on tables to anon, authenticated, service_role;
alter default privileges in schema designer_hub grant all on tables to anon, authenticated, service_role;

-- ============================================================
-- VESTA schema — shared reference data from AM/Design Studio
-- ============================================================

create table vesta.projects (
  id text primary key,
  market text not null,
  address text not null,
  client_name text,
  sales_person text,
  designer text,
  created_at timestamptz default now()
);

alter table vesta.projects enable row level security;

create policy "Authenticated users can read projects"
  on vesta.projects for select
  to authenticated
  using (true);

-- ============================================================
-- DESIGNER_HUB schema — project close forms and designer data
-- ============================================================

create table designer_hub.project_close_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by text not null,
  submitted_at timestamptz default now(),
  status text default 'submitted',

  -- Section 1: Project Details
  project_id text not null,
  market text,
  address text,
  is_project_complete boolean,
  service_in_focus text,
  design_style text,
  sales_personnel text,
  designer text,
  other_partners text,

  -- Section 2: Design & Inspiration
  design_inspiration text,
  hero_pieces text,
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
  adequate_prep_time text,
  schedule_received_before_5pm text,
  notified_truck_departure boolean,
  team_arrived_on_time text,
  lead_reviewed_plan boolean,
  adequate_property_protection boolean,
  received_everything_requested boolean,
  offloading_delays text,
  team_had_tools boolean,
  team_tools_missing text,
  client_onsite boolean,
  client_interfering text,
  trash_removed boolean,
  install_surprises text,
  other_contractors text,
  appropriate_resources text,
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

alter table designer_hub.project_close_submissions enable row level security;

create policy "Users can insert own submissions"
  on designer_hub.project_close_submissions for insert
  to authenticated
  with check (submitted_by = auth.jwt() ->> 'email');

create policy "Users can read own submissions"
  on designer_hub.project_close_submissions for select
  to authenticated
  using (submitted_by = auth.jwt() ->> 'email');

create index idx_dh_submissions_project_id
  on designer_hub.project_close_submissions(project_id);
create index idx_dh_submissions_submitted_by
  on designer_hub.project_close_submissions(submitted_by);
create index idx_dh_submissions_submitted_at
  on designer_hub.project_close_submissions(submitted_at desc);
create index idx_dh_submissions_market
  on designer_hub.project_close_submissions(market);

-- ============================================================
-- Sample data (uncomment for staging testing)
-- ============================================================
-- insert into vesta.projects (id, market, address, sales_person, designer) values
--   ('VH-2025-001', 'San Francisco', '123 Pacific Heights Blvd, San Francisco, CA', 'Jane Smith', 'Alex Rivera'),
--   ('VH-2025-002', 'Los Angeles', '456 Beverly Glen, Los Angeles, CA', 'Mike Johnson', 'Sarah Chen'),
--   ('VH-2025-003', 'New York City', '789 Park Avenue, New York, NY', 'Lisa Park', 'David Kim'),
--   ('VH-2025-004', 'Florida', '321 Ocean Drive, Miami, FL', 'Tom Brown', 'Maria Lopez');
