import React from 'react';
import { TrendingUp, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Financial Insights Section with Net Inflow & Tax Reserve Ratio
 * Features:
 * - Card 1: Net Inflow metric with percentage increase
 * - Card 2: Tax Reserve Ratio with compliance status
 * - Primary Action Button: "Review 1 Agent Tax Proposal"
 */
export const FinancialInsightsList = ({
  netInflow = 300.03,
  netInflowPercent = 6.1,
  taxRatioPercent = 100,
  onReviewProposal,
  currency = '$',
  className = '',
}) => {
  return (
    <div className={`w-full space-y-3.5 select-none ${className}`}>
      
      {/* SECTION TITLE */}
      <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-400 px-1">
        FINANCIAL INSIGHTS
      </h2>

      {/* INSIGHTS CARDS CONTAINER */}
      <div className="space-y-3">
        
        {/* INSIGHT 1: NET INFLOW */}
        <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Squircle Sky Icon */}
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40 flex items-center justify-center text-sky-500 dark:text-sky-400 flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>

            {/* Text Details */}
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Net Inflow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Increased by {netInflowPercent}% vs last week
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-500 dark:text-emerald-400">
            +{currency}{netInflow.toFixed(2)}
          </div>
        </div>

        {/* INSIGHT 2: TAX RESERVE RATIO */}
        <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Squircle Amber Icon */}
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            {/* Text Details */}
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Tax Reserve Ratio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                23% Target Protected for Q3
              </p>
            </div>
          </div>

          {/* Ratio Status */}
          <div className="text-xs sm:text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {taxRatioPercent}% OK
          </div>
        </div>

      </div>

      {/* PRIMARY ACTION BUTTON: REVIEW 1 AGENT TAX PROPOSAL */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReviewProposal}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Review 1 Agent Tax Proposal</span>
        </button>
      </div>

    </div>
  );
};
