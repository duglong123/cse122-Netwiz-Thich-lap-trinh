import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-comic-primary',
  secondary:
    'text-[var(--text)] bg-[var(--panel-2)] border-2 border-[var(--line-strong)] hover:border-[var(--yellow-fg)] hover:text-[var(--yellow-fg)] hover:-translate-y-0.5',
  outline:
    'text-[var(--yellow-fg)] bg-transparent border border-[var(--yellow-border)] hover:bg-[var(--yellow-soft)]',
  ghost:
    'text-[var(--text-body)] bg-transparent border border-transparent hover:text-[var(--yellow-fg)] hover:bg-[var(--yellow-soft)]',
  danger:
    'text-[var(--red-on)] bg-[var(--red)] border-2 border-[var(--red)] shadow-[4px_4px_0_var(--red-shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5',
  success:
    'text-[var(--green-on)] bg-[var(--green)] border-2 border-[var(--green)] shadow-[4px_4px_0_var(--green-shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[38px] px-3.5 text-[11px] gap-1.5 rounded-lg',
  md: 'min-h-[44px] px-5 text-xs gap-2 rounded-lg',
  lg: 'min-h-[50px] px-6 text-[13px] gap-2.5 rounded-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  children,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-extrabold tracking-[0.045em] uppercase transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none disabled:transform-none disabled:shadow-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...rest}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
    <span>{children}</span>
    {!loading && rightIcon}
  </button>
);
