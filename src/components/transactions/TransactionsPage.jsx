import React, { useEffect, useState } from 'react';
import { ChevronLeft, Plus, Pencil, Trash2, Loader2, Camera } from 'lucide-react';
import { transactionsApi } from '../../services/transactionsApi.js';
import { categoriesApi } from '../../services/categoriesApi.js';
import { QuickAddModal } from '../home/QuickAddModal.jsx';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' },
];

const PAGE_LIMIT = 20;

/**
 * Full CRUD transactions list — GET (paginated + filtered), PUT (edit, via
 * the same QuickAddModal used for create), DELETE. Create reuses the exact
 * same scan-or-manual flow as the home page's '+' FAB, via `onOpenAdd`
 * (passed down from App.jsx, which owns the shared AddTransactionFlow / OCR
 * modal) — this page doesn't duplicate that flow, it triggers the same one.
 */
export const TransactionsPage = ({
  onBack,
  onOpenAdd,
  currency = '₹',
  refreshTick = 0,
  onShowToast,
  className = '',
}) => {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error' | 'loading-more'
  const [categoriesById, setCategoriesById] = useState({});

  const [editingTx, setEditingTx] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowBusyId, setRowBusyId] = useState(null);

  const fetchPage = async (pageNum, replace) => {
    setStatus(pageNum === 1 ? 'loading' : 'loading-more');
    try {
      const type = filter === 'all' ? undefined : filter;
      const result = await transactionsApi.list({ type, page: pageNum, limit: PAGE_LIMIT });
      const { items: newItems = [], totalPages: tp = 1 } = result?.data || {};
      setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
      setTotalPages(tp);
      setPage(pageNum);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, refreshTick]);

  useEffect(() => {
    Promise.all([categoriesApi.list({ type: 'income' }), categoriesApi.list({ type: 'expense' })])
      .then(([income, expense]) => {
        const all = [...(income?.data || []), ...(expense?.data || [])];
        setCategoriesById(Object.fromEntries(all.map((c) => [c._id, c])));
      })
      .catch((err) => console.warn('Failed to load categories:', err.message));
  }, []);

  const handleDelete = async (id) => {
    setRowBusyId(id);
    try {
      await transactionsApi.remove(id);
      setItems((prev) => prev.filter((t) => t._id !== id));
      setDeletingId(null);
      onShowToast && onShowToast('Transaction Deleted', 'Removed from your ledger.', 'info');
    } catch (err) {
      onShowToast && onShowToast('Delete Failed', err.message || 'Could not delete this transaction.', 'error');
    } finally {
      setRowBusyId(null);
    }
  };

  const handleEditSaved = (updated) => {
    setItems((prev) => prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)));
    setEditingTx(null);
    onShowToast && onShowToast('Transaction Updated', 'Your changes were saved.', 'success');
  };

  const formatAmount = (tx) => `${tx.type === 'income' ? '+' : '-'}${currency}${Number(tx.amount).toFixed(2)}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

  return (
    <div className={`w-full space-y-4 animate-fadeIn ${className}`}>

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex-shrink-0"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">All Transactions</h1>
        </div>

        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-extrabold shadow-sm shadow-sky-500/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
          <Camera className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#0D1117] w-full">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              filter === f.id
                ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      {status === 'loading' ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : status === 'error' ? (
        <div className="text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-4 py-3">
          Couldn't load transactions. Pull to refresh or try again shortly.
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          No {filter === 'all' ? '' : filter} transactions yet. Tap "Add" to log one.
        </div>
      ) : (
        <div className="w-full rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-2.5 sm:p-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
          {items.map((tx) => (
            <div key={tx._id} className="py-2.5 first:pt-0 last:pb-0">
              {deletingId === tx._id ? (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Delete this transaction?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tx._id)}
                      disabled={rowBusyId === tx._id}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold disabled:opacity-60"
                    >
                      {rowBusyId === tx._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {tx.rawDescription || (tx.type === 'income' ? 'Income' : 'Expense')}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      <span>·</span>
                      <span className="capitalize">
                        {tx.category ? categoriesById[tx.category]?.name || 'Categorized' : 'Uncategorized'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 dark:text-white mr-1">
                      {formatAmount(tx)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingTx(tx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(tx._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {status === 'ready' && page < totalPages && (
        <button
          type="button"
          onClick={() => fetchPage(page + 1, false)}
          className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Load More
        </button>
      )}
      {status === 'loading-more' && (
        <div className="flex items-center justify-center py-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {/* EDIT MODAL — same form as create, PUT instead of POST */}
      <QuickAddModal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        onAddTransaction={handleEditSaved}
        currency={currency}
        editTransactionId={editingTx?._id || null}
        initialValues={
          editingTx
            ? {
                type: editingTx.type,
                amount: editingTx.amount,
                date: editingTx.date ? new Date(editingTx.date).toISOString().slice(0, 10) : undefined,
                rawDescription: editingTx.rawDescription,
                source: editingTx.source,
              }
            : null
        }
        title="Edit Transaction"
        confirmLabel="Save Changes"
      />
    </div>
  );
};
