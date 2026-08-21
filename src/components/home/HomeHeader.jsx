import React from 'react';
import { User, Bell } from 'lucide-react';

/**
 * Mobile App Top Header
 * Features:
 * - User Avatar with active status indicator
 * - Dynamic User Name & page title/subtitle
 * - Notification bell (deadline-driven) with unread badge
 * - Clean zero-emoji iconography
 */
export const HomeHeader = ({
  user,
  pageTitle,
  pageSubtitle,
  notificationCount = 0,
  onNotificationClick,
  className = '',
}) => {
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Earner';

  return (
    <header className={`w-full flex items-center justify-between py-2 px-1 select-none ${className}`}>

      {/* LEFT: User Profile & Title */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm flex-shrink-0">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0D1117]"></span>
        </div>

        {/* User Name & Custom Subtitle */}
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

      {/* RIGHT: Notification Bell */}
      {onNotificationClick && (
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex-shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white dark:border-[#0D1117]">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      )}

    </header>
  );
};
