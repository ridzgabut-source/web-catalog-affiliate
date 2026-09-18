import React from 'react';
import Button from '../common/Button.jsx';
import { formatRupiah } from './ProductCard.jsx';

export default function StickyAffiliateBar({ product }) {
  if (!product) return null;

  const getVariant = (text) => {
    const t = text ? text.toLowerCase() : '';
    if (t.includes('shopee')) return 'shopee';
    if (t.includes('tokopedia')) return 'tokopedia';
    return 'primary';
  };

  const btn1Variant = getVariant(product.button1_text);
  const btn2Variant = getVariant(product.button2_text);

  const btn3Variant = getVariant(product.button3_text);

  const availableButtons = [];
  if (product.button1_url) availableButtons.push({ url: product.button1_url, text: product.button1_text, price: product.button1_price, variant: btn1Variant });
  if (product.button2_url) availableButtons.push({ url: product.button2_url, text: product.button2_text, price: product.button2_price, variant: btn2Variant });
  if (product.button3_url) availableButtons.push({ url: product.button3_url, text: product.button3_text, price: product.button3_price, variant: btn3Variant });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-elevation-3 px-4 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex flex-col text-left shrink-0">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Harga Terbaik
        </span>
        <span className="font-headline font-bold text-lg text-primary tnum leading-tight">
          {formatRupiah(product.price)}
        </span>
      </div>

      <div className="flex flex-1 gap-1.5 justify-end overflow-hidden">
        {availableButtons.map((btn, index) => (
          <div key={index} className={`flex flex-col justify-end gap-0.5 min-w-0 ${availableButtons.length === 1 ? 'w-full' : availableButtons.length === 2 ? 'w-1/2' : 'w-1/3'}`}>
            {btn.price ? (
              <span className="text-[9px] font-bold text-slate-500 text-center truncate">{formatRupiah(btn.price)}</span>
            ) : <div className="h-[13.5px]" />}
            <Button
              as="a"
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              variant={btn.variant}
              size="md"
              className="w-full justify-center px-1"
              icon={availableButtons.length === 1 ? "open_in_new" : null}
              iconPosition="right"
            >
              <span className="truncate text-[10px] font-bold sm:text-xs">{btn.text || 'Beli'}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
