-- HQ extended read and management functions for Nia HQ dashboard.
-- Accessible via session token verification (roles: master, product_manager, analyst, support, content_editor).

create or replace function cq_hq_list_accounts(p_token text, p_status text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','analyst','product_manager','support') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object('ok', true, 'accounts', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', acc.id,
      'email', acc.email,
      'role', acc.role,
      'name', acc.name,
      'facility', acc.facility,
      'cadre', acc.cadre,
      'status', acc.status,
      'created_at', acc.created_at,
      'last_login', acc.last_login
    ) order by acc.created_at desc), '[]'::jsonb)
    from cq_accounts acc
    where (p_status is null or acc.status = p_status)
  ));
end $$;

create or replace function cq_hq_list_invites(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','support','product_manager') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object('ok', true, 'invites', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', inv.id,
      'email', inv.email,
      'role', inv.role,
      'expires_at', inv.expires_at,
      'used_at', inv.used_at,
      'created_at', inv.created_at
    ) order by inv.created_at desc), '[]'::jsonb)
    from cq_invites inv
  ));
end $$;

create or replace function cq_hq_list_all_notices(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','product_manager','content_editor') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object('ok', true, 'notices', (
    select coalesce(jsonb_agg(to_jsonb(n) - 'created_by' order by n.created_at desc), '[]'::jsonb)
    from cq_notices n
  ));
end $$;

create or replace function cq_hq_delete_notice(p_token text, p_notice_id uuid) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a cq_accounts;
begin
  a := cq_session_account(p_token);
  if a.id is null or a.role not in ('master','product_manager','content_editor') then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  delete from cq_notices where id = p_notice_id;
  insert into cq_audit(actor, action, detail) values (a.id, 'delete_notice', jsonb_build_object('notice_id', p_notice_id));
  return jsonb_build_object('ok', true);
end $$;

grant execute on function cq_hq_list_accounts(text, text), cq_hq_list_invites(text),
  cq_hq_list_all_notices(text), cq_hq_delete_notice(text, uuid) to anon, authenticated;
