import React, { useState } from 'react';
import { PiggyBank, Plus } from 'lucide-react';

/**
 * Budgets Section Component
 * Features:
 * - Segmented Toggle: [ Monthly | Annual ]
 * - Circular moneybag/savings icon
 * - Empty state with "Set Budget" primary button
 */
export const BudgetSectionCard = ({
  onSetBudget,
  className = '',
}) => {
  const [budgetPeriod, setBudgetPeriod] = useState('monthly'); // 'monthly' | 'annual'

  return (
    <div className={`w-full space-y-3 select-none ${className}`}>
      
      {/* SECTION TITLE */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white px-1">
        Budgets
      </h2>

      {/* BUDGET CARD */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 shadow-sm space-y-6 text-center">
        
        {/* SEGMENTED TOGGLE (Monthly / Annual) */}
        <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setBudgetPeriod('monthly')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
              budgetPeriod === 'monthly'
                ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBudgetPeriod('annual')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
              budgetPeriod === 'annual'
                ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Annual
          </button>
        </div>

        {/* EMPTY STATE ICON */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-inner">
            <PiggyBank className="w-8 h-8" />
          </div>
        </div>

        {/* EMPTY STATE CONTENT */}
        <div className="space-y-1.5 max-w-xs mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            No Budget Yet?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set a {budgetPeriod} budget to achieve your saving goals and tax reserves.
          </p>
        </div>

        {/* SET BUDGET BUTTON */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onSetBudget}
            className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition shadow-sm active:scale-95 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>

      </div>

    </div>
  );
};
