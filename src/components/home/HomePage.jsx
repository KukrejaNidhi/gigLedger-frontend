import React, { useEffect, useState } from 'react';
import { CashFlowCard } from './CashFlowCard.jsx';
import { HabitTrophyBanner } from './HabitTrophyBanner.jsx';
import { LiquidityBufferCard } from './LiquidityBufferCard.jsx';
import { AgentActionCard } from './AgentActionCard.jsx';
import { FinancialInsightsList } from './FinancialInsightsList.jsx';
import { MakeItYoursChecklist } from './MakeItYoursChecklist.jsx';
import { RecentTransactionsList } from './RecentTransactionsList.jsx';
import { transactionsApi } from '../../services/transactionsApi.js';
import { categoriesApi } from '../../services/categoriesApi.js';
import { sumByTimeframe } from '../../utils/timeframeRange.js';

/**
 * Mobile App Home Content View
 * Structure:
 * 1. Cash Flow Summary Card (SPENDING - vs INCOME + with Net Balance), filtered
 *    by the selected timeframe against real transaction dates
 * 2. Net Safe-to-Spend Liquidity Buffer with Multi-Segment Progress Bar
 * 3. Agent Action Pending Card (DIFF preview)
 * 4. Financial Insights (Net Inflow & Tax Reserve Ratio)
 * 5. Recent Transactions List (branded thumbnails), live from the backend
 *
 * Dropped the old "Gross Inflow / Tax Reserve" sparkline cards
 * (PastelWaveMetricCards) — both their headline numbers and their trend
 * badges/sparkline curves were 100% hardcoded with no real data source, and
 * "Gross Inflow" duplicated what CashFlowCard's Income column already shows
 * live.
 */
export const HomePage = ({
  user,
  onShowToast,
  onOpenDiffModal,
  currency = '₹',
  refreshTick = 0,
  onSeeAllTransactions,
  className = '',
}) => {
  const [transactions, setTransactions] = useState([]);
  const [categoriesById, setCategoriesById] = useState({});
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    transactionsApi.listAll()
      .then((items) => {
        if (!cancelled) {
          setTransactions(items);
          setStatus('ready');
        }
      })
      .catch((err) => {
        console.warn('Failed to load transactions:', err.message);
        if (!cancelled) setStatus('error');
      });
    return () => { cancelled = true; };
  }, [refreshTick]);

  useEffect(() => {
    Promise.all([categoriesApi.list({ type: 'income' }), categoriesApi.list({ type: 'expense' })])
      .then(([income, expense]) => {
        const all = [...(income?.data || []), ...(expense?.data || [])];
        setCategoriesById(Object.fromEntries(all.map((c) => [c._id, c])));
      })
      .catch((err) => console.warn('Failed to load categories:', err.message));
  }, []);

  const { spending: totalSpending, income: totalIncome } = sumByTimeframe(transactions, selectedTimeframe);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .map((tx) => ({
      id: tx._id,
      title: tx.rawDescription || (tx.type === 'income' ? 'Income' : 'Expense'),
      brand: tx.source,
      source: tx.source,
      rawDescription: tx.rawDescription,
      category: tx.category ? categoriesById[tx.category]?.name || 'Categorized' : 'Uncategorized',
      method: tx.source && tx.source !== 'manual' ? tx.source : 'Manual Entry',
      amount: Number(tx.amount) || 0,
      isIncome: tx.type === 'income',
      type: tx.type,
      date: new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

  const handleReviewProposal = () => {
    if (onOpenDiffModal) {
      onOpenDiffModal();
    } else if (onShowToast) {
      onShowToast('Agent Tax Proposal', 'Reviewing Shell ₹350.00 expense deduction proposal.', 'info');
    }
  };

  return (
    <div className={`w-full space-y-4 sm:space-y-4.5 animate-fadeIn ${className}`}>

      {/* 2. CASH FLOW OVERVIEW CARD — filtered by selectedTimeframe against real transaction dates */}
      <CashFlowCard
        spending={totalSpending}
        income={totalIncome}
        currency={currency}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />

      {status === 'error' && (
        <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-4 py-3">
          Couldn't load your transactions. Pull to refresh or try again shortly.
        </div>
      )}

      {/* 4. NET SAFE-TO-SPEND LIQUIDITY BUFFER CARD */}
      <LiquidityBufferCard
        safeAmount={37300.00}
        safePercent={65}
        taxPercent={23}
        expensePercent={12}
        currency={currency}
      />

      {/* 5. AGENT ACTION PENDING DIFF CARD */}
      <AgentActionCard
        title="Agent Action Pending"
        badgeText="DIFF"
        subtitle="Shell Fuel ₹350.00 · Matched Uber shift"
        onReviewClick={handleReviewProposal}
      />

      {/* 6. FINANCIAL INSIGHTS SECTION */}
      <FinancialInsightsList
        netInflow={3000.00}
        netInflowPercent={6.1}
        taxRatioPercent={100}
        onReviewProposal={handleReviewProposal}
        currency={currency}
      />

      {/* 8. RECENT TRANSACTIONS (branded thumbnails), live from the backend */}
      <RecentTransactionsList
        transactions={recentTransactions}
        currency={currency}
        onTransactionClick={(tx) => onShowToast && onShowToast('Transaction Details', `${tx.title} · ${tx.isIncome ? '+' : '-'}${currency}${tx.amount.toFixed(2)}`, 'info')}
        onSeeAllClick={onSeeAllTransactions}
      />
    </div>
  );
};
