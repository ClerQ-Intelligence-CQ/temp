import React from 'react';

interface ClerQLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const ClerQLogo: React.FC<ClerQLogoProps> = ({
  size = 32,
  className = '',
  showWordmark = false,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }} className={className}>
      {/* Monogram SVG with sinusoidal wave */}
      <svg
        width={size * 1.25}
        height={size}
        viewBox="0 0 50 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* C contour */}
        <path
          d="M20 10 C14 10 10 14 10 20 C10 26 14 30 20 30"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Q circle */}
        <circle
          cx="32"
          cy="20"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        {/* Connecting sinusoidal wave through Q tail */}
        <path
          d="M16 20 C22 20 25 15 29 25 S37 32 42 27"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            ClerQ
          </span>
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
