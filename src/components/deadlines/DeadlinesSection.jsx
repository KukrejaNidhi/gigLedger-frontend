import React, { useEffect, useRef, useState } from 'react';
import { CalendarClock, Check, Loader2, RefreshCw } from 'lucide-react';
import { deadlinesApi } from '../../services/deadlinesApi.js';

const daysUntil = (dueDate) => {
  const ms = new Date(dueDate).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Server computes status ('upcoming'|'due_soon'|'overdue'|'completed') on
// every sync using its own 15-day window — never recompute it from dueDate
// here, only use it to pick a display treatment.
const STATUS_STYLES = {
  overdue: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50',
  due_soon: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
  upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40',
  completed: 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60',
};

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

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const fetchDeadlines = async () => {
    try {
      const result = await deadlinesApi.list();
      if (!mountedRef.current) return;
      setItems(Array.isArray(result?.data) ? result.data : []);
      setStatus('ready');
    } catch (err) {
      if (mountedRef.current) setStatus('error');
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const handleCheckNow = async () => {
    setIsRunning(true);
    try {
      const result = await deadlinesApi.run();
      const notifiedCount = result?.data?.notifiedCount || 0;
      await fetchDeadlines();
      if (!mountedRef.current) return;
      onShowToast && onShowToast(
        'Deadlines Refreshed',
        notifiedCount > 0
          ? `${notifiedCount} new reminder${notifiedCount === 1 ? '' : 's'} sent to your Categorization Agent inbox.`
          : 'Your statutory deadline list is up to date.',
        'success'
      );
      onDeadlinesChanged && onDeadlinesChanged();
    } catch (err) {
      if (mountedRef.current) onShowToast && onShowToast('Refresh Failed', err.message || 'Could not refresh deadlines.', 'error');
    } finally {
      if (mountedRef.current) setIsRunning(false);
    }
  };

  const handleComplete = async (id) => {
    setCompletingId(id);
    try {
      await deadlinesApi.complete(id);
      if (!mountedRef.current) return;
      setItems((prev) => prev.map((d) => (d._id === id ? { ...d, status: 'completed' } : d)));
      onDeadlinesChanged && onDeadlinesChanged();
    } catch (err) {
      if (mountedRef.current) onShowToast && onShowToast('Action Failed', err.message || 'Could not mark this deadline complete.', 'error');
    } finally {
      if (mountedRef.current) setCompletingId(null);
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
              const dayLabel = d.status === 'overdue' ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`;
              return (
                <div
                  key={d._id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${STATUS_STYLES[d.status] || STATUS_STYLES.upcoming}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CalendarClock className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(d.dueDate)}
                        {d.status !== 'completed' && <span> · {dayLabel}</span>}
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
