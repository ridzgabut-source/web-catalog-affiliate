import React from 'react';

export default function StatCard({
  title,
  value,
  icon,
  description,
  accentColor = 'primary',
}) {
  const accentStyles = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-elevation-1 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface tnum">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${accentStyles[accentColor] || accentStyles.primary}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );
}
