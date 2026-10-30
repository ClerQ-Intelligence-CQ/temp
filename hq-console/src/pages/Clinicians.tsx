import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Check,
  X,
  Copy,
  CheckCircle,
  Search,
  Filter,
  Building2,
  Calendar,
  Key,
  Mail,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  apiListAccounts,
  apiApproveAccount,
  apiCreateInvite,
  apiListInvites,
  apiListApplications,
  apiReviewApplication,
  UserAccount,
  Invite,
  BetaApplication,
} from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Clinicians: React.FC = () => {
  const { token, user } = useAuth();
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [applications, setApplications] = useState<BetaApplication[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Vetting Dossier Modal (cq_beta_applications)
  const [selectedApplication, setSelectedApplication] = useState<BetaApplication | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState<boolean>(false);

  // Clinician Account Inspector Modal (cq_accounts)
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);

  // Email Dispatch Modal after Approval
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [dispatchedKey, setDispatchedKey] = useState<string | null>(null);
  const [dispatchedApp, setDispatchedApp] = useState<BetaApplication | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Manual Invite Key Modal
  const [manualInviteModalOpen, setManualInviteModalOpen] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualRole, setManualRole] = useState('clinician');
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [copiedManualKey, setCopiedManualKey] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [accs, apps, invs] = await Promise.all([
        apiListAccounts(token).catch(() => []),
        apiListApplications(token).catch(() => []),
        apiListInvites(token).catch(() => []),
      ]);
      setAccounts(accs || []);
      setApplications(apps || []);
      setInvites(invs || []);
    } catch (err: unknown) {
      console.error('Failed to load clinician directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Vetting & Approval Workflow: Generates unique OTP, creates cq_invites, and prepares personal email
  const handleApproveApplication = async (app: BetaApplication) => {
    if (!token) return;
    setActionLoading(true);
    try {
      const res = await apiReviewApplication(token, app.id, true);
      if (!res.ok || !res.key) throw new Error('No key returned by review board');

      setDossierModalOpen(false);
      setDispatchedKey(res.key);
      setDispatchedApp(app);
      setDispatchModalOpen(true);

      await fetchData();
    } catch (err) {
      alert('Approval workflow error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectApplication = async (app: BetaApplication) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to reject the application for ${app.name} (${app.email})?`)) return;
    try {
      await apiReviewApplication(token, app.id, false);
      setDossierModalOpen(false);
      await fetchData();
    } catch (err) {
      alert('Reject update failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCreateManualInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !manualEmail) return;
    try {
      const key = await apiCreateInvite(token, manualEmail, manualRole);
      setManualKey(key);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Invite failed');
    }
  };

  const pendingApplications = applications.filter((a) => a.status === 'pending');

  const filteredAccounts = accounts.filter((a) => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch =
      search === '' ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
      (a.facility && a.facility.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getEmailTemplate = (app: BetaApplication | null, key: string | null) => {
    if (!app || !key) return '';
    const name = app.name || 'Doctor';
    const facility = app.facility || 'your medical facility';
    return `Subject: Your ClerQ CDS (Nia v1.47.2) Activation Key & Verified Install

Dear Dr. ${name},

Your application for the Nia Clinical Beta evaluation at ${facility} has been reviewed and approved by the ClerQ Medical Review Board.

Your unique, single-use activation key is:
${key}

To download the signed, watermarked APK build (Nia CDS v1.47.2) and access installation instructions, visit:
https://clerqintelligence.site/product/#verified?key=${key}

Please enter this key during first-run setup in the Nia app. This key is cryptographically tied to your clinician account and cannot be transferred.

Warm regards,
ClerQ Intelligence HQ Operations
Dar es Salaam, Tanzania
operations@clerqintelligence.site`;
  };

  const copyEmailDraft = () => {
    const draft = getEmailTemplate(dispatchedApp, dispatchedKey);
    navigator.clipboard.writeText(draft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Beta Studio: Practitioner Vetting & Access Control
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Vet practitioner medical registrations, issue cryptographic single-use activation keys, and dispatch personal emails
          </p>
        </div>

        {(user?.role === 'master' || user?.role === 'support') && (
          <button
            onClick={() => {
              setManualKey(null);
              setManualEmail('');
              setManualInviteModalOpen(true);
            }}
            className="btn-primary"
          >
            <UserPlus size={16} />
            <span>Issue Direct Activation Key</span>
          </button>
        )}
      </div>

      {/* Pending Credential Verification Queue */}
      <div
        className="card"
        style={{
          border: pendingApplications.length > 0 ? '1px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: pendingApplications.length > 0 ? 'var(--warning)' : 'var(--success)',
              }}
            />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Credential Verification Queue ({pendingApplications.length} Awaiting Vetting)
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Tanzania Medical Board & Hospital Registration Review
          </span>
        </div>

        {pendingApplications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {app.name}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: 'var(--warning-bg)',
                        color: 'var(--warning)',
                        border: '1px solid rgba(217, 119, 6, 0.3)',
                      }}
                    >
                      Awaiting Vetting
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '2px 6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {app.ref_code}
                    </span>
                    {app.cadre && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        • {app.cadre}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span>{app.email}</span>
                    {app.mct_number && (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                        MCT: {app.mct_number}
                      </span>
                    )}
                    {app.facility && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={13} /> {app.facility} {app.department ? `(${app.department})` : ''}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> Applied {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setDossierModalOpen(true);
                    }}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    <Eye size={14} />
                    <span>Review Dossier</span>
                  </button>
                  <button
                    onClick={() => handleApproveApplication(app)}
                    disabled={actionLoading}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <Check size={14} />
                    <span>Accept & Issue Key →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <ShieldCheck size={26} style={{ color: 'var(--success)', margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Vetting Queue Clear
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              All incoming clinician applicants have been vetted and issued keys.
            </p>
          </div>
        )}
      </div>

      {/* Clinician Directory Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, facility..."
              className="input-field"
              style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
            {['all', 'verified', 'pending', 'suspended'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  backgroundColor: filter === f ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                  color: filter === f ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  border: `1px solid ${filter === f ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px 10px 0', fontWeight: 500 }}>Practitioner Account</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Hospital / Facility</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Registered</th>
                <th style={{ padding: '10px 0 10px 14px', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px 12px 0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {a.name || 'Master Administrator'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {a.email}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      <div>{a.facility || 'Headquarters'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.cadre || ''}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {a.role}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={a.status} size="sm" />
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 0 12px 14px' }}>
                      <button
                        onClick={() => {
                          setSelectedAccount(a);
                          setAccountModalOpen(true);
                        }}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {loading ? 'Querying clinician database...' : 'No clinician accounts registered in database yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Applicant Vetting Inspector (cq_beta_applications) */}
      <Modal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        title="Practitioner Credential Dossier"
        description="Verify medical council registration and healthcare facility affiliation before authorizing activation."
      >
        {selectedApplication && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '8px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PRACTITIONER NAME</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplication.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>REFERENCE CODE</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplication.ref_code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>REGISTERED EMAIL</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedApplication.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MCT REGISTRATION NUMBER</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{selectedApplication.mct_number || 'Pending Verification'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AFFILIATED FACILITY</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedApplication.facility} {selectedApplication.department ? `(${selectedApplication.department})` : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MEDICAL CADRE</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedApplication.cadre}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SUBMITTED AT</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(selectedApplication.created_at).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>APPLICATION STATUS</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: selectedApplication.status === 'approved' ? 'var(--success-bg)' : selectedApplication.status === 'pending' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                  color: selectedApplication.status === 'approved' ? 'var(--success)' : selectedApplication.status === 'pending' ? 'var(--warning)' : 'var(--danger)',
                  textTransform: 'uppercase'
                }}>
                  {selectedApplication.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {selectedApplication.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleRejectApplication(selectedApplication)}
                    className="btn-danger"
                    style={{ flex: 1, padding: '11px', fontSize: '13px' }}
                  >
                    <X size={15} />
                    <span>Reject Application</span>
                  </button>
                  <button
                    onClick={() => handleApproveApplication(selectedApplication)}
                    disabled={actionLoading}
                    className="btn-primary"
                    style={{ flex: 2, padding: '11px', fontSize: '13px' }}
                  >
                    <Check size={15} />
                    <span>{actionLoading ? 'Issuing Key...' : 'Accept & Issue Key →'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDossierModalOpen(false)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '11px' }}
                >
                  Close Dossier
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 1B: Clinician Account Inspector (cq_accounts) */}
      <Modal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        title="Clinician Account Details"
        description="Active clinician account recorded in the ClerQ database."
      >
        {selectedAccount && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '8px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>NAME</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedAccount.name || 'Unnamed Account'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>EMAIL</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedAccount.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ROLE</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedAccount.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>FACILITY</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedAccount.facility || 'Headquarters'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CADRE</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedAccount.cadre || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>STATUS</span>
                <StatusBadge status={selectedAccount.status} size="sm" />
              </div>
            </div>
            <button
              onClick={() => setAccountModalOpen(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '11px' }}
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Modal 2: Personal Email Dispatch Package (Shown After Approval) */}
      <Modal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title="Personal Email Dispatch Package"
        description="The practitioner has been verified. Copy the pre-composed template below and send the activation email personally from your mail client."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
          {/* Key Callout Box */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              GENERATED SINGLE-USE ACTIVATION KEY (REGISTERED IN CQ_INVITES)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                {dispatchedKey}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>Active</span>
            </div>
          </div>

          {/* Email Template Preview Box */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                READY-TO-SEND PERSONAL EMAIL DRAFT
              </label>
              <button
                type="button"
                onClick={copyEmailDraft}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {copiedEmail ? <CheckCircle size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={11}
              className="input-field"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, resize: 'none' }}
              value={getEmailTemplate(dispatchedClinician, dispatchedKey)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              onClick={copyEmailDraft}
              className="btn-primary"
              style={{ flex: 1, padding: '12px', fontSize: '13px' }}
            >
              <Copy size={15} />
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Email & Send Personally'}</span>
            </button>
            <button
              onClick={() => setDispatchModalOpen(false)}
              className="btn-secondary"
              style={{ padding: '12px 18px', fontSize: '13px' }}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal 3: Manual Direct Key Generator */}
      <Modal
        isOpen={manualInviteModalOpen}
        onClose={() => setManualInviteModalOpen(false)}
        title="Issue Direct Activation Key"
        description="Generates an ad-hoc single-use activation key for a designated email address."
      >
        {manualKey ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SINGLE-USE KEY</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700 }}>{manualKey}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(manualKey);
                    setCopiedManualKey(true);
                    setTimeout(() => setCopiedManualKey(false), 2000);
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  {copiedManualKey ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <button onClick={() => setManualInviteModalOpen(false)} className="btn-primary" style={{ width: '100%' }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleCreateManualInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>RECIPIENT EMAIL</label>
              <input type="email" required className="input-field" placeholder="doctor@hospital.tz" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>ROLE</label>
              <select className="input-field" value={manualRole} onChange={(e) => setManualRole(e.target.value)}>
                <option value="clinician">Clinician</option>
                <option value="support">Support</option>
                <option value="analyst">Analyst</option>
                <option value="product_manager">Product Manager</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px' }}>Generate Key</button>
          </form>
        )}
      </Modal>
    </div>
  );
};
