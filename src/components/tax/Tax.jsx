import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const TaxLiabilityCard = ({
  liabilityAmount = '$1,120.00',
  quarterLabel = 'Q3 Estimated Tax Target',
  fundedPercentage = 100,
  variant = 'coral',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm ${className}`} {...rest}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{quarterLabel}</span>
      <div className={`text-3xl font-extrabold font-mono ${v.text}`}>{liabilityAmount}</div>
      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{fundedPercentage}% Protected in Tax Vault</div>
    </div>
  );
};

export const RAGAuthorityDrawer = ({
  title = 'Retrieved Authority: IRS Publication 463',
  excerpt = '"Standard Mileage Rate for 2024 is 67 cents per business mile. Fuel & maintenance are fully deductible under IRC § 162(a)."',
  sourceUrl = 'irs.gov/pub463',
  variant = 'steel',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full ${v.bgSubtle} border ${v.border} p-4 rounded-3xl space-y-2 text-xs ${className}`} {...rest}>
      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <span>{title}</span>
      </div>
      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
        {excerpt}
      </p>
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-0.5">
        <span>Source: {sourceUrl}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Grounded</span>
      </div>
    </div>
  );
};

export const DeductionCategoryChip = ({
  scheduleLine = 'Line 9',
  categoryName = 'Vehicle & Fuel',
  variant = 'olive',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${v.bgSubtle} border ${v.border} ${v.text} text-[10px] font-mono font-bold ${className}`} {...rest}>
      <span>Schedule C {scheduleLine}:</span>
      <span>{categoryName}</span>
    </span>
  );
};

export const AuditTrailStamp = ({
  ruleId = 'IRS-IRC-162A',
  verifiedAt = '2026-08-20',
  statusText = 'Verified Ground Truth',
  className = '',
  ...rest
}) => {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-700 ${className}`} {...rest}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      <span>{ruleId}</span>
      <span>·</span>
      <span>{verifiedAt}</span>
      <span>·</span>
      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{statusText}</span>
    </div>
  );
};
