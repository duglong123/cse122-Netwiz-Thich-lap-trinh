import React from 'react';

export type BadgeTone = 'yellow' | 'blue' | 'green' | 'red' | 'muted';

const toneClasses: Record<BadgeTone, string> = {
  yellow: 'bg-[#f4d35e]/12 text-[#f4d35e] border-[#f4d35e]/35',
  blue: 'bg-[#4da3ff]/12 text-[#71b7ff] border-[#4da3ff]/35',
  green: 'bg-[#45d483]/12 text-[#65e09a] border-[#45d483]/35',
  red: 'bg-[#ef4444]/12 text-[#ff7b7b] border-[#ef4444]/40',
  muted: 'bg-[#121c2d] text-[#c5d1e2] border-[#26334a]',
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'muted',
  icon,
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-[0.08em] border whitespace-nowrap ${toneClasses[tone]} ${className}`}
  >
    {icon}
    {children}
  </span>
);
