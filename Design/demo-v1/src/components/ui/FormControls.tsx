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
  'w-full rounded-lg bg-slate-900/90 border text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:opacity-50';

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-medium text-slate-300">{label}</span>}
    <input
      className={`${baseControlStyle} h-10 px-3.5 ${error ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'} ${className}`}
      {...rest}
    />
    {error ? (
      <span className="block text-xs text-rose-400">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-slate-500">{hint}</span>
    ) : null}
  </label>
);

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-medium text-slate-300">{label}</span>}
    <textarea
      className={`${baseControlStyle} p-3.5 ${error ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'} ${className}`}
      {...rest}
    />
    {error ? (
      <span className="block text-xs text-rose-400">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-slate-500">{hint}</span>
    ) : null}
  </label>
);

export const Select: React.FC<SelectProps> = ({ label, error, hint, className = '', children, ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-medium text-slate-300">{label}</span>}
    <select
      className={`${baseControlStyle} h-10 px-3 ${error ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'} ${className}`}
      {...rest}
    >
      {children}
    </select>
    {error ? (
      <span className="block text-xs text-rose-400">{error}</span>
    ) : hint ? (
      <span className="block text-xs text-slate-500">{hint}</span>
    ) : null}
  </label>
);
