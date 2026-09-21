import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-4 text-base gap-2 rounded-xl',
  lg: 'h-12 px-5 text-base gap-2 rounded-2xl',
  xl: 'h-14 px-6 text-lg font-semibold gap-2 rounded-2xl',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-bg hover:bg-primary-hover active:scale-[0.98] disabled:bg-primary-dim disabled:text-text-muted disabled:hover:bg-primary-dim shadow-lg shadow-primary/10',
  secondary:
    'bg-bg-elev text-text hover:bg-bg-hover active:scale-[0.98] border border-border disabled:opacity-50',
  ghost:
    'bg-transparent text-text-dim hover:text-text hover:bg-bg-hover active:scale-[0.98]',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/20 active:scale-[0.98] border border-danger/20',
  outline:
    'bg-transparent text-primary border border-primary/40 hover:bg-primary/10 active:scale-[0.98]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  loading,
  fullWidth,
  iconLeft,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center font-medium transition-all duration-150
        select-none disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
};

export default Button;
