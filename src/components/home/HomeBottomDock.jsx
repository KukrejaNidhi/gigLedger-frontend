import React from 'react';
import { Home, BarChart3, Landmark, MoreHorizontal, Plus } from 'lucide-react';

/**
 * Mobile Bottom Navigation Dock with Central Elevated FAB '+'
 * Features:
 * - 5-column balanced grid ensuring the '+' action button is EXACTLY in the horizontal center (50% position)
 * - 4 navigation tabs: Home, Analysis, Accounts, More
 * - Smooth active/hover states with zero emojis
 * - Glassmorphic backdrop blur and tactile shadows
 */
export const HomeBottomDock = ({
  activeTab = 'home',
  onTabChange,
  onQuickAddClick,
  className = '',
}) => {
  return (
    <nav className={`w-full max-w-md mx-auto bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 px-3 py-2 z-40 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] relative ${className}`}>
      
      {/* 5-COLUMN BALANCED GRID FOR PRECISE CENTERING */}
      <div className="w-full grid grid-cols-5 items-center">
        
        {/* 1. HOME TAB */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('home')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="Home Tab"
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight">Home</span>
          </button>
        </div>

        {/* 2. ANALYSIS TAB */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('analysis')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'analysis'
                ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="Analysis Tab"
          >
            <BarChart3 className={`w-5 h-5 ${activeTab === 'analysis' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight">Analysis</span>
          </button>
        </div>

        {/* 3. EXACT CENTER '+' FAB */}
        <div className="flex justify-center items-center relative">
          <button
            type="button"
            onClick={onQuickAddClick}
            className="absolute -top-7 w-14 h-14 rounded-full bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/35 dark:shadow-sky-500/25 border-4 border-white dark:border-[#0D1117] hover:scale-105 active:scale-95 transition-all focus:outline-none ring-2 ring-sky-500/20"
            title="Log Transaction / Add"
            aria-label="Add Transaction"
          >
            <Plus className="w-7 h-7 stroke-[2.75]" />
          </button>
        </div>

        {/* 4. ACCOUNTS TAB */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('accounts')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'accounts'
                ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="Accounts Tab"
          >
            <Landmark className={`w-5 h-5 ${activeTab === 'accounts' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight">Accounts</span>
          </button>
        </div>

        {/* 5. MORE TAB */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('more')}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'more'
                ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="More Tab"
          >
            <MoreHorizontal className={`w-5 h-5 ${activeTab === 'more' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight">More</span>
          </button>
        </div>

      </div>

    </nav>
  );
};
