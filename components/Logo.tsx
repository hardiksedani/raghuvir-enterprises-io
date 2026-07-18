'use client';

import { useId } from 'react';

interface LogoBadgeProps {
  size?: number;
  white?: boolean;
  className?: string;
}

export function LogoBadge({ size = 44, white = false, className }: LogoBadgeProps) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Badge background */}
      <rect width="44" height="44" rx="12" fill={white ? 'rgba(255,255,255,0.2)' : `url(#${uid})`} />
      <rect x="0.5" y="0.5" width="43" height="43" rx="11.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />

      {/* Decorative grain dots — top-right corner */}
      <circle cx="33.5" cy="9" r="2.5" fill="rgba(255,255,255,0.14)" />
      <circle cx="38" cy="6.5" r="1.5" fill="rgba(255,255,255,0.10)" />
      <circle cx="37.5" cy="13.5" r="1.2" fill="rgba(255,255,255,0.07)" />

      {/* R letterform (serif) */}
      <text
        x="21"
        y="30"
        fontFamily="'Georgia', 'Times New Roman', 'Palatino', serif"
        fontSize="22"
        fontWeight="900"
        fill="white"
        textAnchor="middle"
      >
        R
      </text>

      {/* Gold accent bar */}
      <rect
        x="9"
        y="38.5"
        width="26"
        height="2"
        rx="1"
        fill={white ? 'rgba(255,255,255,0.45)' : '#f59e0b'}
      />
    </svg>
  );
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  white?: boolean;
  className?: string;
}

export function Logo({ size = 'md', white = false, className }: LogoProps) {
  const cfg = {
    sm: { badge: 32, nameSize: '13px', subSize: '7.5px', gap: '9px' },
    md: { badge: 40, nameSize: '16px', subSize: '8.5px', gap: '10px' },
    lg: { badge: 50, nameSize: '21px', subSize: '10.5px', gap: '12px' },
  }[size];

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: cfg.gap }}
    >
      <LogoBadge size={cfg.badge} white={white} />
      <div>
        <div
          style={{
            fontSize: cfg.nameSize,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '0.06em',
            color: white ? 'white' : 'rgb(var(--text))',
          }}
        >
          RAGHUVIR
        </div>
        <div
          style={{
            fontSize: cfg.subSize,
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: white ? 'rgba(255,255,255,0.55)' : 'rgb(var(--primary))',
            marginTop: '2px',
          }}
        >
          ENTERPRISES
        </div>
      </div>
    </div>
  );
}
