import React from 'react';

type Variant = 'default' | 'elevated' | 'outlined' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  default: 'bg-bg-card border border-border',
  elevated: 'bg-bg-elev border border-border-light shadow-xl shadow-black/40',
  outlined: 'bg-transparent border border-border',
  interactive:
    'bg-bg-card border border-border active:scale-[0.98] hover:border-border-light hover:bg-bg-elev cursor-pointer transition-all duration-150',
};

const paddings: Record<CardProps['padding'] & string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  as: Tag = 'div',
  disabled = false,
  children,
  ...props
}) => {
  return (
    <Tag
      {...props}
      aria-disabled={disabled || undefined}
      className={`
        rounded-2xl ${variants[variant]} ${paddings[padding!]}
        ${disabled ? 'opacity-60 pointer-events-none cursor-not-allowed select-none' : ''}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default Card;
