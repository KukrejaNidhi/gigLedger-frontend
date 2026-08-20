import React from 'react';
import { Trophy } from 'lucide-react';

/**
 * Habit Milestone Banner
 * Features:
 * - Squircle Trophy Badge
 * - Motivational Habit Tracker text
 * - "View" action button
 */
export const HabitTrophyBanner = ({
  message = 'First one logged. The habit begins.',
  onViewClick,
  className = '',
}) => {
  return (
    <div className={`w-full rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800/80 p-3.5 flex items-center justify-between gap-3 shadow-sm select-none transition ${className}`}>
      
      {/* LEFT: Trophy Icon & Text */}
      <div className="flex items-center gap-3">
        {/* Squircle Trophy Icon */}
        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0">
          <Trophy className="w-5 h-5" />
        </div>

        {/* Text */}
        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">
          {message}
        </p>
      </div>

      {/* RIGHT: View Button */}
      <button
        type="button"
        onClick={onViewClick}
        className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex-shrink-0 active:scale-95"
      >
        View
      </button>

    </div>
  );
};
