import React from 'react';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const toneMap: Record<BadgeTone, string> = {
  primary: 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] border-[var(--accent-primary)]/35',
  success: 'bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] border-[var(--accent-success)]/35',
  warning: 'bg-[var(--accent-warning-soft)] text-[var(--accent-warning-fg)] border-[var(--accent-warning)]/35',
  danger: 'bg-[var(--accent-danger-soft)] text-[var(--accent-danger-fg)] border-[var(--accent-danger)]/35',
  neutral: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  icon,
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${toneMap[tone]} ${className}`}
  >
    {icon}
    {children}
  </span>
);
