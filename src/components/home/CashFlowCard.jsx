import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, TrendingDown, TrendingUp, HelpCircle } from 'lucide-react';

/**
 * Cash Flow Summary Card
 * Features:
 * - Timeframe dropdown filter ("This Month", "Last Month", "This Quarter", "Year to Date")
 * - SPENDING (-) vs INCOME (+) prominent column split with Rupees (₹)
 * - Net Balance bottom highlighted section with dotted underline
 * - Pure Electric Sky Blue / Obsidian theme with tactile shadow (shadow-sm hover:shadow-md)
 * - 100% zero emojis
 */
export const CashFlowCard = ({
  spending = 1000.0,
  income = 5000.0,
  currency = '₹',
  selectedTimeframe = 'This Month', // controlled: the parent owns which period is selected and (re)computes spending/income for it
  onTimeframeChange,
  className = '',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNetHelp, setShowNetHelp] = useState(false);
  const dropdownRef = useRef(null);

  const timeframes = ['This Month', 'Last Month', 'This Quarter', 'Year to Date'];

  const netBalance = income - spending;

  const handleSelectTimeframe = (tf) => {
    setIsDropdownOpen(false);
    if (onTimeframeChange) onTimeframeChange(tf);
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className={`w-full relative rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-5 shadow-sm hover:shadow-md transition-all space-y-4 select-none ${className}`}>

      {/* Background Subtle Gradient Glow — clipped to its own layer, not the card,
          so it never clips the dropdown menu below */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Scrim behind the open dropdown — the menu is absolutely positioned
          and would otherwise float directly on top of the Income figure /
          Net Balance bar below it without this, reading as a layout bug
          rather than an intentional overlay */}
      {isDropdownOpen && (
        <div className="absolute inset-0 rounded-3xl bg-white/70 dark:bg-[#161B22]/80 backdrop-blur-[1px] z-20"></div>
      )}

      {/* 1. TOP HEADER: "CASH FLOW" & TIMEFRAME DROPDOWN — z-25 so the button/
          dropdown stay above the scrim (z-20) even while it's dimming the
          rest of the card */}
      <div className="flex items-center justify-between relative z-[25]">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-400">
            CASH FLOW
          </h2>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
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
        
        {/* SPENDING COLUMN (-) */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              SPENDING
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white flex items-baseline">
            <span>-{currency}{Math.abs(spending).toFixed(2)}</span>
          </div>
        </div>

        {/* INCOME COLUMN (+) */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
              INCOME
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white flex items-baseline">
            <span>+{currency}{Math.abs(income).toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* 3. NET BALANCE HIGHLIGHT BAR */}
      <div className="w-full rounded-2xl bg-slate-50 dark:bg-[#0D1117]/80 border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center justify-between relative z-10 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span
            onClick={() => setShowNetHelp(!showNetHelp)}
            className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-dotted border-slate-400 dark:border-slate-600 cursor-pointer"
            title="Net Balance = Total Income - Total Spending"
          >
            Net Balance
          </span>
        </div>

        <div className="text-base sm:text-lg font-mono font-extrabold tracking-tight text-slate-900 dark:text-white">
          {netBalance >= 0 ? `+${currency}${netBalance.toFixed(2)}` : `-${currency}${Math.abs(netBalance).toFixed(2)}`}
        </div>
      </div>

    </div>
  );
};
