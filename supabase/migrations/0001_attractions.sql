-- Nan365 attractions dataset
create table if not exists attractions (
  id text primary key,
  name text not null,
  district text,
  category text[] not null default '{}',
  months_best smallint[] not null default '{}',
  season_note text,
  is_secondary boolean not null default false,
  is_community boolean not null default false,
  budget_level text check (budget_level in ('low', 'mid', 'premium')) default 'low',
  lat double precision,
  lng double precision,
  description text,
  contact text,
  created_at timestamptz not null default now()
);

create index if not exists attractions_months_best_idx on attractions using gin (months_best);
create index if not exists attractions_category_idx on attractions using gin (category);

alter table attractions enable row level security;

-- Public read-only access: the app only needs SELECT from the client/anon key.
-- Writes go through the seed script using the service role key, which bypasses RLS.
create policy if not exists "attractions_public_read"
  on attractions for select
  to anon, authenticated
  using (true);
