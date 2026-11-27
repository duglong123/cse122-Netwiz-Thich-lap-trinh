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
  'w-full rounded-lg bg-[#080e19] border text-sm text-[#f3f6fc] placeholder:text-[#6f819b] transition-colors disabled:opacity-50';

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[#98a7bd]">{label}</span>}
    <input
      className={`${baseControlStyle} h-10 px-3.5 ${error ? 'border-[#ef4444]' : 'border-[#2b3951] hover:border-[#465571]'} ${className}`}
      {...rest}
    />
    {error ? <span className="block text-xs text-[#ff7b7b]">{error}</span> : hint ? <span className="block text-xs text-[#8495ae]">{hint}</span> : null}
  </label>
);

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, className = '', ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[#98a7bd]">{label}</span>}
    <textarea
      className={`${baseControlStyle} p-3.5 ${error ? 'border-[#ef4444]' : 'border-[#2b3951] hover:border-[#465571]'} ${className}`}
      {...rest}
    />
    {error ? <span className="block text-xs text-[#ff7b7b]">{error}</span> : hint ? <span className="block text-xs text-[#8495ae]">{hint}</span> : null}
  </label>
);

export const Select: React.FC<SelectProps> = ({ label, error, hint, className = '', children, ...rest }) => (
  <label className="block space-y-1.5">
    {label && <span className="block text-xs font-bold uppercase tracking-wider text-[#98a7bd]">{label}</span>}
    <select
      className={`${baseControlStyle} h-10 px-3 ${error ? 'border-[#ef4444]' : 'border-[#2b3951] hover:border-[#465571]'} ${className}`}
      {...rest}
    >
      {children}
    </select>
    {error ? <span className="block text-xs text-[#ff7b7b]">{error}</span> : hint ? <span className="block text-xs text-[#8495ae]">{hint}</span> : null}
  </label>
);
