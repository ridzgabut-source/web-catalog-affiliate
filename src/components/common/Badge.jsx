import React from 'react';

export default function Badge({
  children,
  variant = 'category',
  status = null,
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  if (variant === 'status') {
    const isActive = status === 'ACTIVE';
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
          }`}
        />
        <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
      </span>
    );
  }

  if (variant === 'discount') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold ${sizeStyles[size]} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'featured') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeStyles[size]} ${className}`}
      >
        <span className="material-symbols-outlined text-xs">star</span>
        <span>Unggulan</span>
      </span>
    );
  }

  // Default: Category badge
  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary/10 text-primary font-headline font-semibold ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
