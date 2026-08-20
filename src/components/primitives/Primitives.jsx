import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const SolarActionButton = ({
  label = 'Review 1 Agent Tax Proposal',
  variant = 'yellow',
  fullWidth = true,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <button
      className={`${fullWidth ? 'w-full' : 'px-5'} py-3.5 ${v.bg} hover:opacity-90 text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 ${className}`}
      {...rest}
    >
      <span>{label}</span>
    </button>
  );
};

export const StandardToastNotification = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
}) => {
  if (!isOpen) return null;

  const iconBg = type === 'alert' 
    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400' 
    : type === 'success' 
    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400' 
    : 'bg-sky-100 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400';

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xl animate-toast flex items-start gap-3">
      <div className={`w-7 h-7 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 font-bold`}>
        i
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold">{title}</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{message}</div>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">✕</button>
    </div>
  );
};

export const ThemeToggleSwitch = ({
  isDarkMode,
  onToggle,
  className = '',
}) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
        isDarkMode 
          ? 'bg-slate-800 text-slate-200 border-slate-700' 
          : 'bg-slate-100 text-slate-800 border-slate-300'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};

export const BottomNavigationDock = ({
  activeTab,
  onTabChange,
  badgeCount = 1,
}) => {
  return (
    <nav className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex justify-between items-center z-40">
      <button 
        onClick={() => onTabChange('command')} 
        className={`flex flex-col items-center gap-1 transition ${activeTab === 'command' ? 'text-slate-950 dark:text-sky-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span className="text-[9px]">Home</span>
      </button>

      <button 
        onClick={() => onTabChange('platforms')} 
        className={`flex flex-col items-center gap-1 transition ${activeTab === 'platforms' ? 'text-slate-950 dark:text-sky-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        <span className="text-[9px]">Inflow</span>
      </button>

      <button 
        onClick={() => onTabChange('taxvault')} 
        className={`flex flex-col items-center gap-1 transition ${activeTab === 'taxvault' ? 'text-slate-950 dark:text-sky-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <span className="text-[9px]">Tax Vault</span>
      </button>

      <button 
        onClick={() => onTabChange('agent')} 
        className="flex flex-col items-center gap-1 text-rose-500 hover:opacity-80 relative"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        <span className="text-[9px] font-bold">1 Diff</span>
        {badgeCount > 0 && <span className="absolute -top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
      </button>
    </nav>
  );
};

export const TabularNumeralText = ({
  value,
  prefix = '',
  suffix = '',
  variant,
  className = '',
  ...rest
}) => {
  const v = variant ? (VARIANT_MAP[variant] || VARIANT_MAP.default) : null;

  return (
    <span className={`font-mono tracking-tight font-extrabold ${v ? v.text : ''} ${className}`} {...rest}>
      {prefix}{value}{suffix}
    </span>
  );
};
