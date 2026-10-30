import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let bg = 'rgba(255, 255, 255, 0.06)';
  let border = 'var(--border-default)';
  let text = 'var(--text-secondary)';

  if (norm === 'verified' || norm === 'active' || norm === 'success' || norm === 'followed') {
    bg = 'var(--success-bg)';
    border = 'rgba(34, 197, 94, 0.3)';
    text = 'var(--success)';
  } else if (norm === 'pending' || norm === 'warn' || norm === 'doubt') {
    bg = 'var(--warning-bg)';
    border = 'rgba(245, 158, 11, 0.3)';
    text = 'var(--warning)';
  } else if (norm === 'suspended' || norm === 'locked' || norm === 'critical' || norm === 'overruled') {
    bg = 'var(--danger-bg)';
    border = 'rgba(239, 68, 68, 0.3)';
    text = 'var(--danger)';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: text,
        }}
      />
      {status}
    </span>
  );
};
