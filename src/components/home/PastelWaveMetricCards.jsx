import React from 'react';
import { TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

/**
 * Sparkline Line Chart Metric Cards (Cash Flow Inflow & Tax Reserve)
 * Features:
 * - Card 1: Gross Inflow with Electric Sky Blue line chart + translucent gradient area fill
 * - Card 2: Tax Reserve with Warm Amber line chart + translucent gradient area fill
 * - Tactile shadows and card depth (shadow-sm hover:shadow-md)
 * - 100% zero emojis, Rupee (₹) currency support
 */
export const PastelWaveMetricCards = ({
  grossInflow = 52000,
  taxReserve = 11200,
  currency = '₹',
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-3.5 w-full select-none ${className}`}>
      
      {/* CARD 1: GROSS INFLOW (ELECTRIC SKY BLUE SPARKLINE) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/90 via-white to-white dark:from-sky-950/30 dark:via-[#161B22] dark:to-[#161B22] border border-sky-200/90 dark:border-sky-800/50 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-400/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Top Header & Amount */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gross Inflow
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 bg-sky-100/80 dark:bg-sky-950/70 px-1.5 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/40 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.4%</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            <span className="text-emerald-500 font-sans text-xl font-bold">+</span>
            <span>{currency}{grossInflow.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* High-End SVG Sparkline Line Chart with Gradient Area Fill */}
        <div className="w-full pt-1 relative z-10">
          <svg
            viewBox="0 0 140 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 overflow-visible"
          >
            <defs>
              <linearGradient id="sky-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="sky-line-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="60%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill under Curve */}
            <path
              d="M 2 34 C 25 34, 45 22, 70 22 C 95 22, 115 10, 136 6 L 136 40 L 2 40 Z"
              fill="url(#sky-chart-gradient)"
            />

            {/* Main Sparkline Stroke */}
            <path
              d="M 2 34 C 25 34, 45 22, 70 22 C 95 22, 115 10, 136 6"
              stroke="url(#sky-line-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Terminal Live Node Dot with Pulse Glow */}
            <circle cx="136" cy="6" r="3.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="136" cy="6" r="6" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>

      </div>

      {/* CARD 2: TAX RESERVE (WARM AMBER SPARKLINE) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/80 via-white to-white dark:from-amber-950/25 dark:via-[#161B22] dark:to-[#161B22] border border-amber-200/90 dark:border-amber-800/50 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Top Header & Amount */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tax Reserve
            </span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40 font-mono">
              23% Safe
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {currency}{taxReserve.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* High-End SVG Sparkline Line Chart with Gradient Area Fill */}
        <div className="w-full pt-1 relative z-10">
          <svg
            viewBox="0 0 140 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 overflow-visible"
          >
            <defs>
              <linearGradient id="amber-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="amber-line-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill under Curve */}
            <path
              d="M 2 18 C 25 18, 45 28, 70 28 C 95 28, 115 16, 136 20 L 136 40 L 2 40 Z"
              fill="url(#amber-chart-gradient)"
            />

            {/* Main Sparkline Stroke */}
            <path
              d="M 2 18 C 25 18, 45 28, 70 28 C 95 28, 115 16, 136 20"
              stroke="url(#amber-line-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Terminal Live Node Dot */}
            <circle cx="136" cy="20" r="3.5" fill="#F59E0B" className="animate-pulse" />
            <circle cx="136" cy="20" r="6" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>

      </div>

    </div>
  );
};
