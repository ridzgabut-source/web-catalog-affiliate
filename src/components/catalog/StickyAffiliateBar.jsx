import React from 'react';
import Button from '../common/Button.jsx';
import { formatRupiah } from './ProductCard.jsx';

export default function StickyAffiliateBar({ product }) {
  if (!product) return null;

  const marketplaceLabel = product.marketplace_type === 'shopee'
    ? 'Beli di Shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'Beli di Tokopedia'
    : 'Beli di Marketplace';

  const marketplaceVariant = product.marketplace_type === 'shopee'
    ? 'shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'tokopedia'
    : 'primary';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-elevation-3 px-4 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Harga Terbaik
        </span>
        <span className="font-headline font-bold text-lg text-primary tnum leading-tight">
          {formatRupiah(product.price)}
        </span>
      </div>

      <Button
        as="a"
        href={product.affiliate_url}
        target="_blank"
        rel="noopener noreferrer"
        variant={marketplaceVariant}
        size="md"
        className="flex-1 max-w-[200px]"
        icon="open_in_new"
        iconPosition="right"
      >
        {marketplaceLabel}
      </Button>
    </div>
  );
}
