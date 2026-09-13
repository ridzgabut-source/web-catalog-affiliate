import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  as: Component = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-headline font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-container focus:ring-primary shadow-sm hover:shadow',
    secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high focus:ring-slate-300',
    outline: 'border border-slate-300 text-on-surface hover:bg-slate-100/60 focus:ring-slate-300',
    ghost: 'text-on-surface-variant hover:text-primary hover:bg-primary/5 focus:ring-primary',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
    shopee: 'bg-marketplace-shopee text-white hover:bg-marketplace-shopee-hover focus:ring-[#EE4D2D] shadow-sm hover:shadow',
    tokopedia: 'bg-marketplace-tokopedia text-white hover:bg-marketplace-tokopedia-hover focus:ring-[#03AC0E] shadow-sm hover:shadow',
  };

  return (
    <Component
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin material-symbols-outlined text-[18px]">
          progress_activity
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          )}
        </>
      )}
    </Component>
  );
}
