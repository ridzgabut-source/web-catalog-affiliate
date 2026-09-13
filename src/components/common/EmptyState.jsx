import React from 'react';
import Button from './Button.jsx';

export default function EmptyState({
  icon = 'search_off',
  title = 'Tidak ada data ditemukan',
  description = 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan.',
  actionLabel = null,
  onAction = null,
  actionIcon = null,
}) {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 shadow-elevation-1">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-bold font-headline text-on-surface mb-1">
        {title}
      </h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          icon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
