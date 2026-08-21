import React, { useEffect, useState } from 'react';
import { X, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { transactionsApi } from '../../services/transactionsApi.js';

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Quick Add Transaction Modal (Triggered by the '+' FAB, manual entry or as the
 * review/approve step after an OCR scan). Also doubles as the edit form when
 * `editTransactionId` is passed — same fields, PUT instead of POST.
 *
 * Fields match POST /api/transactions (docs/endpoints.json):
 *   { type: 'income'|'expense', amount, date, rawDescription?, source?, category? }
 * There's no payment-method field on that endpoint, so this form doesn't
 * collect one. `category` isn't user-editable here (no picker) — it's only
 * ever carried through transparently: from an OCR suggestion
 * (`initialValues.category = { id, name }`) or preserved as-is when editing
 * an existing transaction (`initialValues.category` = an id string). Picking
 * a different category is the categorization agent's job (Tax Center ->
 * Agent Inbox), not this form's.
 *
 * Categorization is intentionally NOT triggered here — it's an LLM call, and
 * per the app's timing contract every LLM-backed call (agent run, tax
 * estimate) must be explicit and user-initiated, never fired automatically
 * on a save. See the "Categorize my transactions" action in the Tax Center
 * tab's Agent Inbox.
 */
export const QuickAddModal = ({
  isOpen,
  onClose,
  onAddTransaction,
  currency = '₹',
  initialValues = null, // { type, amount, date, rawDescription, source, category } from OCR or an existing transaction
  editTransactionId = null, // when set, submits PUT instead of POST
  title: heading = 'Log Transaction',
  confirmLabel = 'Save to Ledger',
}) => {
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayIso());
  const [rawDescription, setRawDescription] = useState('');
  const [source, setSource] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [suggestedCategoryName, setSuggestedCategoryName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setType(initialValues?.type || 'expense');
    setAmount(initialValues?.amount != null ? String(initialValues.amount) : '');
    setDate(initialValues?.date || todayIso());
    setRawDescription(initialValues?.rawDescription || '');
    setSource(initialValues?.source || '');
    // OCR gives { id, name }; an existing transaction gives a plain id string.
    const category = initialValues?.category;
    if (category && typeof category === 'object') {
      setCategoryId(category.id);
      setSuggestedCategoryName(category.name);
    } else {
      setCategoryId(category || null);
      setSuggestedCategoryName(null);
    }
    setError(null);
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const payload = {
      type,
      amount: numAmount,
      date,
      rawDescription: rawDescription.trim() || undefined,
      source: source.trim() || undefined,
      category: categoryId || undefined,
    };

    setIsSubmitting(true);
    setError(null);
    try {
      let saved;
      if (editTransactionId) {
        const result = await transactionsApi.update(editTransactionId, payload);
        saved = result?.data || { _id: editTransactionId, ...payload };
      } else {
        const result = await transactionsApi.create(payload);
        saved = result?.data || payload;
      }

      if (onAddTransaction) onAddTransaction(saved);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save this transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">

      {/* MODAL CARD */}
      <div className="w-full max-w-md bg-white dark:bg-[#161B22] rounded-t-[32px] sm:rounded-[32px] border border-slate-200/80 dark:border-[#30363D] p-6 shadow-2xl space-y-5 animate-slideUp">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {heading}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TYPE SWITCHER */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#0D1117]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              type === 'expense'
                ? 'bg-white dark:bg-[#161B22] text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>- Spending</span>
          </button>

          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              type === 'income'
                ? 'bg-white dark:bg-[#161B22] text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Income</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* AMOUNT INPUT */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Amount ({currency})
            </label>
            <div className="flex items-center px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-xl font-bold font-mono mr-2 text-slate-900 dark:text-white">
                {type === 'income' ? '+' : '-'}{currency}
              </span>
              <input
                type="number"
                step="1"
                required
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-2xl font-bold font-mono bg-transparent text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* DATE INPUT */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* DESCRIPTION INPUT */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? 'e.g. Uber Payout, Client Retainer' : 'e.g. Zomato Dinner, Shell Petrol'}
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* SOURCE (income only) */}
          {type === 'income' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Source (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. uber, salary, freelance"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none"
              />
            </div>
          )}

          {suggestedCategoryName && (
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 rounded-xl px-3 py-2">
              Suggested category: {suggestedCategoryName}
            </div>
          )}

          {error && (
            <div className="text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving…' : confirmLabel}</span>
          </button>

        </form>

      </div>

    </div>
  );
};
