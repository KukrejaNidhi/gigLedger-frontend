import React from 'react';
import { 
  Car, 
  Utensils, 
  ShoppingBag, 
  Banknote, 
  Fuel, 
  Coffee, 
  Smartphone, 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Recent Transactions Section
 * Features:
 * - Branded / Category thumbnails (Uber, Zomato, Swiggy, Apple, Shell, Starbucks, etc.)
 * - Explicit '+' for incoming and '-' for outgoing money in Rupees (₹)
 * - Tactile card styling with subtle elevation shadows (shadow-sm hover:shadow-md)
 * - 100% zero emojis, purely clean vector icons
 */
export const RecentTransactionsList = ({
  transactions = [],
  currency = '₹',
  onTransactionClick,
  className = '',
}) => {
  // Render high-fidelity thumbnail for popular brands & categories
  const renderThumbnail = (tx) => {
    const brand = (tx.brand || tx.icon || tx.title || '').toLowerCase();

    if (brand.includes('uber')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-black text-white border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Car className="w-5 h-5 text-white" />
        </div>
      );
    }
    if (brand.includes('zomato')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E23744] text-white border border-red-500/40 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Utensils className="w-5 h-5 text-white" />
        </div>
      );
    }
    if (brand.includes('swiggy')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FC8019] text-white border border-orange-500/40 flex items-center justify-center flex-shrink-0 shadow-xs">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
      );
    }
    if (brand.includes('shell') || brand.includes('fuel') || brand.includes('gas') || brand.includes('petrol')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-slate-950 border border-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Fuel className="w-5 h-5 text-slate-950 stroke-[2.2]" />
        </div>
      );
    }
    if (brand.includes('starbucks') || brand.includes('coffee')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#00704A] text-white border border-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Coffee className="w-5 h-5 text-white" />
        </div>
      );
    }
    if (brand.includes('apple')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Smartphone className="w-5 h-5 text-slate-200" />
        </div>
      );
    }
    if (tx.isIncome || brand.includes('salary') || brand.includes('payout')) {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Banknote className="w-5 h-5" />
        </div>
      );
    }

    // Default Expense
    return (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
        <CreditCard className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className={`w-full space-y-2.5 select-none ${className}`}>
      
      {/* SECTION TITLE & COUNT */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
          Recent Transactions
        </h2>
        <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
          {transactions.length} items
        </span>
      </div>

      {/* TRANSACTION CARDS CONTAINER */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-shadow divide-y divide-slate-100 dark:divide-slate-800/80">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => onTransactionClick && onTransactionClick(tx)}
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group"
          >
            {/* LEFT: Branded Thumbnail & Metadata */}
            <div className="flex items-center gap-3">
              {renderThumbnail(tx)}

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {tx.title}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="capitalize">{tx.category || 'General'}</span>
                  <span>·</span>
                  <span>{tx.method || 'Card'}</span>
                </span>
              </div>
            </div>

            {/* RIGHT: Amount with + or - and Date */}
            <div className="flex flex-col items-end">
              <span className="text-xs sm:text-sm font-extrabold font-mono flex items-center gap-0.5 text-slate-900 dark:text-white">
                {tx.isIncome ? (
                  <>
                    <span>+</span>
                    <span>{currency}{Math.abs(tx.amount).toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    <span>-</span>
                    <span>{currency}{Math.abs(tx.amount).toFixed(2)}</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                {tx.date || 'Today'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
