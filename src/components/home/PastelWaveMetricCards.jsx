import React from 'react';
import { ArrowUpRight, Shield, TrendingUp } from 'lucide-react';

/**
 * Dual Pastel Wave Metric Cards
 * Features:
 * - Card 1: Gross Inflow with Electric Sky Blue smooth wave curve (#38BDF8)
 * - Card 2: Tax Reserve with Warm Amber smooth wave curve (#F59E0B)
 * - Soft pastel tint cards with rich borders and glowing depth
 * - Zero emojis, 100% clean SVG aesthetics
 */
export const PastelWaveMetricCards = ({
  grossInflow = 5200,
  taxReserve = 1120,
  currency = '$',
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3.5 w-full select-none ${className}`}>
      
      {/* CARD 1: GROSS INFLOW (ELECTRIC SKY PASTEL) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/80 to-white dark:from-sky-950/25 dark:to-[#161B22] border border-sky-200/90 dark:border-sky-800/40 p-4 shadow-sm flex flex-col justify-between h-36 transition-transform hover:scale-[1.01]">
        
        {/* Top Header */}
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Gross Inflow
          </span>
          <div className="flex items-center gap-1 text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            <span className="text-sky-500 text-lg">↑</span>
            <span>{currency}{grossInflow.toLocaleString()}</span>
          </div>
        </div>

        {/* Smooth Organic Sky Wave Curve */}
        <div className="w-full pt-2">
          <svg
            viewBox="0 0 140 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 drop-shadow-sm"
          >
            <path
              d="M2 24 C 25 24, 45 16, 70 16 C 95 16, 115 8, 138 6"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

      </div>

      {/* CARD 2: TAX RESERVE (WARM AMBER PASTEL) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/70 to-white dark:from-amber-950/20 dark:to-[#161B22] border border-amber-200/90 dark:border-amber-800/40 p-4 shadow-sm flex flex-col justify-between h-36 transition-transform hover:scale-[1.01]">
        
        {/* Top Header */}
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tax Reserve
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {currency}{taxReserve.toLocaleString()}
          </div>
        </div>

        {/* Smooth Organic Amber Wave Curve */}
        <div className="w-full pt-2">
          <svg
            viewBox="0 0 140 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 drop-shadow-sm"
          >
            <path
              d="M2 14 C 25 14, 45 22, 70 22 C 95 22, 115 16, 138 20"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

      </div>

    </div>
  );
};
