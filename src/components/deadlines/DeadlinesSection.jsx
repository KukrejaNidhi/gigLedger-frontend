import React, { useEffect, useState } from 'react';
import { CalendarClock, Check, Loader2, RefreshCw } from 'lucide-react';
import { deadlinesApi } from '../../services/deadlinesApi.js';

const daysUntil = (dueDate) => {
  const ms = new Date(dueDate).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Full deadlines list — GET fires on mount (cheap, no LLM, self-syncing per
 * the timing contract). "Check for reminders now" explicitly re-runs the
 * generator (POST /run, also cheap/no LLM, but still only user-triggered
 * since it's a write) — normal usage otherwise doesn't need it, there's no
 * cron in this app so deadlines simply stay as they were from the last run
 * until this button is tapped again.
 */
export const DeadlinesSection = ({ currency = '₹', onShowToast, onDeadlinesChanged, className = '' }) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchDeadlines = async () => {
    try {
      const result = await deadlinesApi.list();
      setItems(result?.data?.items || []);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const handleCheckNow = async () => {
    setIsRunning(true);
    try {
      await deadlinesApi.run();
      await fetchDeadlines();
      onShowToast && onShowToast('Deadlines Refreshed', 'Your statutory deadline list is up to date.', 'success');
      onDeadlinesChanged && onDeadlinesChanged();
    } catch (err) {
      onShowToast && onShowToast('Refresh Failed', err.message || 'Could not refresh deadlines.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleComplete = async (id) => {
    setCompletingId(id);
    try {
      await deadlinesApi.complete(id);
      setItems((prev) => prev.map((d) => (d._id === id ? { ...d, status: 'completed' } : d)));
      onDeadlinesChanged && onDeadlinesChanged();
    } catch (err) {
      onShowToast && onShowToast('Action Failed', err.message || 'Could not mark this deadline complete.', 'error');
    } finally {
      setCompletingId(null);
    }
  };

  const visible = items.filter((d) => (showCompleted ? true : d.status !== 'completed'));

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-4 shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Deadlines</div>
        <button
          type="button"
          onClick={handleCheckNow}
          disabled={isRunning}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 disabled:opacity-60"
        >
          <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
          <span>Check for reminders now</span>
        </button>
      </div>

      {status === 'loading' ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : status === 'error' ? (
        <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-3 py-2.5">
          Couldn't load deadlines. Try again shortly.
        </div>
      ) : visible.length === 0 ? (
        <div className="text-[11px] text-slate-400 text-center py-4">
          No upcoming deadlines. Tap "Check for reminders now" to generate this year's schedule.
        </div>
      ) : (
        <div className="space-y-2">
          {visible
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((d) => {
              const days = daysUntil(d.dueDate);
              const isOverdue = days < 0 && d.status !== 'completed';
              const isSoon = days >= 0 && days <= 14 && d.status !== 'completed';
              return (
                <div
                  key={d._id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${
                    d.status === 'completed'
                      ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
                      : isOverdue
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50'
                      : isSoon
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CalendarClock className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(d.dueDate)}
                        {d.status !== 'completed' && (
                          <span> · {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}</span>
                        )}
                        {d.estimatedAmount != null && (
                          <span> · Est. {currency}{Number(d.estimatedAmount).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {d.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleComplete(d._id)}
                      disabled={completingId === d._id}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition flex-shrink-0"
                      aria-label="Mark paid/complete"
                    >
                      {completingId === d._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {items.some((d) => d.status === 'completed') && (
        <button
          type="button"
          onClick={() => setShowCompleted((v) => !v)}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {showCompleted ? 'Hide completed' : 'Show completed'}
        </button>
      )}
    </div>
  );
};
