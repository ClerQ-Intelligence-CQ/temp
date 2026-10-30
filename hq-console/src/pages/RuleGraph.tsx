import React, { useState, useEffect } from 'react';
import {
  Network,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Layers,
  ChevronRight,
  Info,
  CheckCircle,
  FlaskConical,
  Scale,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { apiGetOverview, OverviewData } from '../lib/api';
import { REAL_CLINICAL_RULES, RealClinicalRule } from '../data/clinicalRules';
import { StatusBadge } from '../components/StatusBadge';

export const RuleGraph: React.FC = () => {
  const { token } = useAuth();
  const [selectedRule, setSelectedRule] = useState<RealClinicalRule>(REAL_CLINICAL_RULES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [liveOverview, setLiveOverview] = useState<OverviewData | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGetOverview(token)
      .then((data) => setLiveOverview(data))
      .catch(() => {});
  }, [token]);

  const categories = ['all', 'febrile', 'respiratory', 'cardiovascular', 'obstetrics', 'pediatrics', 'infectious'];

  const filteredRules = filterCategory === 'all'
    ? REAL_CLINICAL_RULES
    : REAL_CLINICAL_RULES.filter(r => r.category === filterCategory);

  // Cross-reference rule with live telemetry if available in Supabase
  const getRuleLiveStats = (ruleId: string) => {
    if (!liveOverview?.rules) return { triggers: 0, overruled: 0, doubt: 0 };
    const match = liveOverview.rules.find(r => r.rule_id.includes(ruleId));
    return match ? { triggers: match.n, overruled: match.overruled, doubt: match.doubt } : { triggers: 0, overruled: 0, doubt: 0 };
  };

  const selectedStats = getRuleLiveStats(selectedRule.id);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Network size={22} style={{ color: 'var(--text-primary)' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Clinical Decision Rule Graph
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Genuine Tanzania Standard Treatment Guidelines (STG) syndrome profiles, diagnostic anchors, and live telemetry cross-referencing
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <Activity size={14} style={{ color: 'var(--success)' }} />
            <span>21 Tanzania STG Syndromes Compiled</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: filterCategory === cat ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: filterCategory === cat ? 'var(--text-primary)' : 'transparent',
              color: filterCategory === cat ? 'var(--text-inverse)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'capitalize',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Graph Grid: Interactive Rule Topology & Live Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Rules Explorer Node Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              STG Diagnostic Profiles ({filteredRules.length})
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click node to inspect anchor weights & lab investigations
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {filteredRules.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              const stats = getRuleLiveStats(rule.id);
              const isEmergency = rule.acuity === 'EMERGENCY_RED';

              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className="card"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {rule.id}
                      </span>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {rule.nameEn}
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {rule.nameSw}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: isEmergency ? 'var(--danger-bg)' : 'var(--bg-surface-elevated)',
                        color: isEmergency ? 'var(--danger)' : 'var(--text-secondary)',
                        border: isEmergency ? '1px solid var(--danger-border)' : '1px solid var(--border-subtle)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {rule.acuity.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span>{rule.triggers.length} clinical anchors</span>
                    <span>Min score: {rule.minScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Rule Clinical Inspector Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {selectedRule.id} • STG PROTOCOL
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: selectedRule.acuity === 'EMERGENCY_RED' ? 'var(--danger-bg)' : 'var(--success-bg)',
                  color: selectedRule.acuity === 'EMERGENCY_RED' ? 'var(--danger)' : 'var(--success)',
                }}
              >
                {selectedRule.acuity}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
              {selectedRule.nameEn}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Swahili designation: <strong>{selectedRule.nameSw}</strong>
            </p>
          </div>

          {/* Diagnostic Weights & Anchor Signs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Scale size={15} style={{ color: 'var(--text-muted)' }} />
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Symptom & Vital Diagnostic Anchors
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {Object.entries(selectedRule.weights).map(([sign, weight]) => (
                <div
                  key={sign}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {sign}
                  </span>
                  <span style={{ fontWeight: 600, color: weight >= 3 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                    +{weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Investigations */}
          {selectedRule.investigations.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <FlaskConical size={15} style={{ color: 'var(--text-muted)' }} />
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Mandatory STG Workup & Investigations
                </h4>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedRule.investigations.map((inv) => (
                  <span
                    key={inv}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {inv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Live Mobile Telemetry Consensus */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Point-of-Care Telemetry Feed
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TRIGGERS</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStats.triggers}
                </span>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>OVERRULED</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: selectedStats.overruled > 0 ? 'var(--danger)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStats.overruled}
                </span>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>DOUBTS</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: selectedStats.doubt > 0 ? 'var(--warning)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStats.doubt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
