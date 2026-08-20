import React from 'react';
import { Check } from 'lucide-react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const HatchedBenchmarkBarChart = ({
  data = [
    { label: 'Mon', value: 6500 },
    { label: 'Tue', value: 4500 },
    { label: 'Wed', value: 8500 },
    { label: 'Thu', value: 12000, highlight: true },
    { label: 'Fri', value: 7500 },
    { label: 'Sat', value: 9500 },
    { label: 'Sun', value: 11000 },
  ],
  title = 'Weekly Inflow',
  totalLabel = '₹59,500 total',
  variant = 'neutral',
  maxHeight = 100,
  className = '',
  ...rest
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 12000);

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-4 shadow-sm hover:shadow-md transition-all ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</span>
          <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{totalLabel}</div>
        </div>
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-bold">
          Last 7 Days
        </span>
      </div>

      {/* Clean, fully rounded bars */}
      <div className="grid grid-cols-7 gap-2 items-end pt-3 px-1" style={{ height: `${maxHeight}px` }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxVal) * 100);
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div 
                className={`w-full rounded-lg transition-all ${
                  item.highlight 
                    ? 'bg-sky-500 dark:bg-sky-400 shadow-2xs' 
                    : 'bg-slate-200 dark:bg-slate-700/80 hover:bg-slate-300'
                }`}
                style={{ height: `${heightPercent}%` }}
                title={`${item.label}: ₹${item.value}`}
              />
              <span className={`text-[10px] font-mono ${item.highlight ? 'font-extrabold text-slate-900 dark:text-white' : 'text-slate-400'}`}>
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
  availableCash = '₹48,500.00',
  taxVaultAmount = '₹11,200.00',
  variant = 'sky',
  size = 112,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const circumference = 2 * Math.PI * 40;
  const safeOffset = circumference - (safePercent / 100) * circumference;

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] shadow-sm hover:shadow-md transition-all space-y-3 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Safe to Spend</span>
        <span className={`text-xs font-bold font-mono ${v.text}`}>+12% this week</span>
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
            <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">{safePercent}%</span>
            <span className="text-[9px] text-slate-400 font-medium">Free</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Ready in Account</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{availableCash}</div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Tax Saved
            </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{taxVaultAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SegmentedLiquiditySlider = ({
  safeCash = '₹37,300.00',
  safePercent = 65,
  taxPercent = 23,
  expensePercent = 12,
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] shadow-sm hover:shadow-md transition-all space-y-3.5 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Safe to Spend</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{safeCash}</div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Safe Cash</span>
          <div className={`text-xs font-mono font-bold ${v.text} mt-0.5`}>{safePercent}% Available</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden p-0.5 gap-0.5 border border-slate-200/60 dark:border-slate-700">
          <div className={`h-full ${v.bg} rounded-l-full transition-all`} style={{ width: `${safePercent}%` }}></div>
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${taxPercent}%` }}></div>
          <div className="h-full bg-rose-500 rounded-r-full transition-all" style={{ width: `${expensePercent}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
          <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${v.bg}`}></span> {safePercent}% Safe</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> {taxPercent}% Tax</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> {expensePercent}% Spent</span>
        </div>
      </div>
    </div>
  );
};

export const PastelWaveCard = ({
  title = 'Total Earned',
  amount = '₹52,000.00',
  trend = '+12%',
  variant = 'sky',
  isNegative = false,
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full ${v.bgSubtle} p-5 rounded-3xl border ${v.border} shadow-sm hover:shadow-md transition-all space-y-2.5 ${className}`} {...rest}>
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isNegative ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>{trend}</span>
      </div>
      <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{amount}</div>
      <div className="pt-1">
        <svg className={`w-full h-8 ${v.text}`} viewBox="0 0 100 30" fill="none">
          <path 
            d={isNegative ? "M0 14 C35 30, 70 6, 100 22" : "M0 24 C30 6, 65 28, 100 10"} 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    </div>
  );
};

export const MultiPlatformDonutGauge = ({
  shares = [
    { name: 'Uber Driver', amount: '₹33,500.00', percent: 52, variant: 'sky' },
    { name: 'Zomato / Delivery', amount: '₹18,900.00', percent: 29, variant: 'coral' },
    { name: 'Direct Freelance', amount: '₹11,800.00', percent: 19, variant: 'olive' },
  ],
  title = 'Platform Earnings Split',
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-3.5 shadow-sm hover:shadow-md transition-all ${className}`} {...rest}>
      <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
        <span>{title}</span>
        <span className="text-[10px] font-mono text-slate-400">100% Tracked</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shares.map((share, idx) => {
          const v = VARIANT_MAP[share.variant] || VARIANT_MAP.default;
          return (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 space-y-1">
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
  activeQuarter = 'Advance Tax Q3',
  dueDate = '15 September',
  reserveReady = '₹11,200.00',
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-3.5 shadow-sm hover:shadow-md transition-all ${className}`} {...rest}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Due Dates</div>
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 opacity-60">
          <span className="text-slate-500">Q1 Advance Tax (15 June)</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
            <span>Paid</span>
            <Check className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className={`flex items-center justify-between p-3.5 ${v.bgSubtle} rounded-2xl border ${v.border}`}>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{activeQuarter} ({dueDate})</div>
            <div className={`text-[11px] font-mono ${v.text} mt-0.5`}>Saved in Account: {reserveReady}</div>
          </div>
          <span className={`px-2.5 py-1 rounded-xl ${v.bg} text-slate-950 text-[10px] font-bold uppercase`}>Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export const TaxWaterfallFlow = ({
  grossInflow = '+₹64,200.00',
  deductions = '-₹15,700.00',
  netScheduleC = '₹48,500.00',
  secaTax = '₹6,860.00',
  incomeTax = '₹4,340.00',
  totalReserve = '₹11,200.00',
  variant = 'coral',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-3 text-xs shadow-sm hover:shadow-md transition-all ${className}`} {...rest}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Calculation Breakdown</div>
      <div className="flex justify-between items-center text-slate-500">
        <span>Total Earnings</span>
        <span className="font-mono text-emerald-600 font-bold">{grossInflow}</span>
      </div>
      <div className="flex justify-between items-center text-slate-500">
        <span>Fuel & Mileage Expenses (Tax-Free)</span>
        <span className="font-mono text-rose-500 font-bold">{deductions}</span>
      </div>
      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5"></div>
      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
        <span>Taxable Net Profit</span>
        <span className="font-mono text-sky-500">{netScheduleC}</span>
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>Estimated Advance Tax (~17%)</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{totalReserve}</span>
      </div>
      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5"></div>
      <div className="flex justify-between items-center font-extrabold text-sm text-slate-900 dark:text-white">
        <span>Recommended Tax Savings</span>
        <span className={`font-mono ${v.text}`}>{totalReserve}</span>
      </div>
    </div>
  );
};
