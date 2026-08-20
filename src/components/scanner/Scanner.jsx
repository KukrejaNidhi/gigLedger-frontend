import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const CameraViewfinderOverlay = ({
  merchantPreview = 'Shell Oil #2041',
  confidenceScore = 99.4,
  onCapture,
  variant = 'sky',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`relative w-full h-48 bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center border-2 ${v.border} shadow-inner ${className}`} {...rest}>
      <div className="absolute inset-4 border border-dashed border-white/40 rounded-2xl flex flex-col items-center justify-center text-center p-3">
        <svg className="w-8 h-8 text-white/70 mb-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span className="text-xs font-bold text-white">{merchantPreview}</span>
        <span className="text-[10px] font-mono text-emerald-400 mt-0.5">{confidenceScore}% Extraction Confidence</span>
      </div>
      {onCapture && (
        <button 
          onClick={onCapture} 
          className="absolute bottom-2 w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-lg active:scale-95"
          aria-label="Capture Document"
        >
          <span className="w-6 h-6 rounded-full border-2 border-slate-900"></span>
        </button>
      )}
    </div>
  );
};

export const ExtractedEntityCard = ({
  merchant = 'Shell Oil Station #2041',
  date = 'January 14, 2024',
  totalAmount = '$42.50',
  taxSchedule = 'Line 9 (Vehicle & Fuel)',
  onConfirm,
  variant = 'yellow',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-sm ${className}`} {...rest}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracted Entities</div>
      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-slate-400">Merchant</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{merchant}</span>
      </div>
      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-slate-400">Date</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{date}</span>
      </div>
      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-slate-400">Total Amount</span>
        <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{totalAmount}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="text-slate-400">Tax Category</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{taxSchedule}</span>
      </div>

      {onConfirm && (
        <button 
          onClick={onConfirm} 
          className={`w-full py-3 ${v.bg} text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 mt-2`}
        >
          + Add to Ledger & Save $11.50 Tax
        </button>
      )}
    </div>
  );
};

export const DeductionQuickAdder = ({
  onSelectCategory,
  className = '',
  ...rest
}) => {
  const categories = [
    { id: 'fuel', label: 'Fuel / Mileage', icon: '⛽', sched: 'Line 9' },
    { id: 'gear', label: 'Equipment & Gear', icon: '📦', sched: 'Line 22' },
    { id: 'phone', label: 'Phone & Internet', icon: '📱', sched: 'Line 27a' },
    { id: 'meals', label: 'Work Meals (50%)', icon: '🥪', sched: 'Line 24b' },
  ];

  return (
    <div className={`w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2.5 ${className}`} {...rest}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Deduction Classify</div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-left border border-slate-200/60 dark:border-slate-700 space-y-0.5 transition"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.label}</div>
            <div className="text-[9px] text-slate-400 font-mono">{cat.sched}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
