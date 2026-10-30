import React from 'react';

interface NiaLogoProps {
  size?: number;
  color?: string;
  dotColor?: string;
  className?: string;
}

const NIA_PATH =
  'M8 52 V26 M8 36 C8 26 30 22 30 38 V52 ' +
  'M44 52 V30 ' +
  'M82 41 C82 29 62 29 62 41 C62 53 82 53 82 41 M82 33 V52';

export const NiaLogo: React.FC<NiaLogoProps> = ({
  size = 32,
  color = 'currentColor',
  dotColor = 'currentColor',
  className = '',
}) => {
  return (
    <svg
      width={size * 1.4}
      height={size}
      viewBox="0 0 90 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d={NIA_PATH}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="14" r="4.5" fill={dotColor} />
    </svg>
  );
};
