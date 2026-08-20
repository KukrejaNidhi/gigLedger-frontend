import React from 'react';

/**
 * Net Safe-to-Spend & Multi-Segment Liquidity Buffer Card
 * Features:
 * - Large tabular numerals for Net Safe-to-Spend
 * - Multi-color segmented progress bar with Sky Blue, Amber, and Coral
 * - Clean legend dots (no emojis)
 */
export const LiquidityBufferCard = ({
  safeAmount = 3730.0,
  safePercent = 65,
  taxPercent = 23,
  expensePercent = 12,
  currency = '$',
  className = '',
}) => {
  return (
    <div className={`w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 shadow-sm space-y-4 select-none ${className}`}>
      
      {/* 1. TOP HEADER ROW */}
      <div className="flex items-start justify-between">
        {/* Left: Net Safe-to-Spend */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            NET SAFE-TO-SPEND
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {currency}{safeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Right: Liquidity Buffer Label */}
        <div className="text-right space-y-0.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
            LIQUIDITY BUFFER
          </span>
          <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 font-mono">
            {safePercent}% Safe
          </span>
        </div>
      </div>

      {/* 2. MULTI-COLOR SEGMENTED PROGRESS BAR */}
      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
        {/* Segment 1: Safe Cash (Sky Blue) */}
        <div
          className="h-full rounded-l-full bg-sky-400 dark:bg-sky-500 shadow-sm transition-all duration-500"
          style={{ width: `${safePercent}%` }}
        ></div>

        {/* Segment 2: Tax Vault (Warm Amber) */}
        <div
          className="h-full bg-amber-400 dark:bg-amber-500 shadow-sm transition-all duration-500"
          style={{ width: `${taxPercent}%` }}
        ></div>

        {/* Segment 3: Expenses (Coral Rose) */}
        <div
          className="h-full rounded-r-full bg-rose-500 dark:bg-rose-500 shadow-sm transition-all duration-500"
          style={{ width: `${expensePercent}%` }}
        ></div>
      </div>

      {/* 3. MULTI-COLOR LEGEND ROW */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
        {/* Safe Legend */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>{safePercent}% Safe</span>
        </div>

        {/* Tax Vault Legend */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{taxPercent}% Tax Vault</span>
        </div>

        {/* Expenses Legend */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>{expensePercent}% Expenses</span>
        </div>
      </div>

    </div>
  );
};
