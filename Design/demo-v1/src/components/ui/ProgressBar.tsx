import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  tone?: 'cobalt' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md';
}

const barColors = {
  cobalt: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  tone = 'cobalt',
  size = 'md',
}) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 font-medium">{label}</span>
          {showPercent && <span className="font-mono text-slate-400">{pct}%</span>}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-slate-800/90 border border-slate-700/70 overflow-hidden ${
          size === 'sm' ? 'h-2' : 'h-2.5'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColors[tone]}`}
          style={{ width: `${pct}%` }}
        />
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
        ? 'bg-amber-500'
        : 'bg-emerald-500'
      : 'bg-rose-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-200 tracking-wide uppercase">{label}</span>
        <span className={`font-mono font-semibold ${isCritical && variant === 'hero' ? 'text-amber-400' : 'text-slate-200'}`}>
          {safeCurrent} / {max} HP
        </span>
      </div>
      <div className="relative h-3.5 w-full rounded-md bg-slate-900 border border-slate-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
          <div className="border-r border-slate-950/35" />
          <div className="border-r border-slate-950/35" />
          <div className="border-r border-slate-950/35" />
          <div />
        </div>
      </div>
    </div>
  );
};
