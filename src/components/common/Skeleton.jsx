import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-card overflow-hidden border border-slate-200 shadow-elevation-1 animate-pulse">
      {/* 1:1 Image Placeholder */}
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-5 bg-slate-200 rounded w-4/5 mb-1.5" />
          <div className="h-3.5 bg-slate-100 rounded w-full mb-1" />
          <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        </div>
        <div className="pt-2">
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 bg-slate-200 rounded-full" />
            <div className="h-9 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductTableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-panel border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-24 hidden sm:block" />
          <div className="h-6 bg-slate-200 rounded-full w-16" />
          <div className="h-8 bg-slate-200 rounded-lg w-20" />
        </div>
      ))}
    </div>
  );
}
