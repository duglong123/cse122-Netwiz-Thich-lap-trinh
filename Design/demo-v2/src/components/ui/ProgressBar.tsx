import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

const barColors = {
  primary: 'bg-[var(--accent-primary)]',
  success: 'bg-[var(--accent-success)]',
  warning: 'bg-[var(--accent-warning)]',
  danger: 'bg-[var(--accent-danger)]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  tone = 'primary',
  size = 'md',
}) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[var(--text-secondary)] font-medium">{label}</span>
          {showPercent && <span className="font-mono font-semibold text-[var(--text-primary)]">{pct}%</span>}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] overflow-hidden ${
          size === 'sm' ? 'h-2' : 'h-2.5'
        }`}
      >
        <div className={`h-full rounded-full transition-all duration-300 ${barColors[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

interface HealthBarProps {
  label: string;
  current: number;
  max: number;
  variant: 'hero' | 'boss';
}

export const HealthBar: React.FC<HealthBarProps> = ({ label, current, max, variant }) => {
  const safeCurrent = Math.max(0, current);
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((safeCurrent / max) * 100))) : 0;
  const isCritical = pct <= 25;

  const fillClass =
    variant === 'hero'
      ? isCritical
        ? 'bg-[var(--accent-warning)]'
        : 'bg-[var(--accent-success)]'
      : 'bg-[var(--accent-danger)]';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wide">{label}</span>
        <span className="font-mono font-bold text-[var(--text-primary)]">
          {safeCurrent} / {max} HP
        </span>
      </div>
      <div className="relative h-3.5 w-full rounded-md bg-[var(--bg-muted)] border border-[var(--border-strong)] overflow-hidden">
        <div className={`h-full transition-all duration-300 ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
