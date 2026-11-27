import React from 'react';

export type BadgeTone = 'yellow' | 'blue' | 'green' | 'red' | 'muted';

const toneClasses: Record<BadgeTone, string> = {
  yellow: 'bg-[var(--yellow-soft)] text-[var(--yellow-fg)] border-[var(--yellow-border)]',
  blue: 'bg-[var(--blue-soft)] text-[var(--blue-fg)] border-[var(--blue-border)]',
  green: 'bg-[var(--green-soft)] text-[var(--green-fg)] border-[var(--green-border)]',
  red: 'bg-[var(--red-soft)] text-[var(--red-fg)] border-[var(--red-border)]',
  muted: 'bg-[var(--panel-2)] text-[var(--text-body)] border-[var(--line)]',
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
