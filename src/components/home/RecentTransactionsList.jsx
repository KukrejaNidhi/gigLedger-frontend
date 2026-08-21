import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BrandThumbnail } from '../transactions/BrandThumbnail.jsx';

/**
 * Recent Transactions Section
 * Features:
 * - Branded thumbnails (Uber, Zomato, Swiggy, Apple, Shell, Starbucks, etc.)
 * - Explicit '+' for incoming and '-' for outgoing money in Rupees (₹)
 * - Tactile card styling with subtle elevation shadows (shadow-sm hover:shadow-md)
 * - 100% zero emojis, purely clean vector icons
 */
export const RecentTransactionsList = ({
  transactions = [],
  currency = '₹',
  onTransactionClick,
  onSeeAllClick,
  className = '',
}) => {
  return (
    <div className={`w-full space-y-2.5 select-none ${className}`}>
      
      {/* SECTION TITLE & COUNT */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
          Recent Transactions
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {transactions.length} items
          </span>
          {onSeeAllClick && (
            <button
              type="button"
              onClick={onSeeAllClick}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
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
              <BrandThumbnail transaction={tx} />

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
