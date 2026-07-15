-- Audit log for tracking admin changes
create table if not exists audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,          -- 'create', 'update', 'delete', 'config_change'
  entity_type text not null,     -- 'attraction', 'ai_config', 'shared_plan'
  entity_id text,
  details jsonb,                 -- { field: "name", old: "X", new: "Y" } or snapshot
  created_at timestamptz not null default now()
);

create index idx_audit_log_user_id on audit_log (user_id);
create index idx_audit_log_created_at on audit_log (created_at);
create index idx_audit_log_entity on audit_log (entity_type, entity_id);

alter table audit_log enable row level security;

-- Admin can read all audit logs
drop policy if exists "audit_log_admin_read" on audit_log;
create policy "audit_log_admin_read"
  on audit_log for select
  to authenticated
  using (exists (select 1 from admin_users where id = auth.uid()));

-- Writes happen via service role key (bypasses RLS)
