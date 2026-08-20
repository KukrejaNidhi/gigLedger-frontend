import React from 'react';
import { CalendarClock, Crown, Plus } from 'lucide-react';

/**
 * Scheduled Recurring Bills & Planning Card
 * Features:
 * - Section header with Pro crown icon
 * - Clean card with planning call-to-action
 */
export const ScheduledBillsCard = ({
  onScheduleClick,
  className = '',
}) => {
  return (
    <div className={`w-full space-y-3 select-none pb-6 ${className}`}>
      
      {/* SECTION TITLE WITH PRO CROWN */}
      <div className="flex items-center gap-1.5 px-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Scheduled
        </h2>
        <Crown className="w-4 h-4 text-sky-500 dark:text-sky-400" />
      </div>

      {/* SCHEDULED CARD */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 shadow-sm space-y-4 text-center">
        
        {/* ICON */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
            <CalendarClock className="w-7 h-7" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-1.5 max-w-xs mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Ready to Plan Ahead?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Elevate your financial peace of mind with recurring bills and automatic tax set-asides.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onScheduleClick}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition shadow-sm active:scale-95 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Item</span>
          </button>
        </div>

      </div>

    </div>
  );
};
