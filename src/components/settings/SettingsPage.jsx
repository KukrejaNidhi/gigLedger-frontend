import React from 'react';
import { User, Moon, Sun, Percent, LogOut, ChevronRight } from 'lucide-react';
import { ThemeToggleSwitch } from '../primitives/Primitives.jsx';

/**
 * Settings — replaces the old "More" tab's unrelated demo content with real,
 * working preferences: profile summary, theme toggle, quick links to the
 * Tax Center's estimate/deadlines/inbox, and sign out.
 */
export const SettingsPage = ({
  user,
  isDarkMode,
  onToggleTheme,
  onOpenTaxCenter,
  onLogout,
  className = '',
}) => {
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Earner';

  return (
    <div className={`space-y-4 animate-fadeIn ${className}`}>
      <div className="flex items-center justify-between py-1">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Settings</span>
      </div>

      {/* PROFILE SUMMARY */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-sm hover:shadow-md transition-all flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-2xs flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{displayName}</h2>
          <p className="text-xs text-slate-400 font-mono truncate">{user?.email || ''}</p>
        </div>
      </div>

      {/* PREFERENCES & LINKS */}
      <div className="rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-3 shadow-sm hover:shadow-md transition-all space-y-1">

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Theme</span>
          </div>
          <ThemeToggleSwitch isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>

        {/* Tax Center quick link */}
        <button
          type="button"
          onClick={onOpenTaxCenter}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center gap-3">
            <Percent className="w-5 h-5 text-sky-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tax Estimate & Deadlines</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Sign Out</span>
          </div>
        </button>

      </div>
    </div>
  );
};
