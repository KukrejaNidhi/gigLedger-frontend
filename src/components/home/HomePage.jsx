import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { HomeHeader } from './HomeHeader.jsx';
import { PastelWaveMetricCards } from './PastelWaveMetricCards.jsx';
import { LiquidityBufferCard } from './LiquidityBufferCard.jsx';
import { AgentActionCard } from './AgentActionCard.jsx';
import { FinancialInsightsList } from './FinancialInsightsList.jsx';
import { CashFlowCard } from './CashFlowCard.jsx';
import { HabitTrophyBanner } from './HabitTrophyBanner.jsx';
import { MakeItYoursChecklist } from './MakeItYoursChecklist.jsx';
import { RecentTransactionsList } from './RecentTransactionsList.jsx';
import { BudgetSectionCard } from './BudgetSectionCard.jsx';
import { ScheduledBillsCard } from './ScheduledBillsCard.jsx';
import { QuickAddModal } from './QuickAddModal.jsx';

/**
 * Mobile App Home Page
 * Perfectly incorporates the reference design:
 * - Header with User profile, pro badge, voice mic & search
 * - FINANCIAL REPORT / Overview header with Timeframe filter
 * - Dual Pastel Wave Cards (Gross Inflow in Sky Blue & Tax Reserve in Amber)
 * - Net Safe-to-Spend & Liquidity Buffer with multi-color segmented progress bar
 * - Agent Action Pending DIFF card
 * - Financial Insights (Net Inflow +$300.03 & Tax Reserve Ratio 100% OK)
 * - Review 1 Agent Tax Proposal action button
 * - Cash Flow, Recent Transactions, Budgets, and Scheduled sections
 * - 100% zero emojis, pure vector Lucide SVG icons & rich colorful theme palette
 */
