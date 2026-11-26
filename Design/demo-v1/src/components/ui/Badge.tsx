import React from 'react';

export type BadgeTone = 'cobalt' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';

const toneMap: Record<BadgeTone, string> = {
  cobalt: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
  outline: 'bg-transparent text-slate-300 border-slate-600',
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'slate',
  icon,
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${toneMap[tone]} ${className}`}
  >
    {icon}
    {children}
  </span>
);
