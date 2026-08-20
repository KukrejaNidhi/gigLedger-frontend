import React, { useState } from 'react';
import { ChevronDown, TrendingDown, TrendingUp, HelpCircle } from 'lucide-react';

/**
 * Cash Flow Summary Card
 * Features:
 * - Timeframe dropdown filter ("This Month ▾", "Last Month", "This Quarter", "Year to Date")
 * - SPENDING vs INCOME prominent column split
 * - Net Balance bottom highlighted section with dotted underline
 * - Pure Electric Sky Blue / Obsidian / Solar theme palette
 */
export const CashFlowCard = ({
  spending = 100.0,
  income = 500.0,
  currency = '₹', // or '$'
  onTimeframeChange,
  className = '',
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNetHelp, setShowNetHelp] = useState(false);

  const timeframes = ['This Month', 'Last Month', 'This Quarter', 'Year to Date'];

  const netBalance = income - spending;

  const handleSelectTimeframe = (tf) => {
    setSelectedTimeframe(tf);
    setIsDropdownOpen(false);
    if (onTimeframeChange) onTimeframeChange(tf);
  };

  const formatAmount = (val) => {
    return `${currency}${Math.abs(val).toFixed(1)}`;
  };

  return (
    <div className={`w-full relative overflow-hidden rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 shadow-sm space-y-5 transition-all ${className}`}>
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* 1. TOP HEADER: "CASH FLOW" & TIMEFRAME DROPDOWN */}
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-400">
          CASH FLOW
        </h2>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <span>{selectedTimeframe}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-xl py-1 z-30 animate-fadeIn">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => handleSelectTimeframe(tf)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition ${
                    selectedTimeframe === tf
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. SPENDING & INCOME COLUMNS */}
      <div className="grid grid-cols-2 gap-4 pt-1 relative z-10">
        
        {/* SPENDING COLUMN */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              SPENDING
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
            {formatAmount(spending)}
          </div>
        </div>

        {/* INCOME COLUMN */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
              INCOME
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
            {formatAmount(income)}
          </div>
        </div>

      </div>

      {/* 3. NET BALANCE HIGHLIGHT BAR */}
      <div className="w-full rounded-2xl bg-slate-50 dark:bg-[#0D1117]/80 border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <span
            onClick={() => setShowNetHelp(!showNetHelp)}
            className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-dotted border-slate-400 dark:border-slate-600 cursor-pointer"
            title="Net Balance = Total Income - Total Spending"
          >
            Net Balance
          </span>
        </div>

        <div className={`text-base sm:text-lg font-mono font-extrabold tracking-tight ${
          netBalance >= 0 
            ? 'text-slate-900 dark:text-white' 
            : 'text-rose-600 dark:text-rose-400'
        }`}>
          {netBalance >= 0 ? formatAmount(netBalance) : `-${formatAmount(netBalance)}`}
        </div>
      </div>

    </div>
  );
};
