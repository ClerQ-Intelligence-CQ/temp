-- HQ release control: model links, app lock, notices. Master edits, apps read.
create table if not exists cq_release_config (
  version text primary key,                 -- '*' = default, or an exact app version like '1.30.0'
  lucy_model_name text, lucy_model_url text, lucy_model_sha256 text, lucy_model_bytes bigint,
  voice_model_name text, voice_model_url text, voice_model_sha256 text, voice_model_bytes bigint,
  min_app_version text,                     -- older builds are locked with lock_message
  locked boolean not null default false,    -- lock this version now
  lock_message text,
  wipe_on_lock boolean not null default false, -- erase local data when locked (kill switch)
  offline_grace_days int not null default 30,  -- lock if the phone has not checked in for this long
  updated_by uuid references cq_accounts(id), updated_at timestamptz default now()
);
create table if not exists cq_notices (
  id uuid primary key default gen_random_uuid(),
  title_en text not null, title_sw text, body_en text, body_sw text,
  level text not null default 'info' check (level in ('info','warn','critical')),
  audience text not null default 'all',     -- 'all' or a role name
  starts_at timestamptz default now(), ends_at timestamptz,
  created_by uuid references cq_accounts(id), created_at timestamptz default now()
);
create table if not exists cq_audit (
  id bigint generated always as identity primary key,
  actor uuid references cq_accounts(id), action text, detail jsonb, at timestamptz default now()
);
alter table cq_release_config enable row level security;
alter table cq_notices enable row level security;
alter table cq_audit enable row level security;

insert into cq_release_config(version, lucy_model_name, lucy_model_url, lucy_model_sha256, lucy_model_bytes, voice_model_name, voice_model_url)
values ('*','gemma-3-270m-it-Q4_K_M','https://huggingface.co/lmstudio-community/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf','9b06391b17444a1ea4d0747145b54722b57bd32df715cc436d6011b8c356622a',253114496,
        'ggml-base-q5_1','https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base-q5_1.bin')
on conflict (version) do nothing;

-- Phones call this on launch. Token optional; if given we also say whether the account is still valid.
create or replace function cq_get_config(p_app_version text, p_token text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare c cq_release_config; a cq_accounts; acct text := 'anonymous'; role_ text;
begin
  select * into c from cq_release_config where version = p_app_version;
  if not found then select * into c from cq_release_config where version = '*'; end if;
  if p_token is not null then
    a := cq_session_account(p_token);
    if a.id is null then acct := 'revoked'; else acct := 'valid'; role_ := a.role; end if;
  end if;
  return jsonb_build_object('ok', true, 'now', now(), 'account', acct,
    'config', to_jsonb(c) - 'updated_by',
    'notices', (select coalesce(jsonb_agg(to_jsonb(n) - 'created_by' order by n.created_at desc),'[]') from cq_notices n
       where n.starts_at <= now() and (n.ends_at is null or n.ends_at > now()) and (n.audience = 'all' or n.audience = role_)));
end $$;

create or replace function cq_hq_set_config(p_token text, p_version text, p_patch jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role <> 'master' then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  insert into cq_release_config(version) values (p_version) on conflict do nothing;
  update cq_release_config set
    lucy_model_name = coalesce(p_patch->>'lucy_model_name', lucy_model_name),
    lucy_model_url = coalesce(p_patch->>'lucy_model_url', lucy_model_url),
    lucy_model_sha256 = coalesce(p_patch->>'lucy_model_sha256', lucy_model_sha256),
    lucy_model_bytes = coalesce((p_patch->>'lucy_model_bytes')::bigint, lucy_model_bytes),
    voice_model_name = coalesce(p_patch->>'voice_model_name', voice_model_name),
    voice_model_url = coalesce(p_patch->>'voice_model_url', voice_model_url),
    voice_model_sha256 = coalesce(p_patch->>'voice_model_sha256', voice_model_sha256),
    voice_model_bytes = coalesce((p_patch->>'voice_model_bytes')::bigint, voice_model_bytes),
    min_app_version = coalesce(p_patch->>'min_app_version', min_app_version),
    locked = coalesce((p_patch->>'locked')::boolean, locked),
    lock_message = coalesce(p_patch->>'lock_message', lock_message),
    wipe_on_lock = coalesce((p_patch->>'wipe_on_lock')::boolean, wipe_on_lock),
    offline_grace_days = coalesce((p_patch->>'offline_grace_days')::int, offline_grace_days),
    updated_by = a.id, updated_at = now()
  where version = p_version;
  insert into cq_audit(actor, action, detail) values (a.id, 'set_config', jsonb_build_object('version', p_version, 'patch', p_patch));
  return jsonb_build_object('ok', true);
end $$;

create or replace function cq_hq_list_config(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','product_manager') then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  return jsonb_build_object('ok', true, 'rows', (select coalesce(jsonb_agg(to_jsonb(c) - 'updated_by' order by version),'[]') from cq_release_config c));
end $$;

create or replace function cq_hq_post_notice(p_token text, p_title_en text, p_title_sw text, p_body_en text, p_body_sw text, p_level text, p_audience text, p_ends_at timestamptz) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','product_manager','content_editor') then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  insert into cq_notices(title_en,title_sw,body_en,body_sw,level,audience,ends_at,created_by) values (p_title_en,p_title_sw,p_body_en,p_body_sw,coalesce(p_level,'info'),coalesce(p_audience,'all'),p_ends_at,a.id);
  insert into cq_audit(actor, action, detail) values (a.id, 'post_notice', jsonb_build_object('title', p_title_en));
  return jsonb_build_object('ok', true);
end $$;

grant execute on function cq_get_config(text,text), cq_hq_set_config(text,text,jsonb), cq_hq_list_config(text),
  cq_hq_post_notice(text,text,text,text,text,text,text,timestamptz) to anon, authenticated;
