-- Admin users table for Supabase Auth
-- Row-level: each admin can only see their own row.
-- The service role key is used for admin CRUD operations (bypasses RLS).

create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- Admin can read their own row
drop policy if exists "admin_users_self_read" on admin_users;
create policy "admin_users_self_read"
  on admin_users for select
  to authenticated
  using (auth.uid() = id);

-- Public has no access
-- Writes happen via service role key (bypasses RLS)
