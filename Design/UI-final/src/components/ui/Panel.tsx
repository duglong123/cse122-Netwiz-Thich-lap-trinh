import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
}

export const Panel: React.FC<PanelProps> = ({ accent, className = '', style, children, ...rest }) => (
  <div
    className={`rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-[var(--shadow-panel)] transition-colors ${className}`}
    style={accent ? { borderColor: `color-mix(in srgb, ${accent} 34%, var(--line))`, ...style } : style}
    {...rest}
  >
    {children}
  </div>
);

export const PanelHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`px-6 pt-5 pb-4 border-b border-[var(--line)] ${className}`} {...rest}>
    {children}
  </div>
);

export const PanelTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <h3 className={`text-lg font-extrabold text-[var(--text)] ${className}`} {...rest}>
    {children}
  </h3>
);

export const PanelContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({
  children,
  color,
  className = '',
}) => (
  <span className={`eyebrow ${className}`} style={color ? { color } : undefined}>
    {children}
  </span>
);
