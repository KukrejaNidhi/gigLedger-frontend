import React, { useState } from 'react';
import { PastelWaveMetricCards } from './PastelWaveMetricCards.jsx';
import { CashFlowCard } from './CashFlowCard.jsx';
import { HabitTrophyBanner } from './HabitTrophyBanner.jsx';
import { LiquidityBufferCard } from './LiquidityBufferCard.jsx';
import { AgentActionCard } from './AgentActionCard.jsx';
import { FinancialInsightsList } from './FinancialInsightsList.jsx';
import { MakeItYoursChecklist } from './MakeItYoursChecklist.jsx';
import { RecentTransactionsList } from './RecentTransactionsList.jsx';
import { BudgetSectionCard } from './BudgetSectionCard.jsx';
import { ScheduledBillsCard } from './ScheduledBillsCard.jsx';
import { QuickAddModal } from './QuickAddModal.jsx';

/**
 * Mobile App Home Content View
 * Structure:
 * 1. Dual Sparkline Line Chart Cards (Gross Inflow & Tax Reserve)
 * 2. Cash Flow Summary Card (SPENDING - vs INCOME + with Net Balance)
 * 3. Habit Milestone Banner
 * 4. Net Safe-to-Spend Liquidity Buffer with Multi-Segment Progress Bar
 * 5. Agent Action Pending Card (DIFF preview)
 * 6. Financial Insights (Net Inflow & Tax Reserve Ratio)
 * 7. Make It Yours Setup Checklist
 * 8. Recent Transactions List (Uber, Zomato, Swiggy, Apple, Shell thumbnails)
 * 9. Budgets & Scheduled Sections
 * 10. Quick Add FAB Modal
 */
export const HomePage = ({
  user,
  onShowToast,
  onOpenDiffModal,
  currency = '₹',
  isQuickAddOpen = false,
  onCloseQuickAdd,
  className = '',
}) => {
  // Cash Flow & Transaction State with Real Branded Entries in Rupees
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      title: 'Uber Driver Payout',
      brand: 'uber',
      icon: 'uber',
      category: 'Ride / Inflow',
      method: 'Direct Deposit',
      amount: 1450.00,
      isIncome: true,
      date: 'Today, 2:30 PM',
    },
    {
      id: 'tx-2',
      title: 'Zomato Dinner Order',
      brand: 'zomato',
      icon: 'zomato',
      category: 'Food & Dining',
      method: 'UPI',
      amount: 340.00,
      isIncome: false,
      date: 'Today, 1:15 PM',
    },
    {
      id: 'tx-3',
      title: 'Swiggy Instamart',
      brand: 'swiggy',
      icon: 'swiggy',
      category: 'Groceries',
      method: 'Card',
      amount: 180.00,
      isIncome: false,
      date: 'Yesterday',
    },
    {
      id: 'tx-4',
      title: 'Monthly Earnings Payout',
      brand: 'salary',
      icon: 'salary',
      category: 'Salary',
      method: 'Bank Wire',
      amount: 5000.00,
      isIncome: true,
      date: 'Aug 18',
    },
    {
      id: 'tx-5',
      title: 'Apple iCloud Services',
      brand: 'apple',
      icon: 'apple',
      category: 'Cloud Storage',
      method: 'Card',
      amount: 75.00,
      isIncome: false,
      date: 'Aug 16',
    },
  ]);

  const totalSpending = transactions
    .filter((t) => !t.isIncome)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.isIncome)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    if (onShowToast) {
      const sign = newTx.isIncome ? '+' : '-';
      onShowToast(
        newTx.isIncome ? 'Income Recorded' : 'Spending Recorded',
        `${newTx.title}: ${sign}${currency}${newTx.amount.toFixed(2)} added to ledger.`,
        'success'
      );
    }
  };

  const handleReviewProposal = () => {
    if (onOpenDiffModal) {
      onOpenDiffModal();
    } else if (onShowToast) {
      onShowToast('Agent Tax Proposal', 'Reviewing Shell ₹350.00 expense deduction proposal.', 'info');
    }
  };

  const handleViewHabit = () => {
    if (onShowToast) {
      onShowToast('Habit Milestone', 'You logged 5 transactions this week. Keep your ledger accurate!', 'success');
    }
  };

  const handleSetBudget = () => {
    if (onShowToast) {
      onShowToast('Budget Created', `Monthly spending limit set to ${currency}25,000.00 with 23% tax vault reserve.`, 'success');
    }
  };

  const handleScheduleItem = () => {
    if (onShowToast) {
      onShowToast('Schedule Alert', 'Weekly recurring earnings check scheduled for every Monday.', 'info');
    }
  };

  return (
    <div className={`w-full space-y-4 sm:space-y-4.5 animate-fadeIn ${className}`}>

      {/* 1. DUAL SPARKLINE LINE CHART CARDS (Gross Inflow & Tax Reserve) */}
      <PastelWaveMetricCards
        grossInflow={52000}
        taxReserve={11200}
        currency={currency}
      />

      {/* 2. CASH FLOW OVERVIEW CARD */}
      <CashFlowCard
        spending={totalSpending}
        income={totalIncome}
        currency={currency}
        onTimeframeChange={(tf) => onShowToast && onShowToast('Timeframe Filter', `Filtered Cash Flow by ${tf}`, 'info')}
      />


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


      {/* 8. RECENT TRANSACTIONS (WITH UBER, ZOMATO, SWIGGY, ETC. THUMBNAILS) */}
      <RecentTransactionsList
        transactions={transactions}
        currency={currency}
        onTransactionClick={(tx) => onShowToast && onShowToast('Transaction Details', `${tx.title} · ${tx.isIncome ? '+' : '-'}${currency}${tx.amount.toFixed(2)}`, 'info')}
      />
    </div>
  );
};