export const HomePage = ({
  user,
  onShowToast,
  onOpenDiffModal,
  currency = '$',
  isQuickAddOpen = false,
  onCloseQuickAdd,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  const timeframes = ['This Month', 'Last Month', 'This Quarter', 'Year to Date'];

  // Cash Flow & Transaction State
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      title: 'Food and Dining',
      icon: 'food',
      category: 'Food and Dining',
      method: 'Cash',
      amount: 100.0,
      isIncome: false,
      date: 'Today',
    },
    {
      id: 'tx-2',
      title: 'Salary',
      icon: 'salary',
      category: 'Salary',
      method: 'Cash',
      amount: 500.0,
      isIncome: true,
      date: 'Today',
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
      onShowToast(
        newTx.isIncome ? 'Income Logged' : 'Spending Recorded',
        `${newTx.title}: ${currency}${newTx.amount.toFixed(1)} added.`,
        'success'
      );
    }
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    if (onShowToast) {
      onShowToast(
        'Voice Assistant',
        'Listening for commands (e.g. "Spent $45 on gas")...',
        'info'
      );
    }
    setTimeout(() => {
      setIsListening(false);
      handleAddTransaction({
        id: `tx-voice-${Date.now()}`,
        title: 'Shell Fuel Refill',
        icon: 'fuel',
        category: 'Fuel',
        method: 'Card',
        amount: 45.0,
        isIncome: false,
        date: 'Today',
      });
    }, 2200);
  };

  const handleSearchClick = () => {
    if (onShowToast) {
      onShowToast('Search Ledger', 'Filter by merchant, platform, or tax category.', 'info');
    }
  };

  const handleUpgradePro = () => {
    if (onShowToast) {
      onShowToast('GigLedger Pro', 'Unlocked Autonomous Agent Deductions & Multi-Platform Sync!', 'info');
    }
  };

  const handleReviewProposal = () => {
    if (onOpenDiffModal) {
      onOpenDiffModal();
    } else if (onShowToast) {
      onShowToast('Agent Tax Proposal', 'Reviewing Shell $42.50 expense deduction proposal.', 'info');
    }
  };

  const handleViewHabit = () => {
    if (onShowToast) {
      onShowToast('Habit Milestone', 'You logged your first 2 transactions this week. Keep the streak going!', 'success');
    }
  };

  const handleSetBudget = () => {
    if (onShowToast) {
      onShowToast('Budget Created', `Monthly spending limit set to ${currency}2,500.0 with 23% tax reserve.`, 'success');
    }
  };

  const handleScheduleItem = () => {
    if (onShowToast) {
      onShowToast('Schedule Alert', 'Weekly recurring earnings check scheduled for every Monday.', 'info');
    }
  };

  return (
    <div className={`w-full min-h-screen pb-24 px-4 sm:px-5 space-y-4.5 animate-fadeIn ${className}`}>
      
      {/* 1. TOP HEADER (Avatar, User Name, Pro Badge, Voice & Search) */}
      <HomeHeader
        user={user}
        onUpgradePro={handleUpgradePro}
        onVoiceClick={handleVoiceCommand}
        onSearchClick={handleSearchClick}
        isListening={isListening}
      />

      {/* 2. FINANCIAL REPORT / OVERVIEW SECTION TITLE WITH TIMEFRAME DROPDOWN */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
            FINANCIAL REPORT
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Overview
          </h2>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-sky-400 dark:hover:border-sky-500 shadow-sm transition"
          >
            <span>{selectedTimeframe}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTimeframeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTimeframeOpen && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-xl py-1 z-30 animate-fadeIn">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    setSelectedTimeframe(tf);
                    setIsTimeframeOpen(false);
                    if (onShowToast) onShowToast('Timeframe Filter', `Showing report for ${tf}`, 'info');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition ${
                    selectedTimeframe === tf
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. DUAL PASTEL WAVE CARDS (Gross Inflow in Sky Blue & Tax Reserve in Amber) */}
      <PastelWaveMetricCards
        grossInflow={5200}
        taxReserve={1120}
        currency={currency}
      />

      {/* 4. NET SAFE-TO-SPEND & MULTI-SEGMENT LIQUIDITY BUFFER */}
      <LiquidityBufferCard
        safeAmount={3730.0}
        safePercent={65}
        taxPercent={23}
        expensePercent={12}
        currency={currency}
      />

      {/* 5. AGENT ACTION PENDING DIFF CARD */}
      <AgentActionCard
        title="Agent Action Pending"
        badgeText="DIFF"
        subtitle="Shell Gas $42.50 · Matched Uber shift"
        onReviewClick={handleReviewProposal}
      />

      {/* 6. FINANCIAL INSIGHTS SECTION */}
      <FinancialInsightsList
        netInflow={300.03}
        netInflowPercent={6.1}
        taxRatioPercent={100}
        onReviewProposal={handleReviewProposal}
        currency={currency}
      />

      {/* 7. CASH FLOW SUMMARY CARD */}
      <CashFlowCard
        spending={totalSpending}
        income={totalIncome}
        currency={currency}
        onTimeframeChange={(tf) => onShowToast && onShowToast('Timeframe Filter', `Filtered Cash Flow by ${tf}`, 'info')}
      />

      {/* 8. HABIT BANNER */}
      <HabitTrophyBanner
        message="First one logged. The habit begins."
        onViewClick={handleViewHabit}
      />

      {/* 9. MAKE IT YOURS CHECKLIST */}
      <MakeItYoursChecklist
        onItemClick={(item) => onShowToast && onShowToast('Setup Task', `Opening ${item.label}...`, 'info')}
      />

      {/* 10. RECENT TRANSACTIONS */}
      <RecentTransactionsList
        transactions={transactions}
        currency={currency}
        onTransactionClick={(tx) => onShowToast && onShowToast('Transaction Details', `${tx.title} · ${currency}${tx.amount.toFixed(1)}`, 'info')}
      />

      {/* 11. BUDGETS SECTION */}
      <BudgetSectionCard
        onSetBudget={handleSetBudget}
      />

      {/* 12. SCHEDULED SECTION */}
      <ScheduledBillsCard
        onScheduleClick={handleScheduleItem}
      />

      {/* 13. QUICK ADD MODAL */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={onCloseQuickAdd}
        onAddTransaction={handleAddTransaction}
        currency={currency}
      />

    </div>
  );
};
