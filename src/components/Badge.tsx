import React from 'react';

type Variant = 'primary' | 'success' | 'danger' | 'warning' | 'neutral';

const variants: Record<Variant, string> = {
  primary: 'bg-primary/15 text-primary border-primary/25',
  success: 'bg-success/15 text-success border-success/25',
  danger: 'bg-danger/15 text-danger border-danger/25',
  warning: 'bg-warning/15 text-warning border-warning/25',
  neutral: 'bg-bg-elev text-text-dim border-border',
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
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full
      text-xs font-semibold border ${variants[variant]} ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;
