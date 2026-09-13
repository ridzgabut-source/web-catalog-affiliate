import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-elevation-3 border border-slate-100 overflow-hidden z-10 transition-all transform animate-in fade-in zoom-in-95 my-8`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            {title && (
              <h3 className="text-lg font-bold font-headline text-on-surface tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors -mr-2 -mt-2"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
