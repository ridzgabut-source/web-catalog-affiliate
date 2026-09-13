import React, { useState, useEffect } from 'react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Cari produk pilihan...',
  className = '',
}) {
  const [query, setQuery] = useState(value);

  // Sync internal state if external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce notification to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== value) {
        onChange(query);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [query, value, onChange]);

  const handleClear = () => {
    setQuery('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <span className="material-symbols-outlined absolute left-3.5 text-slate-400 pointer-events-none text-xl">
        search
      </span>
      <input
        type="search"
        maxLength={100}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 bg-white text-on-surface text-sm rounded-xl border border-slate-300 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-elevation-1 transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          aria-label="Bersihkan pencarian"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  );
}
