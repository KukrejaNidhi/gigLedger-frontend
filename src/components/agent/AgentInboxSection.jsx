import React, { useEffect, useState } from 'react';
import { Sparkles, Check, X, Loader2, CalendarClock } from 'lucide-react';
import { agentApi } from '../../services/agentApi.js';
import { categoriesApi } from '../../services/categoriesApi.js';

/**
 * Agent inbox — shared by two proposal types (per docs/agent-memory):
 * - `categorize`: proposedChange = { categoryId, confidence }
 * - `deadline_check`: proposedChange = { deadlineId, action } — a deadline
 *   reminder surfaced by the Tax Center's "Check for reminders now" action,
 *   not this component. Both share the same approve/reject actions.
 *
 * Per the app's timing contract:
 * - GET /api/agent/tasks?status=proposed fires on mount (cheap, read-only).
 * - POST /api/agent/run ONLY fires from the explicit "Categorize my
 *   transactions" tap below — never automatically, it's a real LLM call.
 * - GET tasks fires again right after /run completes, to refresh the list.
 * - approve/reject fire only on the user tapping that specific suggestion.
 */
export const AgentInboxSection = ({ onShowToast, className = '' }) => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [categoriesById, setCategoriesById] = useState({});

  const fetchTasks = async () => {
    try {
      const result = await agentApi.listTasks({ status: 'proposed' });
      setTasks(result?.data?.items || []);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchTasks();
    Promise.all([categoriesApi.list({ type: 'income' }), categoriesApi.list({ type: 'expense' })])
      .then(([income, expense]) => {
        const all = [...(income?.data || []), ...(expense?.data || [])];
        setCategoriesById(Object.fromEntries(all.map((c) => [c._id, c])));
      })
      .catch((err) => console.warn('Failed to load categories:', err.message));
  }, []);

  const handleRunAgent = async () => {
    setIsRunning(true);
    try {
      const result = await agentApi.run();
      const count = result?.data?.count || 0;
      onShowToast && onShowToast(
        'Categorization Complete',
        count > 0 ? `${count} new suggestion${count === 1 ? '' : 's'} ready for review.` : 'Nothing new to categorize right now.',
        'success'
      );
      await fetchTasks();
    } catch (err) {
      onShowToast && onShowToast('Categorization Failed', err.message || 'Could not run the categorization agent.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResolve = async (task, action) => {
    setResolvingId(task._id);
    try {
      if (action === 'approve') await agentApi.approveTask(task._id);
      else await agentApi.rejectTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      onShowToast && onShowToast('Action Failed', err.message || 'Could not resolve this suggestion.', 'error');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-4 shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Categorization Agent</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {status === 'ready' ? `${tasks.length} suggestion${tasks.length === 1 ? '' : 's'} pending review` : 'Loading inbox…'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleRunAgent}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm shadow-sky-500/25 transition active:scale-95 flex-shrink-0"
        >
          {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Categorizing…' : 'Categorize My Transactions'}</span>
        </button>
      </div>

      {status === 'error' ? (
        <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-3 py-2.5">
          Couldn't load the inbox. Try again shortly.
        </div>
      ) : status === 'loading' ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-[11px] text-slate-400 text-center py-4">
          No suggestions right now. Tap "Categorize My Transactions" to check for new ones.
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const isDeadline = task.type === 'deadline_check';
            const category = categoriesById[task.proposedChange?.categoryId];
            const confidence = task.proposedChange?.confidence;
            return (
              <div key={task._id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isDeadline && <CalendarClock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                    {isDeadline ? 'Deadline Reminder' : category?.name || 'Unknown category'}
                  </span>
                  {!isDeadline && typeof confidence === 'number' && (
                    <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white">
                      {Math.round(confidence * 100)}% confident
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.reasoning}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleResolve(task, 'approve')}
                    disabled={resolvingId === task._id}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isDeadline ? 'Acknowledge' : 'Approve'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(task, 'reject')}
                    disabled={resolvingId === task._id}
                    className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-60 text-slate-600 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isDeadline ? 'Dismiss' : 'Reject'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
