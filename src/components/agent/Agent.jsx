import React from 'react';
import { VARIANT_MAP } from '../../theme/tokens.js';

export const AgentStatusPill = ({
  taskCount = 1,
  summaryText = 'Shell Gas $42.50 · Matched active Uber shift',
  badgeLabel = 'DIFF',
  onReviewClick,
  variant = 'coral',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div 
      onClick={onReviewClick} 
      className={`w-full cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-3.5 rounded-2xl border ${v.border} shadow-sm flex items-center justify-between transition group ${className}`}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl ${v.bgSubtle} ${v.text} flex items-center justify-center text-xs font-bold border ${v.border}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <span>Agent Action Pending</span>
            <span className={`px-1.5 py-0.2 ${v.bg} text-white text-[9px] font-bold rounded`}>{badgeLabel}</span>
          </div>
          <div className="text-[10px] text-slate-400">{summaryText}</div>
        </div>
      </div>
      <span className={`text-xs font-bold ${v.text} group-hover:translate-x-0.5 transition`}>Review →</span>
    </div>
  );
};

export const AgentSubtaskRail = ({
  tasks = [
    {
      id: '1',
      title: 'Classify $42.50 Shell Fuel as Schedule C Deduction',
      description: 'Matched Uber GPS shift (142 mi). IRC § 162(a) eligible.',
      timestamp: '12m ago',
      status: 'pending',
      badge: 'ACTION REQUIRED',
      savingText: 'Tax saving: +$11.50',
    },
    {
      id: '2',
      title: 'DoorDash 14-Batch Direct Deposit Reconciliation',
      description: 'Matched bank statement #4491 with customer delivery payouts.',
      timestamp: '2h ago',
      status: 'verified',
      badge: 'VERIFIED & LOGGED',
    },
    {
      id: '3',
      title: 'Retrieved 2024 IRS Pub 463 Standard Mileage Rate',
      description: 'Verified statutory 67¢/mile rate for independent contractors.',
      timestamp: 'Yesterday',
      status: 'rag',
      badge: 'RAG RETRIEVAL',
    }
  ],
  className = '',
  ...rest
}) => {
  return (
    <div className={`space-y-2.5 w-full ${className}`} {...rest}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Agent Subtask Audit Rail</div>
      {tasks.map(t => {
        const badgeColor = t.status === 'pending' 
          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          : t.status === 'verified'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800';

        return (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px]">
              <span className={`px-2 py-0.5 rounded-md font-bold border ${badgeColor}`}>{t.badge}</span>
              <span className="font-mono text-slate-400">{t.timestamp}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.description}</p>
            {t.savingText && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.savingText}</span>
                {t.onAction && (
                  <button onClick={t.onAction} className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded-lg">
                    Review →
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const DiffInspectorModal = ({
  isOpen,
  onClose,
  onApprove,
  title = 'Approve Fuel Tax Deduction',
  evidenceText = 'Found $42.50 Shell Fuel receipt logged during active 142mi Uber driving shift. Qualifies under Schedule C Line 9.',
  beforeNet = '$4,850.00',
  afterNet = '$4,807.50',
  beforeTax = '$1,120.00',
  afterTax = '$1,108.50',
  taxSaved = '+$11.50',
  variant = 'yellow',
}) => {
  if (!isOpen) return null;
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 pb-8 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md mx-auto w-full">
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>

        <div className="flex justify-between items-center">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[9px] font-bold uppercase tracking-wider">
              Human-in-the-Loop Signoff
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">✕</button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Agent Evidence & Match</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{evidenceText}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Before vs. After Impact</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[9px] text-slate-400">Taxable Net</div>
              <div className="font-mono text-slate-800 dark:text-slate-200 font-bold text-[11px]">{beforeNet} → <span className="text-sky-500">{afterNet}</span></div>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[9px] text-slate-400">Tax Reserve</div>
              <div className="font-mono text-slate-800 dark:text-slate-200 font-bold text-[11px]">{beforeTax} → <span className="text-emerald-500">{afterTax}</span></div>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[9px] text-slate-400">Tax Saved</div>
              <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{taxSaved}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button onClick={onClose} className="py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition">
            Dismiss
          </button>
          <button onClick={onApprove} className={`py-3 ${v.bg} text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95`}>
            ✓ Approve & Save {taxSaved}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfidenceScoreBadge = ({
  score = 99.4,
  variant = 'emerald',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${v.bgSubtle} border ${v.border} ${v.text} text-[10px] font-mono font-bold ${className}`} {...rest}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>{score}% Confidence</span>
    </span>
  );
};

export const OneTapSignoffButton = ({
  label = '✓ 1-Tap Signoff & Recalculate',
  variant = 'yellow',
  className = '',
  ...rest
}) => {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <button 
      className={`w-full py-3.5 ${v.bg} text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 ${className}`} 
      {...rest}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <span>{label}</span>
    </button>
  );
};
