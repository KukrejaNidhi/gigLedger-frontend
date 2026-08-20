import React from 'react';
import { Home, BarChart3, Landmark, MoreHorizontal, Plus } from 'lucide-react';

/**
 * Mobile Bottom Navigation Dock with Central Elevated FAB '+'
 * Features:
 * - 4 standard tabs: Home, Analysis, Accounts, More
 * - Central elevated circular '+' Quick Add Action Button
 */
export const HomeBottomDock = ({
  activeTab = 'home',
  onTabChange,
  onQuickAddClick,
  className = '',
}) => {
  return (
    <nav className={`w-full max-w-md mx-auto bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-6 py-2 flex items-center justify-between z-40 select-none shadow-2xl relative ${className}`}>
      
      {/* 1. HOME TAB */}
      <button
        type="button"
        onClick={() => onTabChange && onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'home'
            ? 'text-slate-900 dark:text-white font-bold scale-105'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">Home</span>
      </button>

      {/* 2. ANALYSIS TAB */}
      <button
        type="button"
        onClick={() => onTabChange && onTabChange('analysis')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'analysis'
            ? 'text-slate-900 dark:text-white font-bold scale-105'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">Analysis</span>
      </button>

      {/* 3. CENTRAL ELEVATED '+' FAB */}
      <div className="relative -top-5 flex justify-center items-center">
        <button
          type="button"
          onClick={onQuickAddClick}
          className="w-14 h-14 rounded-full bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-[#30363D] text-slate-900 dark:text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none"
          title="Add Transaction"
          aria-label="Add Transaction"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. ACCOUNTS TAB */}
      <button
        type="button"
        onClick={() => onTabChange && onTabChange('accounts')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'accounts'
            ? 'text-slate-900 dark:text-white font-bold scale-105'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <Landmark className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">Accounts</span>
      </button>

      {/* 5. MORE TAB */}
      <button
        type="button"
        onClick={() => onTabChange && onTabChange('more')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'more'
            ? 'text-slate-900 dark:text-white font-bold scale-105'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-tight">More</span>
      </button>

    </nav>
  );
};
