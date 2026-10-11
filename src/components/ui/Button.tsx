import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-display font-semibold transition-all duration-fast select-none relative min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2';

    const sizeStyles = {
      sm: 'text-xs px-4 py-2 rounded-pill gap-1.5',
      md: 'text-sm px-6 py-2.5 rounded-pill gap-2',
      lg: 'text-base px-8 py-3.5 rounded-pill gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-brand-primary hover:bg-brand-primary-hover text-text-primary shadow-raised active:translate-y-0 hover:-translate-y-0.5 border border-border-subtle hover:shadow-glow',
      gradient:
        'bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary-hover hover:to-brand-primary-hover text-text-primary shadow-glow active:translate-y-0 hover:-translate-y-0.5 border border-border-prominent',
      secondary:
        'bg-bg-raised hover:bg-bg-surface text-text-primary border border-border-subtle hover:border-brand-secondary active:translate-y-0 hover:-translate-y-0.5',
      ghost:
        'bg-transparent hover:bg-bg-raised/70 text-text-primary active:bg-bg-raised',
      link:
        'bg-transparent text-brand-secondary hover:underline p-0 min-h-0 min-w-0 justify-start',
    }[variant];

    const disabledStyles = disabled || isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : '';

    const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`.trim();

    const content = (
      <>
        {isLoading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-primary border-t-transparent" />
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={combinedClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-disabled={disabled || isLoading}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
