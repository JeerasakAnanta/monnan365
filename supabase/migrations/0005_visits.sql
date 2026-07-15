create table visits (
  id          bigserial primary key,
  ip_hash     text not null,
  path        text not null default '/',
  visited_at  timestamptz not null default now()
);

create index idx_visits_ip_hash on visits (ip_hash);
create index idx_visits_visited_at on visits (visited_at);
