import React, { useState } from 'react';
import { RefreshCw, Loader2, AlertTriangle, Download } from 'lucide-react';
import { taxApi, currentTaxPeriod, recentTaxPeriods } from '../../services/taxApi.js';

const periodLabel = (period) => {
  const [q, fy] = period.split('-');
  return `${q} FY${fy}`;
};

/**
 * On-demand tax estimate. Per the timing contract, GET /api/tax/estimate is
 * the one slow, LLM-backed call in the app — it fires ONLY on:
 *   - first opening this section (default period),
 *   - switching to a period not yet cached this session,
 *   - explicitly tapping "Refresh estimate" (passes refresh=true).
 * Never on transaction add/edit — nothing here auto-invalidates the cache.
 * Each period's result is cached in this component's state for the session.
 */
export const TaxEstimateSection = ({ currency = '₹', onShowToast, className = '' }) => {
  const periods = recentTaxPeriods();
  const [period, setPeriod] = useState(currentTaxPeriod());
  const [cache, setCache] = useState({}); // period -> estimate data
  const [status, setStatus] = useState({}); // period -> 'loading' | 'ready' | 'error'

  const fetchEstimate = async (targetPeriod, refresh) => {
    setStatus((prev) => ({ ...prev, [targetPeriod]: 'loading' }));
    try {
      const result = await taxApi.getEstimate({ period: targetPeriod, refresh });
      setCache((prev) => ({ ...prev, [targetPeriod]: result?.data || null }));
      setStatus((prev) => ({ ...prev, [targetPeriod]: 'ready' }));
    } catch (err) {
      setStatus((prev) => ({ ...prev, [targetPeriod]: 'error' }));
      onShowToast && onShowToast('Tax Estimate Failed', err.message || 'Could not compute the estimate.', 'error');
    }
  };

  const handleSelectPeriod = (p) => {
    setPeriod(p);
    if (!cache[p] && status[p] !== 'loading') fetchEstimate(p, false);
  };

  const handleOpenFirstLoad = () => {
    if (!cache[period] && status[period] !== 'loading') fetchEstimate(period, false);
  };

  // Fire the first fetch for the default period on mount only.
  React.useEffect(() => {
    handleOpenFirstLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = cache[period];
  const currentStatus = status[period] || 'idle';
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const handleDownload = async (format) => {
    setDownloadingFormat(format);
    try {
      await taxApi.downloadExport({ period, format });
    } catch (err) {
      onShowToast && onShowToast('Download Failed', err.message || 'Could not export this estimate.', 'error');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className={`w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-4 shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Estimate</div>
        {data && (
          <button
            type="button"
            onClick={() => fetchEstimate(period, true)}
            disabled={currentStatus === 'loading'}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 disabled:opacity-60"
          >
            <RefreshCw className={`w-3 h-3 ${currentStatus === 'loading' ? 'animate-spin' : ''}`} />
            <span>Refresh estimate</span>
          </button>
        )}
      </div>

      {/* PERIOD PICKER */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleSelectPeriod(p)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
              period === p
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {periodLabel(p)}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {currentStatus === 'loading' ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-[11px] font-medium">Computing estimate — this can take a moment…</span>
        </div>
      ) : currentStatus === 'error' ? (
        <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-3 py-2.5">
          Couldn't compute this estimate. Try again shortly.
        </div>
      ) : !data ? (
        <div className="text-[11px] text-slate-400 text-center py-4">Select a quarter to see its estimate.</div>
      ) : (
        <div className="space-y-3">
          {data.lowConfidence && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Low confidence — few matching tax rules were found for this estimate.</span>
            </div>
          )}

          <div className="text-center py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Tax Due</span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
              {currency}{Number(data.estimatedTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Only shown once an estimate has actually resolved for this period */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-60 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5"
            >
              {downloadingFormat === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('excel')}
              disabled={downloadingFormat !== null}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-60 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5"
            >
              {downloadingFormat === 'excel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Gross Income</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(data.grossIncome || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Deductions</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(data.totalDeductions || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Taxable Income</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(data.taxableIncome || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {Array.isArray(data.rulesUsed) && data.rulesUsed.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cited Rules</div>
              {data.rulesUsed.map((rule) => (
                <div key={rule.ruleId} className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2">
                  <div className="font-bold text-slate-900 dark:text-white">{rule.title}</div>
                  <div className="text-slate-400 font-mono text-[10px] mt-0.5">{rule.sourceUrl}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
