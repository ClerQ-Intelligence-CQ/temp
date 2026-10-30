import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Save,
  RefreshCw,
  Cpu,
  Mic,
  AlertOctagon,
  Clock,
  Layers,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { apiListConfig, apiSetConfig, ReleaseConfig } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

export const Releases: React.FC = () => {
  const { token, user } = useAuth();
  const [configs, setConfigs] = useState<ReleaseConfig[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('*');
  const [activeConfig, setActiveConfig] = useState<Partial<ReleaseConfig>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await apiListConfig(token);
      setConfigs(rows);
      const current = rows.find((c) => c.version === selectedVersion) || rows[0];
      if (current) {
        setSelectedVersion(current.version);
        setActiveConfig(current);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load release configuration';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [token]);

  const handleVersionChange = (ver: string) => {
    setSelectedVersion(ver);
    const found = configs.find((c) => c.version === ver);
    if (found) {
      setActiveConfig(found);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (user?.role !== 'master') {
      alert('Only Master role operators can alter release configurations & kill switches.');
      return;
    }
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await apiSetConfig(token, selectedVersion, activeConfig);
      setSaveSuccess(true);
      await fetchConfigs();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const isMaster = user?.role === 'master';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Remote Release Control & Kill Switch
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Configure live Gemma & Whisper model endpoints, enforce version policies, or trigger emergency app lockouts
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={fetchConfigs} disabled={loading} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Reload Config</span>
          </button>
        </div>
      </div>

      {/* Critical Kill-Switch Warning Banner if Locked */}
      {activeConfig.locked && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: 'var(--danger)',
          }}
        >
          <AlertOctagon size={24} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>
              EMERGENCY LOCK ACTIVE FOR VERSION {selectedVersion}
            </span>
            <p style={{ fontSize: '12px', marginTop: '2px', opacity: 0.9 }}>
              All client app instances checking in with this version are halted with message: "{activeConfig.lock_message || 'Access revoked'}".
              {activeConfig.wipe_on_lock && ' Remote local database wipe flag is ENABLED.'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>Release configuration published live to Supabase. Client devices will receive updates on next sync.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Version Selector Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Target App Release
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Select '*' for all clients, or specify an exact version code
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              className="input-field"
              style={{ width: '180px', height: '36px', fontSize: '13px' }}
              value={selectedVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
            >
              {configs.map((c) => (
                <option key={c.version} value={c.version}>
                  Version: {c.version} {c.version === '*' ? '(Default Global)' : ''}
                </option>
              ))}
            </select>
            <StatusBadge status={activeConfig.locked ? 'Locked' : 'Active'} size="sm" />
          </div>
        </div>

        {/* 2-Columns: AI & Speech Models / Enforcement & Kill Switch */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Models Configuration */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <Cpu size={16} style={{ color: 'var(--text-muted)' }} />
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Offline Models Distribution
              </h2>
            </div>

            {/* Gemma 3 270M */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                LUCY AGENT MODEL (GEMMA 3 270M GGUF)
              </label>
              <input
                type="text"
                disabled={!isMaster}
                className="input-field"
                placeholder="Model file name"
                value={activeConfig.lucy_model_name || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, lucy_model_name: e.target.value })}
              />
              <input
                type="text"
                disabled={!isMaster}
                className="input-field font-mono"
                style={{ fontSize: '12px' }}
                placeholder="https://huggingface.co/.../gemma-3-270m-it-Q4_K_M.gguf"
                value={activeConfig.lucy_model_url || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, lucy_model_url: e.target.value })}
              />
              <input
                type="text"
                disabled={!isMaster}
                className="input-field font-mono"
                style={{ fontSize: '11px' }}
                placeholder="SHA-256 integrity hash"
                value={activeConfig.lucy_model_sha256 || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, lucy_model_sha256: e.target.value })}
              />
            </div>

            {/* Whisper Speech */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mic size={14} />
                <span>SPEECH-TO-TEXT MODEL (WHISPER BASE GGML)</span>
              </label>
              <input
                type="text"
                disabled={!isMaster}
                className="input-field"
                placeholder="Model file name"
                value={activeConfig.voice_model_name || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, voice_model_name: e.target.value })}
              />
              <input
                type="text"
                disabled={!isMaster}
                className="input-field font-mono"
                style={{ fontSize: '12px' }}
                placeholder="https://huggingface.co/.../ggml-base-q5_1.bin"
                value={activeConfig.voice_model_url || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, voice_model_url: e.target.value })}
              />
            </div>
          </div>

          {/* Security Gating & Kill Switch */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--text-muted)' }} />
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Policy & Tamper Defenses
              </h2>
            </div>

            {/* Min App Version */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                MINIMUM REQUIRED APP VERSION
              </label>
              <input
                type="text"
                disabled={!isMaster}
                className="input-field font-mono"
                placeholder="1.0.0"
                value={activeConfig.min_app_version || ''}
                onChange={(e) => setActiveConfig({ ...activeConfig, min_app_version: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Older installations will be required to update.
              </span>
            </div>

            {/* Offline Grace Period */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                OFFLINE GRACE PERIOD (DAYS)
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  disabled={!isMaster}
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={activeConfig.offline_grace_days || 30}
                  onChange={(e) => setActiveConfig({ ...activeConfig, offline_grace_days: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>

            {/* Lock Version Switch */}
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Immediate Version Lock
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Revokes clinical access for this version immediately.
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled={!isMaster}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--danger)', cursor: 'pointer' }}
                  checked={Boolean(activeConfig.locked)}
                  onChange={(e) => setActiveConfig({ ...activeConfig, locked: e.target.checked })}
                />
              </div>

              {activeConfig.locked && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    LOCKOUT BANNER MESSAGE
                  </label>
                  <input
                    type="text"
                    disabled={!isMaster}
                    className="input-field"
                    placeholder="This build has expired. Contact HQ."
                    value={activeConfig.lock_message || ''}
                    onChange={(e) => setActiveConfig({ ...activeConfig, lock_message: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Remote Wipe Kill Switch */}
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--danger)' }}>
                  Wipe Local Data On Lock
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Erases offline storage & credentials on locked device check-in.
                </p>
              </div>
              <input
                type="checkbox"
                disabled={!isMaster}
                style={{ width: '18px', height: '18px', accentColor: 'var(--danger)', cursor: 'pointer' }}
                checked={Boolean(activeConfig.wipe_on_lock)}
                onChange={(e) => setActiveConfig({ ...activeConfig, wipe_on_lock: e.target.checked })}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        {isMaster && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: '11px 24px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Publishing Changes...' : 'Save & Deploy Configuration'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
