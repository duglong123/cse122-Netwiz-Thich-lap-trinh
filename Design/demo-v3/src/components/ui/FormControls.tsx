import React from 'react';

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

type InputProps = BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = BaseFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>;

const baseControlStyle =
  'w-full rounded-lg bg-[var(--reading-bg)] border text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors disabled:opacity-50';

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</span>}
    <input
      className={`${baseControlStyle} h-10 px-3.5 ${error ? 'border-[var(--red)]' : 'border-[var(--line)] hover:border-[var(--line-strong)]'} ${className}`}
      {...rest}
    />
    {error ? <span className="block text-xs text-[var(--red-fg)]">{error}</span> : hint ? <span className="block text-xs text-[var(--muted)]">{hint}</span> : null}
  </label>
);

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</span>}
    <textarea
      className={`${baseControlStyle} p-3.5 leading-relaxed ${error ? 'border-[var(--red)]' : 'border-[var(--line)] hover:border-[var(--line-strong)]'} ${className}`}
      {...rest}
    />
    {error ? <span className="block text-xs text-[var(--red-fg)]">{error}</span> : hint ? <span className="block text-xs text-[var(--muted)]">{hint}</span> : null}
  </label>
);

export const Select: React.FC<SelectProps> = ({ label, error, hint, className = '', children, ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</span>}
    <select
      className={`${baseControlStyle} h-10 px-3 ${error ? 'border-[var(--red)]' : 'border-[var(--line)] hover:border-[var(--line-strong)]'} ${className}`}
      {...rest}
    >
      {children}
    </select>
    {error ? <span className="block text-xs text-[var(--red-fg)]">{error}</span> : hint ? <span className="block text-xs text-[var(--muted)]">{hint}</span> : null}
  </label>
);
