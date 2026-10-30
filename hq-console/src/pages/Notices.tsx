import React, { useEffect, useState } from 'react';
import {
  Bell,
  Send,
  Trash2,
  AlertTriangle,
  Info,
  AlertOctagon,
  Languages,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  apiListAllNotices,
  apiPostNotice,
  apiDeleteNotice,
  Notice,
} from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

export const Notices: React.FC = () => {
  const { token, user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleSw, setTitleSw] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodySw, setBodySw] = useState('');
  const [level, setLevel] = useState<'info' | 'warn' | 'critical'>('info');
  const [audience, setAudience] = useState('all');
  const [expiryDays, setExpiryDays] = useState(7);

  const fetchNotices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const rows = await apiListAllNotices(token);
      setNotices(rows);
    } catch (err: unknown) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !titleEn) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + expiryDays);

      await apiPostNotice(token, {
        title_en: titleEn,
        title_sw: titleSw || undefined,
        body_en: bodyEn || undefined,
        body_sw: bodySw || undefined,
        level,
        audience,
        ends_at: endsAt.toISOString(),
      });

      setSuccess('Broadcast notice dispatched successfully.');
      setTitleEn('');
      setTitleSw('');
      setBodyEn('');
      setBodySw('');
      await fetchNotices();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Broadcast failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to revoke this notice?')) return;
    try {
      await apiDeleteNotice(token, id);
      await fetchNotices();
    } catch {
      alert('Failed to revoke notice.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Clinical Broadcast Notices
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Dispatch bilingual advisory banners, drug recalls, or guidelines updates directly to clinicians' devices
        </p>
      </div>

      {success && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Creator Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Bell size={16} style={{ color: 'var(--text-muted)' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Compose Notice
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  URGENCY LEVEL
                </label>
                <select
                  className="input-field"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                >
                  <option value="info">Info (Standard Clinical Note)</option>
                  <option value="warn">Warning (Stock / Guideline Change)</option>
                  <option value="critical">Critical (Immediate Patient Safety / Recall)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  AUDIENCE
                </label>
                <select
                  className="input-field"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  <option value="all">All App Users</option>
                  <option value="clinician">Clinicians Only</option>
                  <option value="support">Support Agents</option>
                </select>
              </div>
            </div>

            {/* English Title & Body */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                TITLE (ENGLISH) *
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Updated Pediatric Malaria Dosing Protocol"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                MESSAGE BODY (ENGLISH)
              </label>
              <textarea
                rows={3}
                className="input-field"
                placeholder="Details of the advisory or dosage adjustment..."
                value={bodyEn}
                onChange={(e) => setBodyEn(e.target.value)}
              />
            </div>

            {/* Swahili Translation */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Languages size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  KISWAHILI TRANSLATION (RECOMMENDED)
                </span>
              </div>

              <div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Kichwa (Kiswahili) - mf. Marekebisho ya Dawa ya Malaria"
                  value={titleSw}
                  onChange={(e) => setTitleSw(e.target.value)}
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  className="input-field"
                  placeholder="Ufafanuzi kwa Kiswahili..."
                  value={bodySw}
                  onChange={(e) => setBodySw(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires in:</span>
                <select
                  className="input-field"
                  style={{ width: '100px', padding: '4px 8px', height: '30px' }}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                >
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: '9px 20px' }}
              >
                <Send size={14} />
                <span>{submitting ? 'Dispatching...' : 'Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Notices List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Active Announcements ({notices.length})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>In-app stream</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
            {notices.length > 0 ? (
              notices.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {n.title_en}
                        </span>
                        <StatusBadge status={n.level} size="sm" />
                      </div>
                      {n.title_sw && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                          {n.title_sw}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(n.id)}
                      style={{
                        padding: '6px',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      title="Revoke notice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {n.body_en && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {n.body_en}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Audience: <strong>{n.audience}</strong></span>
                    <span>Created: {new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                {loading ? 'Checking broadcast queue...' : 'No active broadcast notices currently.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
