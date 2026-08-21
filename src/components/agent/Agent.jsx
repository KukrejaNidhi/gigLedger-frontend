import React from 'react';
import { Fuel, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const AgentStatusPill = ({
  summaryText = 'Petrol Bill ₹350.00 · Matched your driving shift',
  badgeLabel = 'SAVE ₹70.00',
  onReviewClick,
  variant = 'coral',
  className = '',
  ...rest
}) => {
  return (
    <div 
      onClick={onReviewClick} 
      className={`w-full cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-sm hover:shadow-md flex items-center justify-between transition-all ${className}`}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold border border-rose-200 dark:border-rose-800 shadow-2xs">
          <Fuel className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>New Fuel Bill Found</span>
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-md uppercase">
              {badgeLabel}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{summaryText}</div>
        </div>
      </div>
      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
        <span>Save</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  );
};

export const DiffInspectorModal = ({
  isOpen,
  onClose,
  onApprove,
  title = 'Save Tax on Fuel Bill',
  evidenceText = 'We found a ₹350.00 petrol receipt from Bharat Petroleum during your 45km Uber shift. Adding this saves you ₹70.00 on advance taxes.',
  beforeNet = '₹48,500.00',
  afterNet = '₹48,150.00',
  beforeTax = '₹11,200.00',
  afterTax = '₹11,130.00',
  taxSaved = '₹70.00',
  variant = 'yellow',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 pb-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md mx-auto w-full animate-slideUp">
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>

        <div className="flex justify-between items-center">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              Automatic Tax Saving
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1 shadow-2xs">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Bharat Petroleum #2041 · ₹350.00 Bill</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-0.5">{evidenceText}</p>
        </div>

        {/* Clear Tax Impact Table */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Tax Before</div>
            <div className="font-mono text-slate-800 dark:text-slate-200 font-bold text-sm mt-0.5">{beforeTax}</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Tax After (Saved)</div>
            <div className="font-mono text-slate-900 dark:text-white font-extrabold text-sm mt-0.5">{afterTax} <span className="text-[11px]">(-{taxSaved})</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button onClick={onClose} className="py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition">
            Not Work Related
          </button>
          <button onClick={onApprove} className="py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save {taxSaved} Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
