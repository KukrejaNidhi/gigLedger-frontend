import React, { useRef, useState } from 'react';
import { X, Camera, PenLine, Loader2 } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal.jsx';
import { receiptsApi } from '../../services/receiptsApi.js';

/**
 * Entry point for the '+' FAB. Lets the user choose to scan a receipt (OCR via
 * POST /api/receipts/upload) or enter a transaction manually — both paths end
 * at the same QuickAddModal review/approve step before POST /api/transactions.
 */
export const AddTransactionFlow = ({ isOpen, onClose, onAddTransaction, currency = '₹' }) => {
  const [step, setStep] = useState('choice'); // 'choice' | 'scanning' | 'form'
  const [scanError, setScanError] = useState(null);
  const [ocrValues, setOcrValues] = useState(null);
  const fileInputRef = useRef(null);

  const reset = () => {
    setStep('choice');
    setScanError(null);
    setOcrValues(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const openManual = () => {
    setOcrValues(null);
    setStep('form');
  };

  const openCamera = () => {
    setScanError(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setStep('scanning');
    setScanError(null);
    try {
      const result = await receiptsApi.upload(file);
      const extracted = result?.data || {};
      setOcrValues({
        type: extracted.type || 'expense',
        amount: extracted.amount,
        date: extracted.date,
        rawDescription: extracted.rawDescription || extracted.description || extracted.merchant,
        source: extracted.source,
      });
      setStep('form');
    } catch (err) {
      setScanError(err.message || "Couldn't read that receipt clearly.");
      setStep('choice');
    }
  };

  if (!isOpen) return null;

  if (step === 'form') {
    return (
      <QuickAddModal
        isOpen
        onClose={handleClose}
        onAddTransaction={(tx) => {
          onAddTransaction?.(tx);
          reset();
        }}
        currency={currency}
        initialValues={ocrValues}
        title={ocrValues ? 'Confirm Scanned Transaction' : 'Log Transaction'}
        confirmLabel={ocrValues ? 'Approve & Add to Ledger' : 'Save to Ledger'}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#161B22] rounded-t-[32px] sm:rounded-[32px] border border-slate-200/80 dark:border-[#30363D] p-6 shadow-2xl space-y-5 animate-slideUp">

        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Add Transaction
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'scanning' ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Scanning receipt…
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {scanError && (
              <div className="text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-xl px-3 py-2">
                {scanError} Try again or enter it manually below.
              </div>
            )}

            <button
              type="button"
              onClick={openCamera}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25 transition active:scale-98"
            >
              <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </span>
              <span className="text-left">
                <span className="block text-xs sm:text-sm font-extrabold">Scan Receipt</span>
                <span className="block text-[11px] font-medium text-white/80">Auto-fill details with OCR</span>
              </span>
            </button>

            <button
              type="button"
              onClick={openManual}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-[#0D1117] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition active:scale-98"
            >
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                <PenLine className="w-5 h-5 text-slate-500" />
              </span>
              <span className="text-left">
                <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Enter Manually</span>
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Fill in the details yourself</span>
              </span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>
    </div>
  );
};
