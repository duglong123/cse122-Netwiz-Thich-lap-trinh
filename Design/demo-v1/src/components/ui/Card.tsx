import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  active?: boolean;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  active = false,
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`rounded-xl bg-[#111827]/95 border transition-colors ${
      active
        ? 'border-blue-500/70 ring-1 ring-blue-500/30'
        : 'border-slate-800'
    } ${hoverable ? 'hover:border-slate-600 hover:bg-[#162032]' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`px-5 pt-5 pb-3 border-b border-slate-800/80 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <h3 className={`text-base font-semibold text-slate-100 ${className}`} {...rest}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`} {...rest}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`p-5 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`px-5 py-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3 ${className}`} {...rest}>
    {children}
  </div>
);
