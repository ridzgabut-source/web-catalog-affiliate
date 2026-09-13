import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-panel shadow-elevation-2 border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl">storefront</span>
        </div>
        <h1 className="text-2xl font-bold font-headline text-on-surface mb-2">
          KoleksiKita
        </h1>
        <p className="text-on-surface-variant text-sm mb-4">
          Frontend Website Catalog Affiliate dengan Design System Google Stitch.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
          <span>Design Tokens Ready</span>
        </div>
      </div>
    </div>
  );
}
