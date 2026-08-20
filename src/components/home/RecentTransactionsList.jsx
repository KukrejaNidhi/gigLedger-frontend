import React from 'react';
import { Utensils, Banknote, Car, ShoppingBag, Fuel, CreditCard, Wallet } from 'lucide-react';

/**
 * Recent Transactions Section
 * Features:
 * - Card-based clean layout matching the reference
 * - Category icon containers in squircle
 * - 100% zero emojis, purely clean vector SVG icons
 * - Positive green income vs neutral spending amount display
 */
export const RecentTransactionsList = ({
  transactions = [
    {
      id: 'tx-1',
      title: 'Food and Dining',
      icon: 'food',
      category: 'Food and Dining',
      method: 'Cash',
      amount: 100.0,
      isIncome: false,
      date: 'Today',
    },
    {
      id: 'tx-2',
      title: 'Salary',
      icon: 'salary',
      category: 'Salary',
      method: 'Cash',
      amount: 500.0,
      isIncome: true,
      date: 'Today',
    },
  ],
  currency = '₹',
  onTransactionClick,
  className = '',
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'food':
        return <Utensils className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'salary':
        return <Banknote className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case 'fuel':
        return <Fuel className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
      case 'ride':
        return <Car className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'food':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40';
      case 'salary':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/40';
      case 'fuel':
        return 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/40';
      default:
        return 'bg-sky-50 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-800/40';
    }
  };

  return (
    <div className={`w-full space-y-3 select-none ${className}`}>
      
      {/* SECTION TITLE */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white px-1">
        Recent Transactions
      </h2>

      {/* TRANSACTION CARDS CONTAINER */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-3 sm:p-4 shadow-sm space-y-2.5">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => onTransactionClick && onTransactionClick(tx)}
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
          >
            {/* LEFT: Category Icon & Details */}
            <div className="flex items-center gap-3.5">
              {/* Squircle Icon */}
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-sm ${getIconBg(tx.icon)}`}>
                {getIcon(tx.icon)}
              </div>

              {/* Title & Payment Method */}
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {tx.title}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mt-1">
                  <Wallet className="w-3 h-3 text-slate-400" />
                  <span>{tx.method}</span>
                </span>
              </div>
            </div>

            {/* RIGHT: Amount & Date */}
            <div className="flex flex-col items-end">
              <span className={`text-sm sm:text-base font-extrabold font-mono ${
                tx.isIncome
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {tx.isIncome ? `+${currency}${tx.amount.toFixed(1)}` : `${currency}${tx.amount.toFixed(1)}`}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {tx.date}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
