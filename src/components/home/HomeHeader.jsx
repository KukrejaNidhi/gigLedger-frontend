import React from 'react';
import { User, Mic, Search, Crown } from 'lucide-react';

/**
 * Mobile App Home Header
 * Features:
 * - User Avatar with status indicator
 * - Dynamic User Name & "Upgrade to Pro" pill badge
 * - Circular Voice Mic button & Search button
 */
export const HomeHeader = ({
  user,
  onUpgradePro,
  onVoiceClick,
  onSearchClick,
  isListening = false,
  className = '',
}) => {
  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user?.name || 'Guest User';

  return (
    <header className={`w-full flex items-center justify-between py-2 px-1 select-none ${className}`}>
      
      {/* LEFT: User Profile & Pro Badge */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm flex-shrink-0">
          <User className="w-6 h-6" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0D1117]"></span>
        </div>

        {/* User Name & Upgrade Pill */}
        <div className="flex flex-col items-start">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {displayName}
          </h1>

          <button
            type="button"
            onClick={onUpgradePro}
            className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700 transition"
          >
            <Crown className="w-3 h-3 text-sky-500 dark:text-sky-400" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Voice & Search Circular Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Voice Search Mic Button */}
        <button
          type="button"
          onClick={onVoiceClick}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            isListening
              ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-md shadow-rose-500/30'
              : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm active:scale-95'
          }`}
          title="Voice Command / Dictate"
          aria-label="Voice Command"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={onSearchClick}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 shadow-sm transition active:scale-95"
          title="Search Transactions"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
