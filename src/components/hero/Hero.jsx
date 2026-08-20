import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const HeroCommandHeader = ({
  userName = 'Alton',
  roleTitle = 'Independent Earner',
  balance = '$4,850.00',
  balanceLabel = 'Net Safe-to-Spend',
  deltaText = '+12.4% vs last week',
  avatarUrl,
  onNotificationClick,
  hasUnreadNotification = true,
  variant = 'yellow',
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 overflow-hidden">
            {avatarUrl ? <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" /> : userName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Hello, {userName}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">{roleTitle}</div>
          </div>
        </div>

        <button 
          onClick={onNotificationClick} 
          className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative hover:border-slate-400 transition"
          aria-label="Notifications"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          {hasUnreadNotification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>}
        </button>
      </div>

      <div className="text-center py-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{balanceLabel}</span>
        <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{balance}</div>
        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
          {deltaText}
        </div>
      </div>
    </div>
  );
};

export const MetricBentoGrid = ({
  metrics = [
    { label: 'Gross Inflow', value: '$6,420.00', subLabel: 'Consolidated', variant: 'sky' },
    { label: 'Tax Reserve', value: '$1,120.00', subLabel: '23% Protected', variant: 'coral' },
    { label: 'Deductibles', value: '$1,570.00', subLabel: 'Schedule C', variant: 'olive' },
    { label: 'Mileage Yield', value: '142 mi', subLabel: '67¢/mi IRS standard', variant: 'steel' },
  ],
  columns = 2,
  className = '',
  ...rest
}) => {
  const colClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-2.5 w-full ${className}`} {...rest}>
      {metrics.map((m, idx) => {
        const v = VARIANT_MAP[m.variant || 'neutral'] || VARIANT_MAP.default;
        return (
          <div key={idx} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{m.value}</div>
            {m.subLabel && <div className={`text-[10px] ${v.text}`}>{m.subLabel}</div>}
          </div>
        );
      })}
    </div>
  );
};

export const LiquidityBufferBadge = ({
  percentage = 65,
  label = 'Safe Liquidity',
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${v.bgSubtle} border ${v.border} ${v.text} text-[11px] font-mono font-bold ${className}`} {...rest}>
      <span className={`w-2 h-2 rounded-full ${v.bg}`}></span>
      <span>{percentage}% {label}</span>
    </span>
  );
};

export const ShiftCalendarStrip = ({
  title = 'Active Driving Shifts (August)',
  days = [
    { dayName: 'S', dayNumber: '07' },
    { dayName: 'M', dayNumber: '08' },
    { dayName: 'T', dayNumber: '09' },
    { dayName: 'W', dayNumber: '10', isActive: true },
    { dayName: 'T', dayNumber: '11' },
    { dayName: 'F', dayNumber: '12' },
    { dayName: 'S', dayNumber: '13' },
  ],
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm ${className}`} {...rest}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</div>
      <div className="flex justify-between text-xs font-bold text-center">
        {days.map((d, idx) => (
          <div 
            key={idx} 
            className={`p-1.5 rounded-xl transition-all ${
              d.isActive 
                ? `${v.bg} text-slate-950 font-extrabold shadow-sm` 
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>{d.dayName}</span>
            <div className={`text-[10px] font-mono ${d.isActive ? 'text-slate-950' : 'text-slate-400'}`}>{d.dayNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
