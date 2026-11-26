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
  'w-full rounded-lg bg-[var(--bg-surface)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50';

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-semibold text-[var(--text-secondary)]">{label}</span>}
    <input
      className={`${baseControlStyle} h-10 px-3.5 ${
        error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-strong)]'
      } ${className}`}
      {...rest}
    />
    {error ? (
      <span className="block text-xs text-[var(--accent-danger)]">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-[var(--text-muted)]">{hint}</span>
    ) : null}
  </label>
);

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-semibold text-[var(--text-secondary)]">{label}</span>}
    <textarea
      className={`${baseControlStyle} p-3.5 ${
        error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-strong)]'
      } ${className}`}
      {...rest}
    />
    {error ? (
      <span className="block text-xs text-[var(--accent-danger)]">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-[var(--text-muted)]">{hint}</span>
    ) : null}
  </label>
);

export const Select: React.FC<SelectProps> = ({ label, error, hint, className = '', children, ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-semibold text-[var(--text-secondary)]">{label}</span>}
    <select
      className={`${baseControlStyle} h-10 px-3 ${
        error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-strong)]'
      } ${className}`}
      {...rest}
    >
      {children}
    </select>
    {error ? (
      <span className="block text-xs text-[var(--accent-danger)]">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-[var(--text-muted)]">{hint}</span>
    ) : null}
  </label>
);
