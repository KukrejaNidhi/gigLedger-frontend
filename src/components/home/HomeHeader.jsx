import React from 'react';
import { User, Mic, Search, Crown } from 'lucide-react';

/**
 * Mobile App Top Header
 * Features:
 * - User Avatar with active status indicator
 * - Dynamic User Name & "Upgrade to Pro" pill badge
 * - Circular Voice Mic button (listening state) & Search button
 * - Clean zero-emoji iconography
 */
export const HomeHeader = ({
  user,
  onUpgradePro,
  onVoiceClick,
  onSearchClick,
  isListening = false,
  pageTitle,
  pageSubtitle,
  className = '',
}) => {
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Earner';

  return (
    <header className={`w-full flex items-center justify-between py-2 px-1 select-none ${className}`}>

      {/* LEFT: User Profile & Pro Badge / Title */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm flex-shrink-0">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0D1117]"></span>
        </div>

        {/* User Name & Upgrade Pill / Custom Subtitle */}
        <div className="flex flex-col items-start">
          <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {pageTitle || displayName}
          </h1>

          {pageSubtitle && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {pageSubtitle}
            </span>
          )}
        </div>
      </div>


    </header>
  );
};
