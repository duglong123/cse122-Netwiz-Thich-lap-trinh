import React from 'react';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  active?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({
  elevated = false,
  active = false,
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`rounded-2xl border transition-colors ${
      active
        ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30 bg-[var(--bg-surface)]'
        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
    } ${elevated ? 'shadow-[var(--shadow-card)]' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export const SurfaceHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`px-6 pt-5 pb-4 border-b border-[var(--border-subtle)] ${className}`} {...rest}>
    {children}
  </div>
);

export const SurfaceTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <h3 className={`text-base font-bold text-[var(--text-primary)] ${className}`} {...rest}>
    {children}
  </h3>
);

export const SurfaceContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export const SurfaceFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 ${className}`}
    {...rest}
  >
    {children}
  </div>
);
