import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const PlatformSwitcherTabs = ({
  tabs = [
    { id: 'all', label: 'All Inflow' },
    { id: 'uber', label: 'Uber', count: 42 },
    { id: 'doordash', label: 'DoorDash', count: 38 },
    { id: 'upwork', label: 'Upwork', count: 2 },
    { id: 'expenses', label: 'Expenses' },
  ],
  activeTab = 'all',
  onTabChange,
  variant = 'yellow',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`flex gap-1.5 overflow-x-auto no-scrollbar py-1 w-full ${className}`} {...rest}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive
                ? `${v.bg} text-slate-950 shadow-sm font-extrabold`
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-black/15 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const TransactionItemRow = ({
  platformName = 'Uber Driver Direct Deposit',
  categoryText = '42 trips completed · Auto-reconciled',
  amount = '+$1,120.00',
  isIncome = true,
  tagText,
  logoLetter = 'UBER',
  variant = 'sky',
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm ${className}`} {...rest}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] text-white tracking-tight">
          {logoLetter}
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{platformName}</span>
            {tagText && (
              <span className="px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[9px] font-bold">
                {tagText}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400">{categoryText}</div>
        </div>
      </div>
      <span className={`text-xs font-extrabold font-mono ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
        {amount}
      </span>
    </div>
  );
};

export const PlatformConnectionCard = ({
  onConnect,
  className = '',
  ...rest
}) => {
  return (
    <div 
      onClick={onConnect} 
      className={`w-full bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-sky-400 transition ${className}`}
      {...rest}
    >
      <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center font-bold text-base">
        +
      </div>
      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Connect New Earning App</div>
      <div className="text-[10px] text-slate-400">Instacart · Lyft · Fiverr · Stripe</div>
    </div>
  );
};

export const FeeBreakdownPopover = ({
  grossPayout = '$1,350.00',
  platformCut = '-$230.00',
  netDeposited = '$1,120.00',
  taxHold = '$257.60',
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2 text-xs ${className}`} {...rest}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Payout Breakdown</div>
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-500">
          <span>Gross Customer Charges</span>
          <span className="font-mono text-slate-900 dark:text-white font-bold">{grossPayout}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>− Platform Service Fees (17%)</span>
          <span className="font-mono text-rose-500 font-bold">{platformCut}</span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-0.5"></div>
        <div className="flex justify-between font-bold text-slate-900 dark:text-white">
          <span>Net Deposited</span>
          <span className="font-mono text-emerald-600">{netDeposited}</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Suggested Tax Set-Aside (23%)</span>
          <span className="font-mono text-yellow-600 font-bold">{taxHold}</span>
        </div>
      </div>
    </div>
  );
};
