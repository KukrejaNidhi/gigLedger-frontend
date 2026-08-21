import React, { useEffect, useRef } from 'react';
import { CalendarClock, X } from 'lucide-react';

const daysUntil = (dueDate) => Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

/**
 * Dropdown notification panel — driven entirely by deadlines the app-level
 * state already fetched (GET /api/deadlines is cheap/read-only, so App.jsx
 * fetches it once on login and again whenever a deadline changes; this
 * component makes no calls of its own).
 */
export const NotificationsPanel = ({ deadlines = [], onClose, onViewAll, currency = '₹' }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-4 sm:right-5 top-16 z-40 w-[calc(100%-2rem)] max-w-xs bg-white dark:bg-[#161B22] rounded-3xl border border-slate-200/80 dark:border-[#30363D] shadow-2xl p-4 space-y-3 animate-fadeIn"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-[11px] text-slate-400 py-2">You're all caught up — no deadlines need attention right now.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {deadlines.map((d) => {
            const days = daysUntil(d.dueDate);
            const isOverdue = d.status === 'overdue';
            return (
              <div
                key={d._id}
                className={`flex items-start gap-2.5 p-2.5 rounded-2xl ${
                  isOverdue ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-amber-50 dark:bg-amber-950/30'
                }`}
              >
                <CalendarClock className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isOverdue ? 'text-rose-500' : 'text-amber-500'}`} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isOverdue ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue` : days === 0 ? 'Due today' : `Due in ${days} day${days === 1 ? '' : 's'}`}
                    {d.estimatedAmount != null && <span> · Est. {currency}{Number(d.estimatedAmount).toLocaleString('en-IN')}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onViewAll}
        className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
      >
        View All Deadlines
      </button>
    </div>
  );
};
