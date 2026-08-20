import React, { useState } from 'react';
import { X, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

/**
 * Quick Add Transaction Modal (Triggered by the Floating '+' FAB)
 */
export const QuickAddModal = ({
  isOpen,
  onClose,
  onAddTransaction,
  currency = '₹',
}) => {
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [method, setMethod] = useState('Cash');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      title: title.trim() || (type === 'income' ? 'Income' : 'Expense'),
      icon: category,
      category,
      method,
      amount: numAmount,
      isIncome: type === 'income',
      date: 'Today',
    };

    if (onAddTransaction) {
      onAddTransaction(newTx);
    }

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      
      {/* MODAL CARD */}
      <div className="w-full max-w-md bg-white dark:bg-[#161B22] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-[#30363D] p-6 shadow-2xl space-y-5 animate-slideUp">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Log Transaction
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                ? 'bg-white dark:bg-[#161B22] text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Spending</span>
          </button>

          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              type === 'income'
                ? 'bg-white dark:bg-[#161B22] text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* AMOUNT INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Amount ({currency})
            </label>
            <div className="flex items-center px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-xl font-bold font-mono text-slate-400 mr-2">{currency}</span>
              <input
                type="number"
                step="0.1"
                required
                autoFocus
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-2xl font-bold font-mono bg-transparent text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* TITLE INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? 'e.g. Uber Payout, Salary' : 'e.g. Food and Dining, Fuel'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* CATEGORY & METHOD */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="food">Food & Dining</option>
                <option value="salary">Salary / Earnings</option>
                <option value="fuel">Fuel & Transit</option>
                <option value="ride">Ride & Trips</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="UPI">UPI / Digital</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm sm:text-base shadow-md shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>

        </form>

      </div>

    </div>
  );
};
