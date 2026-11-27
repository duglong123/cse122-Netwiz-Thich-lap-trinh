import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'var(--yellow)',
  size = 'md',
}) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--muted)] mb-1.5">
          <span>{label}</span>
          <strong className="mono text-[var(--text)]">{pct}%</strong>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-[var(--track)] ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className="h-full rounded-full transition-all duration-400"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

export const BossHealthBar: React.FC<{ current: number; max: number; label?: string }> = ({
  current,
  max,
  label = 'Boss HP',
}) => {
  const safe = Math.max(0, current);
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((safe / max) * 100))) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#c7b3ba]">
        <span>{label}</span>
        <strong className="mono text-[#ff8585]">
          {safe} / {max}
        </strong>
      </div>
      <div
        className="boss-health"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={safe}
      >
        <div className="boss-health-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const HeroHealthBar: React.FC<{ current: number; max: number; label?: string }> = ({
  current,
  max,
  label = 'Hero HP',
}) => {
  const safe = Math.max(0, current);
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((safe / max) * 100))) : 0;
  const color = pct <= 25 ? 'var(--yellow)' : 'var(--green)';
  return <ProgressBar value={safe} max={max} label={`${label} (${safe}/${max})`} color={color} />;
};
