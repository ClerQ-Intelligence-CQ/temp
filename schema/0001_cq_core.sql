-- Nia / ClerQ core. No Supabase Auth, no email confirm, no OTP.
-- Accounts live in cq_accounts; password check is a bcrypt compare inside RPCs.
create extension if not exists pgcrypto;

create table if not exists cq_accounts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  pw_hash text not null,
  role text not null default 'clinician'
    check (role in ('master','product_manager','content_editor','analyst','support','clinician')),
  name text, facility text, cadre text,
  status text not null default 'verified' check (status in ('pending','verified','suspended')),
  created_at timestamptz not null default now(),
  last_login timestamptz
);
create table if not exists cq_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null, role text not null default 'clinician',
  key_hash text not null, expires_at timestamptz not null default now() + interval '14 days',
  used_at timestamptz, created_by uuid references cq_accounts(id), created_at timestamptz default now()
);
create table if not exists cq_sessions (
  token_hash text primary key,
  account_id uuid not null references cq_accounts(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz default now()
);
create table if not exists cq_credentials (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references cq_accounts(id) on delete cascade,
  file_path text not null, status text default 'submitted', created_at timestamptz default now()
);
create table if not exists cq_usage_events (
  id bigint generated always as identity primary key,
  account_id uuid references cq_accounts(id) on delete set null,
  device_id text, app_version text,
  ts timestamptz not null default now(),
  feature text not null, action text,
  rule_id text,
  outcome text check (outcome in ('followed','overruled','doubt') or outcome is null),
  meta jsonb default '{}'::jsonb
);
create index if not exists cq_usage_ts on cq_usage_events(ts desc);
create index if not exists cq_usage_rule on cq_usage_events(rule_id);

alter table cq_accounts enable row level security;
alter table cq_invites enable row level security;
alter table cq_sessions enable row level security;
alter table cq_credentials enable row level security;
alter table cq_usage_events enable row level security;
-- no policies: tables are only reachable through the security-definer RPCs below.

create or replace function cq_session_account(p_token text) returns cq_accounts
language sql security definer set search_path = public, extensions as $$
  select a.* from cq_sessions s join cq_accounts a on a.id = s.account_id
  where s.token_hash = encode(digest(p_token,'sha256'),'hex') and s.expires_at > now() and a.status = 'verified'
$$;

create or replace function cq_login(p_email text, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts; tok text;
begin
  select * into a from cq_accounts where lower(email) = lower(trim(p_email));
  if not found or a.pw_hash <> crypt(p_password, a.pw_hash) then
    return jsonb_build_object('ok', false, 'error', 'bad_credentials'); end if;
  if a.status <> 'verified' then return jsonb_build_object('ok', false, 'error', a.status); end if;
  tok := encode(gen_random_bytes(32),'hex');
  insert into cq_sessions(token_hash, account_id) values (encode(digest(tok,'sha256'),'hex'), a.id);
  update cq_accounts set last_login = now() where id = a.id;
  return jsonb_build_object('ok', true, 'token', tok, 'role', a.role, 'name', a.name, 'email', a.email, 'facility', a.facility);
end $$;

create or replace function cq_redeem_invite(p_email text, p_key text, p_password text, p_name text, p_facility text, p_cadre text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare inv cq_invites;
begin
  select * into inv from cq_invites where lower(email)=lower(trim(p_email)) and used_at is null and expires_at > now()
    and key_hash = encode(digest(p_key,'sha256'),'hex') order by created_at desc limit 1;
  if not found then return jsonb_build_object('ok', false, 'error', 'invalid_key'); end if;
  if length(p_password) < 8 then return jsonb_build_object('ok', false, 'error', 'weak_password'); end if;
  insert into cq_accounts(email, pw_hash, role, name, facility, cadre, status)
    values (lower(trim(p_email)), crypt(p_password, gen_salt('bf')), inv.role, p_name, p_facility, p_cadre, 'pending')
    on conflict (email) do nothing;
  update cq_invites set used_at = now() where id = inv.id;
  return jsonb_build_object('ok', true, 'status', 'pending');
end $$;

create or replace function cq_ingest_usage(p_token text, p_events jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts; n int;
begin
  a := cq_session_account(p_token);
  if a.id is null then return jsonb_build_object('ok', false, 'error', 'unauthorized'); end if;
  insert into cq_usage_events(account_id, device_id, app_version, ts, feature, action, rule_id, outcome, meta)
  select a.id, e->>'device_id', e->>'app_version', coalesce((e->>'ts')::timestamptz, now()),
         e->>'feature', e->>'action', e->>'rule_id', nullif(e->>'outcome',''), coalesce(e->'meta','{}'::jsonb)
  from jsonb_array_elements(p_events) e where e->>'feature' is not null;
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'stored', n);
end $$;

-- HQ read side: master/analyst/product_manager only
create or replace function cq_hq_overview(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','analyst','product_manager','support') then
    return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  return jsonb_build_object('ok', true,
    'accounts', (select count(*) from cq_accounts where role='clinician'),
    'pending', (select count(*) from cq_accounts where status='pending'),
    'events_24h', (select count(*) from cq_usage_events where ts > now() - interval '24 hours'),
    'by_feature', (select coalesce(jsonb_agg(x),'[]') from (select feature, count(*) n from cq_usage_events where ts > now() - interval '7 days' group by 1 order by 2 desc limit 20) x),
    'rules', (select coalesce(jsonb_agg(x),'[]') from (select rule_id,
        count(*) n, count(*) filter (where outcome='overruled') overruled, count(*) filter (where outcome='doubt') doubt
        from cq_usage_events where rule_id is not null and ts > now() - interval '30 days' group by 1 order by 2 desc limit 100) x));
end $$;

create or replace function cq_hq_create_invite(p_token text, p_email text, p_role text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts; k text;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','support') then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  k := encode(gen_random_bytes(9),'hex');
  insert into cq_invites(email, role, key_hash, created_by) values (lower(trim(p_email)), p_role, encode(digest(k,'sha256'),'hex'), a.id);
  return jsonb_build_object('ok', true, 'key', k);  -- shown once; admin emails it
end $$;

create or replace function cq_hq_approve(p_token text, p_email text, p_approve boolean) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','support') then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  update cq_accounts set status = case when p_approve then 'verified' else 'suspended' end where lower(email)=lower(p_email);
  return jsonb_build_object('ok', true);
end $$;

revoke all on function cq_session_account(text) from public, anon, authenticated;
grant execute on function cq_login(text,text), cq_redeem_invite(text,text,text,text,text,text),
  cq_ingest_usage(text,jsonb), cq_hq_overview(text), cq_hq_create_invite(text,text,text), cq_hq_approve(text,text,boolean)
  to anon, authenticated;
