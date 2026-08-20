import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const HatchedBenchmarkBarChart = ({
  data = [
    { label: 'Mon', value: 65, isBenchmark: true },
    { label: 'Tue', value: 45, isBenchmark: true },
    { label: 'Wed', value: 85, isBenchmark: true },
    { label: 'Thu', value: 100, highlight: true },
    { label: 'Fri', value: 55, isBenchmark: true },
    { label: 'Sat', value: 40, isBenchmark: true },
  ],
  title = 'Weekly Inflow Benchmark',
  totalLabel = '$5,970 Consolidated',
  variant = 'sky',
  maxHeight = 96,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const maxVal = Math.max(...data.map(d => d.value), 100);

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</span>
          <div className="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-100">{totalLabel}</div>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-semibold text-slate-500">
          <span className="px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg shadow-sm font-bold">Week</span>
          <span className="px-2 py-0.5">Month</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end pt-1 px-1" style={{ height: `${maxHeight}px` }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxVal) * 100);
          return (
            <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
              {item.highlight ? (
                <div 
                  className={`w-full ${v.bg} rounded-lg shadow-sm relative flex items-center justify-center transition-all`} 
                  style={{ height: `${heightPercent}%` }}
                >
                  <span className="text-[8px] font-bold text-slate-950 font-mono -rotate-90">
                    $${(item.value * 18).toFixed(0)}
                  </span>
                </div>
              ) : (
                <div 
                  className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-md border border-slate-200/50 dark:border-slate-700/40"
                  style={{ 
                    height: `${heightPercent}%`,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(148, 163, 184, 0.15) 3px, rgba(148, 163, 184, 0.15) 6px)'
                  }}
                />
              )}
              <span className={`text-[9px] font-mono ${item.highlight ? `${v.text} font-bold` : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TorusHaloDial = ({
  safePercent = 77,
  availableCash = '$4,850.00',
  taxVaultAmount = '$1,120.00',
  variant = 'sky',
  size = 112,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const circumference = 2 * Math.PI * 40;
  const safeOffset = circumference - (safePercent / 100) * circumference;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Safe-to-Spend</span>
        <span className={`text-xs font-bold font-mono ${v.text}`}>+12.4% vs last week</span>
      </div>

      <div className="flex items-center justify-between gap-4 py-1">
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke={v.fill} 
              strokeWidth="12" 
              strokeLinecap="round" 
              fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={safeOffset} 
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">{safePercent}%</span>
            <span className="text-[8px] text-slate-400">Liquid</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Available Cash</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{availableCash}</div>
          </div>
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Tax Vault
            </span>
            <span className="font-mono font-bold text-rose-500">{taxVaultAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SegmentedLiquiditySlider = ({
  safeCash = '$3,730.00',
  safePercent = 65,
  taxPercent = 23,
  expensePercent = 12,
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Safe-to-Spend</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{safeCash}</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Liquidity Buffer</span>
          <div className={`text-xs font-mono font-bold ${v.text}`}>{safePercent}% Safe</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden p-0.5 gap-0.5 border border-slate-200 dark:border-slate-700">
          <div className={`h-full ${v.bg} rounded-l-full transition-all`} style={{ width: `${safePercent}%` }}></div>
          <div className="h-full bg-yellow-400 transition-all" style={{ width: `${taxPercent}%` }}></div>
          <div className="h-full bg-rose-500 rounded-r-full transition-all" style={{ width: `${expensePercent}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-0.5">
          <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${v.bg}`}></span> {safePercent}% Safe</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> {taxPercent}% Tax Vault</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {expensePercent}% Expenses</span>
        </div>
      </div>
    </div>
  );
};

export const PastelWaveCard = ({
  title = 'Gross Inflow',
  amount = '$5,200.00',
  trend = '? +6.1%',
  variant = 'sky',
  isNegative = false,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full ${v.bgSubtle} p-4 rounded-3xl border ${v.border} shadow-sm space-y-2 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`text-[10px] font-mono font-bold ${isNegative ? 'text-rose-500' : v.text}`}>{trend}</span>
      </div>
      <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">{amount}</div>
      <svg className={`w-full h-8 ${v.text}`} viewBox="0 0 100 30" fill="none">
        <path 
          d={isNegative ? "M0 14 C35 30, 70 6, 100 22" : "M0 24 C30 6, 65 28, 100 10"} 
          stroke="currentColor" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const MultiPlatformDonutGauge = ({
  shares = [
    { name: 'Uber Rides', amount: '$3,350', percent: 52, variant: 'sky' },
    { name: 'DoorDash', amount: '$1,890', percent: 29, variant: 'coral' },
    { name: 'Upwork', amount: '$1,180', percent: 19, variant: 'olive' },
  ],
  title = 'Platform Revenue Allocation',
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 ${className}`} {...rest}>
      <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
        <span>{title}</span>
        <span className="text-[10px] font-mono text-slate-400">100% Accounted</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {shares.map((share, idx) => {
          const v = VARIANT_MAP[share.variant] || VARIANT_MAP.default;
          return (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{share.name}</span>
                <span className={`text-[10px] font-mono font-bold ${v.text}`}>{share.percent}%</span>
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{share.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuarterlyHorizonTimeline = ({
  activeQuarter = 'Q3 2024',
  dueDate = 'September 15',
  reserveReady = '$1,120.00',
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 ${className}`} {...rest}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Tax Milestone Schedule</div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
          <span className="text-slate-500">Q1 Filing (April 15)</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Paid ?</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
          <span className="text-slate-500">Q2 Filing (June 17)</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Paid ?</span>
        </div>
        <div className={`flex items-center justify-between p-3 ${v.bgSubtle} rounded-2xl border ${v.border}`}>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{activeQuarter} Filing ({dueDate})</div>
            <div className={`text-[10px] font-mono ${v.text}`}>Reserve Ready: {reserveReady}</div>
          </div>
          <span className={`px-2 py-0.5 rounded-lg ${v.bg} text-slate-950 text-[10px] font-bold uppercase`}>Current</span>
        </div>
      </div>
    </div>
  );
};

export const TaxWaterfallFlow = ({
  grossInflow = '$6,420.00',
  deductions = '-$1,570.00',
  netScheduleC = '$4,850.00',
  secaTax = '$686.00',
  incomeTax = '$434.00',
  totalReserve = '$1,120.00',
  variant = 'coral',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs ${className}`} {...rest}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculation Waterfall</div>
      <div className="flex justify-between items-center text-slate-500">
        <span>Gross 1099 Inflow</span>
        <span className="font-mono text-slate-900 dark:text-white font-bold">{grossInflow}</span>
      </div>
      <div className="flex justify-between items-center text-slate-500">
        <span>? Business Deductions (Mileage, Fuel)</span>
        <span className="font-mono text-emerald-600 font-bold">{deductions}</span>
      </div>
      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
        <span>= Schedule C Net Income</span>
        <span className="font-mono text-sky-500">{netScheduleC}</span>
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>SECA FICA Tax (15.3% on 92.35%)</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{secaTax}</span>
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>Estimated Income Tax (~8.9%)</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{incomeTax}</span>
      </div>
      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
      <div className="flex justify-between items-center font-extrabold text-sm text-slate-900 dark:text-white">
        <span>Total Tax Reserve Target</span>
        <span className={`font-mono ${v.text}`}>{totalReserve}</span>
      </div>
    </div>
  );
};
