import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';

    const sizeClasses = {
      sm: 'px-3.5 py-2 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
    };

    const variantClasses = {
      primary:
        'bg-[#176B65] hover:bg-[#105650] dark:bg-[#69C5B7] dark:hover:bg-[#8AD7CB] text-white dark:text-[#0D1715] font-semibold shadow-sm hover:shadow active:scale-[0.99]',
      secondary:
        'bg-white dark:bg-[#182A26] hover:bg-[#F7F4EC] dark:hover:bg-[#20352F] text-[#202D29] dark:text-[#F0F3EC] border border-[#DCD5C6] dark:border-[#30443D] hover:border-[#C5BCAF] dark:hover:border-[#445D54]',
      ghost:
        'text-[#596760] dark:text-[#B1C0B8] hover:text-[#202D29] dark:hover:text-white hover:bg-[#EFE9DB]/60 dark:hover:bg-[#20352F]/60',
      subtle:
        'bg-[#EFE9DB] dark:bg-[#182A26] hover:bg-[#E5DEC9] dark:hover:bg-[#20352F] text-[#202D29] dark:text-[#F0F3EC] border border-transparent',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
