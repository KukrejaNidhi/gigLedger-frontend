import React from 'react';
import { Zap, ArrowRight, ShieldAlert } from 'lucide-react';

/**
 * Agent Action Pending Card
 * Features:
 * - Squircle Lightning Bolt Icon (Lucide Zap)
 * - "Agent Action Pending" heading with coral DIFF badge
 * - "Shell Fuel ₹350.00 · Matched Uber shift" subtext
 * - "Review" interactive action with Lucide ArrowRight
 * - Tactile shadow-sm hover:shadow-md
 * - 100% zero emojis
 */
export const AgentActionCard = ({
  title = 'Agent Action Pending',
  badgeText = 'DIFF',
  subtitle = 'Shell Fuel ₹350.00 · Matched Uber shift',
  onReviewClick,
  className = '',
}) => {
  return (
    <div
      onClick={onReviewClick}
      className={`w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group select-none flex items-center justify-between gap-3 ${className}`}
    >
      {/* LEFT: Icon & Details */}
      <div className="flex items-center gap-3">
        {/* Squircle Lightning Bolt (neutral) */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Text Details */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {title}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-700 dark:bg-slate-600 text-white text-[10px] font-black tracking-wide font-mono shadow-2xs">
              {badgeText}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT: Review Action Link */}
      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white transition flex-shrink-0">
        <span>Review</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
