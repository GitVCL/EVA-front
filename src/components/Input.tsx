import React from 'react';

type Variant = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: 'border-border focus-within:border-primary/60',
  error: 'border-danger focus-within:border-danger',
  success: 'border-success focus-within:border-success',
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconLeft,
  iconRight,
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).slice(2, 8);
  const variantClass = error ? variants.error : variants[variant];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-dim ml-0.5"
        >
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center h-12 px-3.5 rounded-2xl
          bg-bg-card border ${variantClass}
          transition-all duration-150 focus-within:bg-bg-elev
        `}
      >
        {iconLeft && <span className="mr-2.5 text-text-muted shrink-0">{iconLeft}</span>}
        <input
          id={inputId}
          {...props}
          className="w-full h-full bg-transparent outline-none text-base text-text placeholder:text-text-muted"
        />
        {iconRight && <span className="ml-2.5 text-text-muted shrink-0">{iconRight}</span>}
      </div>
      {error && <p className="text-xs text-danger ml-0.5">{typeof error === 'string' ? error : String(error)}</p>}
    </div>
  );
};

export default Input;
