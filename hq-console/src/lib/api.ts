import { supabase } from './supabase';

export interface UserAccount {
  id: string;
  email: string;
  role: 'master' | 'product_manager' | 'content_editor' | 'analyst' | 'support' | 'clinician';
  name: string | null;
  facility: string | null;
  cadre: string | null;
  status: 'pending' | 'verified' | 'suspended';
  created_at: string;
  last_login: string | null;
}

export interface OverviewData {
  accounts: number;
  pending: number;
  events_24h: number;
  by_feature: Array<{ feature: string; n: number }>;
  rules: Array<{ rule_id: string; n: number; overruled: number; doubt: number }>;
}

export interface ReleaseConfig {
  version: string;
  lucy_model_name: string | null;
  lucy_model_url: string | null;
  lucy_model_sha256: string | null;
  lucy_model_bytes: number | null;
  voice_model_name: string | null;
  voice_model_url: string | null;
  voice_model_sha256: string | null;
  voice_model_bytes: number | null;
  min_app_version: string | null;
  locked: boolean;
  lock_message: string | null;
  wipe_on_lock: boolean;
  offline_grace_days: number;
  updated_at?: string;
}

export interface Notice {
  id: string;
  title_en: string;
  title_sw?: string | null;
  body_en?: string | null;
  body_sw?: string | null;
  level: 'info' | 'warn' | 'critical';
  audience: string;
  starts_at?: string;
  ends_at?: string | null;
  created_at: string;
}

export interface Invite {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

// Typed API callers
export async function apiLogin(email: string, password: string) {
  const { data, error } = await supabase.rpc('cq_login', {
    p_email: email,
    p_password: password,
  });
  if (error) throw new Error(error.message);
  return data as {
    ok: boolean;
    token?: string;
    role?: UserAccount['role'];
    name?: string | null;
    email?: string;
    facility?: string | null;
    error?: string;
  };
}

export async function apiGetOverview(token: string): Promise<OverviewData> {
  const { data, error } = await supabase.rpc('cq_hq_overview', { p_token: token });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to fetch overview');
  return data as OverviewData;
}

export async function apiListAccounts(token: string, status?: string): Promise<UserAccount[]> {
  const { data, error } = await supabase.rpc('cq_hq_list_accounts', {
    p_token: token,
    p_status: status || null,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to list accounts');
  return data.accounts as UserAccount[];
}

export async function apiListInvites(token: string): Promise<Invite[]> {
  const { data, error } = await supabase.rpc('cq_hq_list_invites', { p_token: token });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to list invites');
  return data.invites as Invite[];
}

export async function apiCreateInvite(token: string, email: string, role: string = 'clinician'): Promise<string> {
  const { data, error } = await supabase.rpc('cq_hq_create_invite', {
    p_token: token,
    p_email: email,
    p_role: role,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to generate invite');
  return data.key as string;
}

export async function apiApproveAccount(token: string, email: string, approve: boolean): Promise<boolean> {
  const { data, error } = await supabase.rpc('cq_hq_approve', {
    p_token: token,
    p_email: email,
    p_approve: approve,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Approval update failed');
  return true;
}

export async function apiListConfig(token: string): Promise<ReleaseConfig[]> {
  const { data, error } = await supabase.rpc('cq_hq_list_config', { p_token: token });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to fetch config');
  return data.rows as ReleaseConfig[];
}

export async function apiSetConfig(token: string, version: string, patch: Partial<ReleaseConfig>): Promise<boolean> {
  const { data, error } = await supabase.rpc('cq_hq_set_config', {
    p_token: token,
    p_version: version,
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to update release config');
  return true;
}

export async function apiListAllNotices(token: string): Promise<Notice[]> {
  const { data, error } = await supabase.rpc('cq_hq_list_all_notices', { p_token: token });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to fetch notices');
  return data.notices as Notice[];
}

export async function apiPostNotice(
  token: string,
  payload: {
    title_en: string;
    title_sw?: string;
    body_en?: string;
    body_sw?: string;
    level: string;
    audience: string;
    ends_at?: string | null;
  }
): Promise<boolean> {
  const { data, error } = await supabase.rpc('cq_hq_post_notice', {
    p_token: token,
    p_title_en: payload.title_en,
    p_title_sw: payload.title_sw || null,
    p_body_en: payload.body_en || null,
    p_body_sw: payload.body_sw || null,
    p_level: payload.level,
    p_audience: payload.audience,
    p_ends_at: payload.ends_at || null,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to broadcast notice');
  return true;
}

export async function apiDeleteNotice(token: string, noticeId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('cq_hq_delete_notice', {
    p_token: token,
    p_notice_id: noticeId,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to delete notice');
  return true;
}

export interface BetaApplication {
  id: string;
  ref_code: string;
  name: string;
  email: string;
  cadre: string;
  facility: string;
  mct_number: string | null;
  department: string | null;
  credential_path: string | null;
  status: 'pending' | 'approved' | 'rejected';
  otp_key: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export async function apiListApplications(token: string, status?: string): Promise<BetaApplication[]> {
  const { data, error } = await supabase.rpc('cq_hq_list_applications', {
    p_token: token,
    p_status: status || null,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to list applications');
  return data.applications as BetaApplication[];
}

export async function apiReviewApplication(
  token: string,
  appId: string,
  approve: boolean
): Promise<{ ok: boolean; key?: string; name?: string; email?: string; facility?: string; cadre?: string }> {
  const { data, error } = await supabase.rpc('cq_hq_review_application', {
    p_token: token,
    p_app_id: appId,
    p_approve: approve,
  });
  if (error) throw new Error(error.message);
  if (!data.ok) throw new Error(data.error || 'Failed to review application');
  return data;
}

