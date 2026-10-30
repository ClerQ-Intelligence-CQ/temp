-- 0004_beta_pipeline.sql
-- Complete Clinical Beta Application, Vetting, and Key Verification Pipeline
-- Secure security-definer RPCs for public intake and operator vetting.

create table if not exists cq_beta_applications (
  id uuid primary key default gen_random_uuid(),
  ref_code text unique not null,
  name text not null,
  email text not null,
  cadre text not null,
  facility text not null,
  mct_number text,
  department text,
  credential_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  otp_key text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references cq_accounts(id)
);

create index if not exists idx_cq_beta_app_ref on cq_beta_applications(ref_code);
create index if not exists idx_cq_beta_app_email on cq_beta_applications(email);
create index if not exists idx_cq_beta_app_status on cq_beta_applications(status);

alter table cq_beta_applications enable row level security;
-- No public direct table policies; access mediated via security-definer RPCs below.

-- 1. Public RPC: Submit Clinical Beta Application from website
create or replace function cq_submit_beta_application(
  p_name text,
  p_email text,
  p_cadre text,
  p_facility text,
  p_mct text,
  p_dept text default null,
  p_credential_path text default null
) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_ref text;
  v_existing uuid;
begin
  if length(trim(p_email)) < 5 or length(trim(p_name)) < 2 then
    return jsonb_build_object('ok', false, 'error', 'invalid_input');
  end if;

  -- Generate unique deterministic reference ID: e.g. CQ-BETA-78F2
  v_ref := 'CQ-BETA-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));

  insert into cq_beta_applications(ref_code, name, email, cadre, facility, mct_number, department, credential_path)
  values (v_ref, trim(p_name), lower(trim(p_email)), trim(p_cadre), trim(p_facility), trim(p_mct), trim(p_dept), p_credential_path);

  return jsonb_build_object('ok', true, 'ref_code', v_ref);
end $$;

-- 2. Public RPC: Check Application Status via Save Link / Ref Code
create or replace function cq_check_beta_status(p_ref text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  app cq_beta_applications;
begin
  select * into app from cq_beta_applications where ref_code = upper(trim(p_ref));
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  return jsonb_build_object(
    'ok', true,
    'ref_code', app.ref_code,
    'name', app.name,
    'facility', app.facility,
    'cadre', app.cadre,
    'status', app.status,
    'created_at', app.created_at
  );
end $$;

-- 3. Public RPC: Validate Single-Use Key for Verified Download Portal
create or replace function cq_verify_beta_key(p_email text, p_key text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  inv cq_invites;
begin
  select * into inv from cq_invites
  where lower(email) = lower(trim(p_email))
    and key_hash = encode(digest(trim(p_key), 'sha256'), 'hex')
    and used_at is null
    and expires_at > now()
  order by created_at desc limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_key');
  end if;

  return jsonb_build_object(
    'ok', true,
    'download_url', '/builds/nia-v1.36.0.apk',
    'version', '1.47.2',
    'sha256', '9b06391b17444a1ea4d0747145b54722b57bd32df715cc436d6011b8c356622a'
  );
end $$;

-- 4. HQ Operator RPC: List Incoming Beta Applications
create or replace function cq_hq_list_applications(p_token text, p_status text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master', 'support', 'product_manager') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object('ok', true, 'applications', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', app.id,
      'ref_code', app.ref_code,
      'name', app.name,
      'email', app.email,
      'cadre', app.cadre,
      'facility', app.facility,
      'mct_number', app.mct_number,
      'department', app.department,
      'credential_path', app.credential_path,
      'status', app.status,
      'otp_key', app.otp_key,
      'created_at', app.created_at,
      'reviewed_at', app.reviewed_at
    ) order by app.created_at desc), '[]'::jsonb)
    from cq_beta_applications app
    where (p_status is null or app.status = p_status)
  ));
end $$;

-- 5. HQ Operator RPC: Accept / Reject Application & Issue OTP Key
create or replace function cq_hq_review_application(
  p_token text,
  p_app_id uuid,
  p_approve boolean
) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  a cq_accounts;
  app cq_beta_applications;
  k text;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master', 'support') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select * into app from cq_beta_applications where id = p_app_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'application_not_found');
  end if;

  if p_approve then
    -- Generate unique 9-byte random hex key
    k := encode(gen_random_bytes(9), 'hex');

    -- Insert into cq_invites so the mobile app can redeem it
    insert into cq_invites(email, role, key_hash, created_by)
    values (app.email, 'clinician', encode(digest(k, 'sha256'), 'hex'), a.id);

    -- Update application status
    update cq_beta_applications
    set status = 'approved',
        otp_key = k,
        reviewed_at = now(),
        reviewed_by = a.id
    where id = p_app_id;

    -- Audit log
    insert into cq_audit(actor, action, detail)
    values (a.id, 'approve_beta_app', jsonb_build_object('app_id', p_app_id, 'email', app.email));

    return jsonb_build_object(
      'ok', true,
      'key', k,
      'name', app.name,
      'email', app.email,
      'facility', app.facility,
      'cadre', app.cadre
    );
  else
    update cq_beta_applications
    set status = 'rejected',
        reviewed_at = now(),
        reviewed_by = a.id
    where id = p_app_id;

    insert into cq_audit(actor, action, detail)
    values (a.id, 'reject_beta_app', jsonb_build_object('app_id', p_app_id, 'email', app.email));

    return jsonb_build_object('ok', true, 'status', 'rejected');
  end if;
end $$;

grant execute on function cq_submit_beta_application(text, text, text, text, text, text, text),
  cq_check_beta_status(text), cq_verify_beta_key(text, text),
  cq_hq_list_applications(text, text), cq_hq_review_application(text, uuid, boolean)
  to anon, authenticated;
