import React from 'react';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
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

  const IconComp = type === 'alert' ? AlertTriangle : type === 'success' ? CheckCircle : Info;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto bg-white dark:bg-[#161B22] text-slate-900 dark:text-white rounded-2xl p-3 border border-slate-200/90 dark:border-[#30363D] shadow-2xl animate-toast flex items-start gap-3">
      <div className={`w-7 h-7 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 font-bold shadow-2xs`}>
        <IconComp className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold">{title}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{message}</div>
      </div>
      <button onClick={onClose} className="w-6 h-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
        <X className="w-3.5 h-3.5" />
      </button>
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
