import React, { useState } from 'react';
import { HomeHeader } from './HomeHeader.jsx';
import { CashFlowCard } from './CashFlowCard.jsx';
import { HabitTrophyBanner } from './HabitTrophyBanner.jsx';
import { MakeItYoursChecklist } from './MakeItYoursChecklist.jsx';
import { RecentTransactionsList } from './RecentTransactionsList.jsx';
import { BudgetSectionCard } from './BudgetSectionCard.jsx';
import { ScheduledBillsCard } from './ScheduledBillsCard.jsx';
import { QuickAddModal } from './QuickAddModal.jsx';

/**
 * Mobile App Home Page
 * Matches the reference layout and icon style, built with GigLedger's Electric Sky / Obsidian theme.
 */
export const HomePage = ({
  user,
  onShowToast,
  currency = '₹', // or '$'
  isQuickAddOpen = false,
  onCloseQuickAdd,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);

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

  // Derive dynamic spending and income
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
        'Listening for commands (e.g. "Spent 50 on fuel")...',
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
      onShowToast('Search Ledger', 'Filter by merchant, category, or date range.', 'info');
    }
  };

  const handleUpgradePro = () => {
    if (onShowToast) {
      onShowToast('GigLedger Pro', 'Unlocked AI Tax Deductions & Multi-Platform Sync!', 'info');
    }
  };

  const handleViewHabit = () => {
    if (onShowToast) {
      onShowToast('Habit Milestone', 'You logged your first 2 transactions this week. Keep the streak going!', 'success');
    }
  };

  const handleSetBudget = () => {
    if (onShowToast) {
      onShowToast('Budget Created', 'Monthly spending limit set to ₹2,500.0 with 25% tax reserve.', 'success');
    }
  };

  const handleScheduleItem = () => {
    if (onShowToast) {
      onShowToast('Schedule Alert', 'Weekly recurring earnings check scheduled for every Monday.', 'info');
    }
  };

  return (
    <div className={`w-full min-h-screen pb-24 px-4 sm:px-5 space-y-5 animate-fadeIn ${className}`}>
      
      {/* 1. TOP HEADER */}
      <HomeHeader
        user={user}
        onUpgradePro={handleUpgradePro}
        onVoiceClick={handleVoiceCommand}
        onSearchClick={handleSearchClick}
        isListening={isListening}
      />

      {/* 2. CASH FLOW CARD */}
      <CashFlowCard
        spending={totalSpending}
        income={totalIncome}
        currency={currency}
        onTimeframeChange={(tf) => onShowToast && onShowToast('Timeframe Filter', `Filtered Cash Flow by ${tf}`, 'info')}
      />

      {/* 3. HABIT BANNER */}
      <HabitTrophyBanner
        message="First one logged. The habit begins."
        onViewClick={handleViewHabit}
      />

      {/* 4. MAKE IT YOURS CHECKLIST */}
      <MakeItYoursChecklist
        onItemClick={(item) => onShowToast && onShowToast('Setup Task', `Opening ${item.label}...`, 'info')}
      />

      {/* 5. RECENT TRANSACTIONS */}
      <RecentTransactionsList
        transactions={transactions}
        currency={currency}
        onTransactionClick={(tx) => onShowToast && onShowToast('Transaction Details', `${tx.title} · ${currency}${tx.amount.toFixed(1)}`, 'info')}
      />

      {/* 6. BUDGETS SECTION */}
      <BudgetSectionCard
        onSetBudget={handleSetBudget}
      />

      {/* 7. SCHEDULED SECTION */}
      <ScheduledBillsCard
        onScheduleClick={handleScheduleItem}
      />

      {/* 8. QUICK ADD MODAL */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={onCloseQuickAdd}
        onAddTransaction={handleAddTransaction}
        currency={currency}
      />

    </div>
  );
};
