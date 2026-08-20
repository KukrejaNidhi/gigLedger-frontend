import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

/**
 * Agent Action Pending Card
 * Features:
 * - Squircle Lightning Bolt Icon
 * - "Agent Action Pending" heading with coral DIFF badge
 * - "Shell Gas $42.50 · Matched Uber shift" subtext
 * - "Review →" interactive link
 */
export const AgentActionCard = ({
  title = 'Agent Action Pending',
  badgeText = 'DIFF',
  subtitle = 'Shell Gas $42.50 · Matched Uber shift',
  onReviewClick,
  className = '',
}) => {
  return (
    <div
      onClick={onReviewClick}
      className={`w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-4 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 transition group select-none ${className}`}
    >
      {/* LEFT: Icon & Details */}
      <div className="flex items-center gap-3">
        {/* Squircle Lightning Bolt */}
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <Zap className="w-6 h-6 fill-amber-400/20" />
        </div>

        {/* Text Details */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black tracking-wide font-mono">
              {badgeText}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT: Review Action Link */}
      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition flex-shrink-0">
        <span>Review</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
