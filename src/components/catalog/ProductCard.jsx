import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

// Helper to format IDR currency
export function formatRupiah(amount) {
  if (typeof amount !== 'number') return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export default function ProductCard({ product }) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Determine button label and icon for marketplace
  const marketplaceLabel = product.marketplace_type === 'shopee'
    ? 'Shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'Tokopedia'
    : 'Marketplace';

  const marketplaceVariant = product.marketplace_type === 'shopee'
    ? 'shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'tokopedia'
    : 'primary';

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 border border-slate-200/80 hover:border-primary/40 hover:-translate-y-1">
      {/* 1:1 Aspect Ratio Image */}
      <Link to={`/product/${product.slug}`} className="relative w-full aspect-square bg-slate-100 overflow-hidden block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.is_featured && (
            <Badge variant="featured" size="sm" />
          )}
          {hasDiscount && (
            <Badge variant="discount" size="sm">
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Chip */}
          <span className="text-[11px] font-bold font-headline uppercase tracking-wider text-primary">
            {product.category_name}
          </span>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="font-headline font-semibold text-sm sm:text-base text-on-surface hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Outbound Actions */}
        <div className="pt-2 border-t border-slate-100">
          {/* Price display with tnum */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-lg sm:text-xl text-primary tnum tracking-tight">
                {formatRupiah(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through tnum">
                  {formatRupiah(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              as={Link}
              to={`/product/${product.slug}`}
              variant="secondary"
              size="sm"
              className="w-full text-center"
            >
              Detail
            </Button>
            <Button
              as="a"
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              variant={marketplaceVariant}
              size="sm"
              className="w-full text-center"
              icon="open_in_new"
              iconPosition="right"
            >
              {marketplaceLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
