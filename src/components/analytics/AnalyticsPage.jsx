import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  PastelWaveCard,
  HatchedBenchmarkBarChart,
  MultiPlatformDonutGauge,
  CategoryPieChart,
} from '../charts/Charts.jsx';
import { dashboardApi } from '../../services/dashboardApi.js';
import { buildCategoryBreakdown } from '../../utils/categoryBreakdown.js';

const SOURCE_VARIANTS = ['sky', 'coral', 'olive', 'steel', 'emerald', 'yellow'];

/**
 * Analytics tab — every card here is backed by GET /api/dashboard/*
 * (cheap, read-only, no LLM), fetched once on mount. Nothing here is mock
 * data; if a section has nothing to show it says so rather than falling
 * back to a placeholder number.
 */
export const AnalyticsPage = ({ currency = '₹', onShowToast, className = '' }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [summary, setSummary] = useState(null);
  const [incomeBySource, setIncomeBySource] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState(null);
  const [taxSavings, setTaxSavings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    Promise.all([
      dashboardApi.summary(),
      dashboardApi.incomeBySource(),
      dashboardApi.expenseByCategory(),
      dashboardApi.monthlyTrend(6),
      dashboardApi.taxSavings(),
    ])
      .then(([summaryRes, incomeRes, expenseRes, trendRes, savingsRes]) => {
        if (cancelled) return;
        setSummary(summaryRes?.data || null);
        setIncomeBySource(incomeRes?.data?.breakdown || []);
        setExpenseByCategory(expenseRes?.data?.breakdown || []);
        setMonthlyTrend(trendRes?.data || null);
        setTaxSavings(savingsRes?.data || null);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('Failed to load analytics:', err.message);
        onShowToast && onShowToast('Analytics Failed', 'Could not load your dashboard data.', 'error');
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-4 py-3">
        Couldn't load analytics. Pull to refresh or try again shortly.
      </div>
    );
  }

  const categorySegments = buildCategoryBreakdown(expenseByCategory);
  const incomeShares = incomeBySource
    .filter((row) => row.total > 0)
    .map((row, idx) => ({
      name: row.source ? row.source.charAt(0).toUpperCase() + row.source.slice(1) : 'Other',
      amount: `${currency}${Number(row.total).toLocaleString('en-IN')}`,
      percent: row.percentage,
      variant: SOURCE_VARIANTS[idx % SOURCE_VARIANTS.length],
    }));

  const trendBars = monthlyTrend
    ? monthlyTrend.months.map((label, i) => ({
        label,
        value: monthlyTrend.net[i],
        highlight: i === monthlyTrend.months.length - 1,
      }))
    : [];
  const trendTotal = monthlyTrend ? monthlyTrend.net.reduce((sum, v) => sum + v, 0) : 0;

  return (
    <div className={`space-y-4 animate-fadeIn ${className}`}>
      <div className="flex items-center justify-between py-1">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Financial Overview</span>
        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-3xl border border-sky-200 dark:border-sky-800/50">
          {summary?.period || 'This Month'}
        </span>
      </div>

      {/* THIS MONTH'S INCOME / EXPENSES */}
      <div className="grid grid-cols-2 gap-3">
        <PastelWaveCard
          variant="sky"
          title="Income (This Month)"
          amount={`+${currency}${Number(summary?.totalIncome || 0).toLocaleString('en-IN')}`}
        />
        <PastelWaveCard
          variant="steel"
          title="Expenses (This Month)"
          amount={`${currency}${Number(summary?.totalExpenses || 0).toLocaleString('en-IN')}`}
          isNegative
        />
      </div>

      {/* MONTHLY NET TREND */}
      {monthlyTrend && (
        <HatchedBenchmarkBarChart
          variant="sky"
          title="Net Income"
          totalLabel={`${currency}${trendTotal.toLocaleString('en-IN')} total`}
          periodLabel="Last 6 Months"
          data={trendBars}
        />
      )}

      {/* INCOME BY SOURCE */}
      {incomeShares.length > 0 && <MultiPlatformDonutGauge title="Income by Source" shares={incomeShares} />}

      {/* EXPENSE BY CATEGORY */}
      <CategoryPieChart
        title="Spending by Category"
        segments={categorySegments}
        emptyLabel="No expenses this month"
      />

      {/* TAX SAVINGS SUMMARY */}
      {taxSavings && (
        <div className="w-full bg-white dark:bg-[#161B22] p-5 rounded-3xl border border-slate-200/80 dark:border-[#30363D] space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax Savings ({taxSavings.period})</div>

          {taxSavings.totalExpenses > 0 && (
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden p-0.5 gap-0.5 border border-slate-200/60 dark:border-slate-700">
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all"
                  style={{ width: `${Math.round((taxSavings.deductibleExpenses / taxSavings.totalExpenses) * 100)}%` }}
                ></div>
                <div
                  className="h-full bg-slate-400 rounded-r-full transition-all"
                  style={{ width: `${Math.round((taxSavings.nonDeductibleExpenses / taxSavings.totalExpenses) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Deductible</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Non-Deductible</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Deductible</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(taxSavings.deductibleExpenses).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Non-Deductible</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(taxSavings.nonDeductibleExpenses).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[9px] font-bold uppercase text-slate-400">Est. Saving</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {currency}{Number(taxSavings.estimatedTaxSaving).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
