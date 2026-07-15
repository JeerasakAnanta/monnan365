-- Nan365 shared plan links — anonymous, permanent, link-based sharing of a
-- generated trip plan. The row is an immutable snapshot of the PlanApiResponse
-- JSON exactly as the user saw it; it is never updated after insert.
create table if not exists shared_plans (
  id uuid primary key default gen_random_uuid(),
  plan jsonb not null,
  constraint shared_plans_plan_size check (pg_column_size(plan) < 200000),
  created_at timestamptz not null default now()
);

alter table shared_plans enable row level security;

-- Public read: anyone holding the link can view it — the app has no auth to gate this,
-- and the whole point of the feature is a public, shareable URL.
drop policy if exists "shared_plans_public_read" on shared_plans;
create policy "shared_plans_public_read"
  on shared_plans for select
  to anon, authenticated
  using (true);

-- Deliberately NO insert/update/delete policy for anon/authenticated. Writes only
-- happen via POST /api/plan/share using the service role key (bypasses RLS) —
-- mirroring how `attractions` writes go only through scripts/seed.mjs with the
-- service role key (see 0001_attractions.sql). This keeps the "anon = read-only"
-- posture consistent across the whole schema.
