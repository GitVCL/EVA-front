import React from 'react';

type Variant = 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'bg-primary/15 text-primary border-primary/25',
  success: 'bg-success/15 text-success border-success/25',
  danger: 'bg-danger/15 text-danger border-danger/25',
  warning: 'bg-warning/15 text-warning border-warning/25',
  neutral: 'bg-bg-elev text-text-dim border-border',
};

const sizes: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[10.5px]',
  md: 'px-2.5 py-1 text-xs',
};

export const statusBadgeVariant: Record<string, Variant> = {
  confirmed: 'success',
  cancelled: 'danger',
  attended: 'primary',
  missed: 'warning',
};

export const statusLabel: Record<string, string> = {
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  attended: 'Presente',
  missed: 'Faltou',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md', className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1 rounded-full
      font-semibold border ${variants[variant]} ${sizes[size]} ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;
