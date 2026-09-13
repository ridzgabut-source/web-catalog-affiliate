import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 6);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold font-headline text-on-surface flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 text-slate-400 pointer-events-none text-[18px]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full h-11 ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5 bg-white text-on-surface text-sm rounded-xl border transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-primary'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  error,
  helperText,
  required = false,
  rows = 4,
  className = '',
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 6);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold font-headline text-on-surface flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full p-3.5 bg-white text-on-surface text-sm rounded-xl border transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-slate-300 hover:border-slate-400 focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}

export function Select({
  label,
  id,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 6);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold font-headline text-on-surface flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={inputId}
          className={`w-full h-11 pl-3.5 pr-10 bg-white text-on-surface text-sm rounded-xl border appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-primary'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 pointer-events-none text-slate-400 text-lg">
          expand_more
        </span>
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false,
}) {
  const switchId = id || Math.random().toString(36).substr(2, 6);

  return (
    <label htmlFor={switchId} className="flex items-center justify-between cursor-pointer select-none py-1">
      {(label || description) && (
        <div className="flex flex-col text-left pr-4">
          {label && <span className="text-sm font-semibold font-headline text-on-surface">{label}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
      <div className="relative inline-flex items-center shrink-0">
        <input
          id={switchId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-primary' : 'bg-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div
          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out shadow-sm ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
}
