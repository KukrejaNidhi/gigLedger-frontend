import React from 'react';
import { Banknote, CreditCard } from 'lucide-react';

/**
 * Merchant/platform thumbnail — a branded mark (each platform's real color
 * + a short wordmark/monogram) rather than a generic category icon, so
 * Uber/Zomato/Swiggy/Apple rows are recognizable at a glance like a real
 * transaction feed. Falls back to a plain category icon for anything
 * unbranded (generic income/expense).
 */
const BRANDS = {
  uber: { bg: '#000000', text: '#FFFFFF', mark: 'UB', ring: 'border-slate-800' },
  zomato: { bg: '#E23744', text: '#FFFFFF', mark: 'ZO', ring: 'border-red-500/40' },
  swiggy: { bg: '#FC8019', text: '#FFFFFF', mark: 'SW', ring: 'border-orange-500/40' },
  apple: { bg: '#0B0B0F', text: '#FFFFFF', mark: 'AP', ring: 'border-slate-700' },
  shell: { bg: '#FFD500', text: '#DD1D21', mark: 'SH', ring: 'border-amber-400' },
  starbucks: { bg: '#00704A', text: '#FFFFFF', mark: 'SB', ring: 'border-emerald-600' },
  ola: { bg: '#000000', text: '#B6F500', mark: 'OL', ring: 'border-slate-800' },
};

function detectBrandKey(tx) {
  const haystack = `${tx.brand || ''} ${tx.icon || ''} ${tx.source || ''} ${tx.title || ''} ${tx.rawDescription || ''}`.toLowerCase();
  for (const key of Object.keys(BRANDS)) {
    if (haystack.includes(key)) return key;
  }
  if (haystack.includes('fuel') || haystack.includes('petrol') || haystack.includes('gas')) return 'shell';
  if (haystack.includes('coffee')) return 'starbucks';
  return null;
}

export const BrandThumbnail = ({ transaction, size = 'md', className = '' }) => {
  const dims = size === 'sm' ? 'w-9 h-9 text-[10px]' : size === 'lg' ? 'w-12 h-12 text-sm' : 'w-11 h-11 sm:w-12 sm:h-12 text-xs';
  const brandKey = detectBrandKey(transaction || {});
  const brand = brandKey ? BRANDS[brandKey] : null;

  if (brand) {
    return (
      <div
        className={`${dims} rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-xs font-black tracking-tight ${brand.ring} ${className}`}
        style={{ backgroundColor: brand.bg, color: brand.text }}
      >
        <span className="leading-none">{brand.mark}</span>
      </div>
    );
  }

  const isIncome = transaction?.isIncome || transaction?.type === 'income';
  const Icon = isIncome ? Banknote : CreditCard;
  return (
    <div
      className={`${dims} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs border ${
        isIncome
          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};
