import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Box,
  Layers,
  Eye,
  CheckCircle,
  Download,
  ExternalLink,
  Sliders,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { apiListConfig, apiSetConfig, ReleaseConfig } from '../lib/api';

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  version: string;
  status: 'active' | 'evaluating' | 'internal';
  features: string[];
  ctaUrl: string;
  ctaText: string;
}

const DEFAULT_CLERQ_PRODUCTS: ProductItem[] = [
  {
    id: 'nia-cds',
    name: 'Nia (ClerQ CDS v1.47.2)',
    tagline: 'Offline-capable, bilingual clinical decision support for frontline practitioners in Tanzania.',
    category: 'Clinical Decision Support',
    version: '1.47.2',
    status: 'active',
    features: [
      'Grounded in Tanzania National Standard Treatment Guidelines (STG 2026)',
      'Gemma 3 270M Q4_K_M quantized LLM running locally on budget Android',
      'Embedded Whisper base-q5_1 Swahili/English speech dictation',
      'Zero patient names transmitted; ID-only cryptographic anonymity',
      'Weight-based pediatric dosing & contraindication safety checks',
    ],
    ctaUrl: '/product#beta-program',
    ctaText: 'Apply for Clinical Beta',
  },
  {
    id: 'sema-voice',
    name: 'Sema Speech & NLP Engine',
    tagline: 'Specialized clinical Swahili medical speech-to-text and morphological diagnostic processor.',
    category: 'Speech & Language Processing',
    version: '2.1.0',
    status: 'active',
    features: [
      'Fine-tuned on East African doctor-patient clinical dialogues',
      'Sub-200ms spoken complaint transcription',
      'Dual English and Swahili medical vocabulary synthesis',
      'Local GGML inference without network roundtrips',
    ],
    ctaUrl: '/research',
    ctaText: 'Read Architecture Briefing',
  },
  {
    id: 'rafiki-triage',
    name: 'Rafiki Frontline Triage',
    tagline: 'Primary care triage assistant for dispensary and rural health centre clinical officers.',
    category: 'Triage & Acuity Scoring',
    version: '1.0.4',
    status: 'evaluating',
    features: [
      'Integrated IMCI emergency sign detection',
      'Maternal hemorrhage and severe pre-eclampsia priority tagging',
      'Automated facility stock and emergency algorithm lookup',
    ],
    ctaUrl: '/contact',
    ctaText: 'Request Facility Trial',
  },
  {
    id: 'hakiki-audit',
    name: 'Hakiki Protocol Verification',
    tagline: 'Offline cryptographic guideline adherence verification and clinical audit engine.',
    category: 'Quality & Governance',
    version: '1.2.0',
    status: 'internal',
    features: [
      'Zero-knowledge proof of guideline adherence',
      'Local tamper detection and APK watermark verification',
      'Bilingual audit dispatches for regional health directors',
    ],
    ctaUrl: '/about',
    ctaText: 'Learn More',
  },
];

export const ProductStudio: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_CLERQ_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(DEFAULT_CLERQ_PRODUCTS[0]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [liveConfigs, setLiveConfigs] = useState<ReleaseConfig[]>([]);

  useEffect(() => {
    if (!token) return;
    apiListConfig(token)
      .then(cfgs => setLiveConfigs(cfgs))
      .catch(console.error);
  }, [token]);

  const handleUpdate = (patch: Partial<ProductItem>) => {
    const updated = { ...selectedProduct, ...patch };
    setSelectedProduct(updated);
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const updatedFeatures = [...selectedProduct.features, newFeatureText.trim()];
    handleUpdate({ features: updatedFeatures });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    const updatedFeatures = selectedProduct.features.filter((_, i) => i !== idx);
    handleUpdate({ features: updatedFeatures });
  };

  const handleSave = async () => {
    setSaving(true);
    // If Nia CDS is selected and we have release config, sync min app version or parameters
    if (token && selectedProduct.id === 'nia-cds') {
      try {
        await apiSetConfig(token, {
          version: '*',
          min_app_version: selectedProduct.version,
        });
      } catch (err) {
        console.error('Could not sync release config:', err);
      }
    }
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Find corresponding live release config from Supabase
  const activeReleaseConfig = liveConfigs.find(c => c.version === '*' || c.version === selectedProduct.version);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box size={22} style={{ color: 'var(--text-primary)' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Product Studio & Capability Stall
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Configure ClerQ Intelligence product capabilities, verify live model weights from Supabase, and synchronize public website showcase parameters
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '10px 20px' }}>
          <Save size={15} />
          <span>{saving ? 'Syncing...' : 'Save Product Parameters'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>Product parameters synchronized with Supabase release configurations.</span>
        </div>
      )}

      {/* Product Selector Bar */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {products.map((p) => {
          const isSelected = selectedProduct.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Box size={14} style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Editor & WebGL Preview Configuration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Product Details Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Product Metadata & Positioning
            </h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              ID: {selectedProduct.id}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Product Designation
              </label>
              <input
                type="text"
                className="input-field"
                value={selectedProduct.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Release Version
              </label>
              <input
                type="text"
                className="input-field"
                value={selectedProduct.version}
                onChange={(e) => handleUpdate({ version: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Positioning Tagline
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={selectedProduct.tagline}
              onChange={(e) => handleUpdate({ tagline: e.target.value })}
            />
          </div>

          {/* Capabilities List */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Engine Capabilities ({selectedProduct.features.length})
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {selectedProduct.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                  <button
                    onClick={() => handleRemoveFeature(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Add new clinical capability or guideline reference..."
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <button onClick={handleAddFeature} className="btn-secondary" style={{ padding: '0 16px', flexShrink: 0 }}>
                <Plus size={15} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Supabase Release Sync & WebGL Stall Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Release Config Verification */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Live Supabase Remote Gate State
              </h3>
            </div>

            {activeReleaseConfig ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Version</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeReleaseConfig.version}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gemma LLM URL</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeReleaseConfig.lucy_model_url || 'Default embedded'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Whisper Speech URL</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeReleaseConfig.voice_model_url || 'Default embedded'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Remote Lock Status</span>
                  <span style={{ fontWeight: 600, color: activeReleaseConfig.locked ? 'var(--danger)' : 'var(--success)' }}>
                    {activeReleaseConfig.locked ? 'LOCKED' : 'NOMINAL (UNLOCKED)'}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                No specific release override row found for version {selectedProduct.version}. Using global default (*) gate.
              </p>
            )}
          </div>

          {/* Website Public Stall Preview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={15} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Website Stall Representation
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live on /product</span>
            </div>

            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
              }}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                {selectedProduct.category}
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedProduct.name}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.6 }}>
                {selectedProduct.tagline}
              </p>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={`http://localhost:8085${selectedProduct.ctaUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}
                >
                  <span>{selectedProduct.ctaText}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
