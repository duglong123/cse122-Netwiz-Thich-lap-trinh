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
    'text-[#f3f6fc] bg-white/[0.03] border-2 border-[#3b4962] hover:border-[#f4d35e] hover:text-[#f4d35e] hover:-translate-y-0.5',
  outline:
    'text-[#f4d35e] bg-transparent border border-[#f4d35e]/45 hover:bg-[#f4d35e]/10',
  ghost:
    'text-[#c8d2e2] bg-transparent border border-transparent hover:text-[#f4d35e] hover:bg-[#f4d35e]/[0.07]',
  danger:
    'text-white bg-[#ef4444] border-2 border-[#ef4444] shadow-[4px_4px_0_#691818] hover:-translate-x-0.5 hover:-translate-y-0.5',
  success:
    'text-[#08120c] bg-[#45d483] border-2 border-[#45d483] shadow-[4px_4px_0_#195e37] hover:-translate-x-0.5 hover:-translate-y-0.5',
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
