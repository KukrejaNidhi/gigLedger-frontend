import React, { useState, useEffect } from 'react';
import {
  DiffInspectorModal,
  StandardToastNotification,
  SplashScreen,
  LoginPage,
  RegisterPage,
  HomeHeader,
  HomePage,
  HomeBottomDock,
  AddTransactionFlow,
  TransactionsPage,
  TaxEstimateSection,
  DeadlinesSection,
  AgentInboxSection,
  NotificationsPanel,
  SettingsPage,
  AnalyticsPage,
} from './components/index.js';
import { storage } from './utils/storage.js';
import { authApi } from './services/authApi.js';
import { categoriesApi } from './services/categoriesApi.js';
import { deadlinesApi } from './services/deadlinesApi.js';
import { setUnauthorizedHandler } from './services/apiClient.js';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => storage.getThemePref());
  const [currentUser, setCurrentUser] = useState(() => {
    const session = storage.getAuthSession();
    return session ? session.user : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'analysis' | 'accounts' | 'settings' | 'transactions'
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [transactionsRefreshTick, setTransactionsRefreshTick] = useState(0);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [dueSoonDeadlines, setDueSoonDeadlines] = useState([]);
  const [deadlinesRefreshTick, setDeadlinesRefreshTick] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Apply dark mode class to document root on mount & change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.setThemePref(isDarkMode);
  }, [isDarkMode]);

  // Session refresh on startup
  useEffect(() => {
    const session = storage.getAuthSession();
    if (session?.token) {
      authApi.refresh(session.token)
        .then(res => {
          const token = res?.data?.token || res?.token || session.token;
          const user = res?.data?.user || res?.user || session.user;
          storage.setAuthSession(user, token);
          setCurrentUser(user);
        })
        .catch(err => {
          console.warn('Session refresh notice:', err.message);
        });
    }
  }, []);

  // Global 401 handling: any authenticated call whose token has expired/is
  // invalid sends the user back to login, per the auth timing contract.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      storage.clearAuthSession();
      categoriesApi.clearCache();
      setCurrentUser(null);
      setAuthMode('login');
      setActiveTab('home');
      showToast('Session Expired', 'Please sign in again to continue.', 'info');
    });
  }, []);

  // Deadline-driven notifications: GET /api/deadlines is cheap/read-only, so
  // this is safe on login and whenever a deadline changes (completed, or the
  // generator was re-run) — never triggers POST /run itself, that stays an
  // explicit action inside the Tax Center's Deadlines section.
  useEffect(() => {
    if (!currentUser) return;
    deadlinesApi.list()
      .then((result) => {
        const items = Array.isArray(result?.data) ? result.data : [];
        // Server computes status ('due_soon'/'overdue') on every sync using
        // its own 15-day window — trust it rather than recomputing from dueDate.
        const dueSoon = items.filter((d) => d.status === 'due_soon' || d.status === 'overdue');
        setDueSoonDeadlines(dueSoon);
      })
      .catch((err) => console.warn('Failed to load deadlines for notifications:', err.message));
  }, [currentUser, deadlinesRefreshTick]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        showToast('Dark Mode', 'Switched to dark theme.', 'info');
      } else {
        showToast('Light Mode', 'Switched to light theme.', 'info');
      }
      return next;
    });
  };

  const showToast = (title, message, type = 'info') => {
    setToast({ open: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const displayName = user.firstName || user.name || user.email || 'Earner';
    showToast('Session Verified', `Authenticated as ${displayName}. Welcome!`, 'success');
  };

  const handleRegisterSuccess = (newUser) => {
    setCurrentUser(newUser);
    const displayName = newUser.firstName || newUser.name || newUser.email || 'Earner';
    showToast('Account Ready', `Welcome to gigLedgers, ${displayName}!`, 'success');
  };

  const handleLogout = () => {
    const userName = currentUser?.firstName || currentUser?.name || 'User';
    storage.clearAuthSession();
    categoriesApi.clearCache();
    setCurrentUser(null);
    setAuthMode('login');
    setActiveTab('home');
    showToast('Signed Out', `Goodbye ${userName}. Your 2FA session has been securely ended.`, 'info');
  };


  // Dynamic header meta per tab for uniform top layout
  const getHeaderProps = () => {
    switch (activeTab) {
      case 'analysis':
        return {
          pageTitle: 'Analysis & Forecast',
          pageSubtitle: 'Live Liquidity & Tax Engine',
        };
      case 'accounts':
        return {
          pageTitle: 'Tax Center',
          pageSubtitle: 'Estimate, Deadlines & Categorization',
        };
      case 'settings':
        return {
          pageTitle: 'Settings',
          pageSubtitle: 'Profile & Preferences',
        };
      case 'transactions':
        return {};
      case 'home':
      default:
        return {};
    }
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark bg-[#0A0D12] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'} font-sans p-0 m-0 flex flex-col items-center justify-start transition-colors duration-300`}>
      
      {/* 1. OPENING BOOTING SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen
          isDarkMode={isDarkMode}
          onComplete={() => setShowSplash(false)}
          duration={1800}
        />
      )}

      {/* 2. MAIN APP CONTAINER (MOBILE FIRST EDGE-TO-EDGE) */}
      <main className="w-full max-w-md mx-auto min-h-screen flex flex-col p-0 m-0 bg-white dark:bg-[#0D1117] shadow-none sm:shadow-2xl sm:border-x sm:border-slate-200/90 dark:sm:border-[#30363D] relative">
        
        {/* VIEW 1: AUTHENTICATION (LOGIN / REGISTER) */}
        {!currentUser ? (
          <div className="w-full min-h-screen flex flex-col p-0 m-0 animate-fadeIn">
            {authMode === 'login' ? (
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setAuthMode('register')}
                onShowToast={showToast}
              />
            ) : (
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setAuthMode('login')}
                onShowToast={showToast}
              />
            )}
          </div>
        ) : (
          /* VIEW 2: AUTHENTICATED APP VIEWS */
          <div className="w-full min-h-screen flex flex-col justify-between">
            
            {/* UNIFORM APP TOP HEADER (Transactions page renders its own back+title header) */}
            {activeTab !== 'transactions' && (
              <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-5 pt-3 pb-2 shadow-2xs">
                <HomeHeader
                  user={currentUser}
                  notificationCount={dueSoonDeadlines.length}
                  onNotificationClick={() => setIsNotificationsOpen((v) => !v)}
                  {...getHeaderProps()}
                />
                {isNotificationsOpen && (
                  <NotificationsPanel
                    deadlines={dueSoonDeadlines}
                    onClose={() => setIsNotificationsOpen(false)}
                    onViewAll={() => {
                      setIsNotificationsOpen(false);
                      setActiveTab('accounts');
                    }}
                    currency="₹"
                  />
                )}
              </div>
            )}

            {/* ACTIVE TAB CONTENT AREA */}
            <div className="flex-1 w-full px-4 sm:px-5 pt-3 pb-28 space-y-4.5">
              
              {/* TAB 1: HOME PAGE */}
              {activeTab === 'home' && (
                <HomePage
                  user={currentUser}
                  onShowToast={showToast}
                  onOpenDiffModal={() => setIsDiffOpen(true)}
                  currency="₹"
                  refreshTick={transactionsRefreshTick}
                  onSeeAllTransactions={() => setActiveTab('transactions')}
                />
              )}

              {/* TAB: ALL TRANSACTIONS (CRUD) — reached via "See All" on Home, not a bottom-dock tab */}
              {activeTab === 'transactions' && (
                <TransactionsPage
                  onBack={() => setActiveTab('home')}
                  onOpenAdd={() => setIsQuickAddOpen(true)}
                  currency="₹"
                  refreshTick={transactionsRefreshTick}
                  onShowToast={showToast}
                />
              )}

              {/* TAB 2: ANALYSIS — every card backed by GET /api/dashboard/* */}
              {activeTab === 'analysis' && (
                <AnalyticsPage currency="₹" onShowToast={showToast} />
              )}

              {/* TAB 3: TAX CENTER — estimate, deadlines, categorization inbox */}
              {activeTab === 'accounts' && (
                <div className="space-y-4 animate-fadeIn">
                  <TaxEstimateSection currency="₹" onShowToast={showToast} />
                  <DeadlinesSection
                    currency="₹"
                    onShowToast={showToast}
                    onDeadlinesChanged={() => setDeadlinesRefreshTick((t) => t + 1)}
                  />
                  <AgentInboxSection onShowToast={showToast} />
                </div>
              )}

              {/* TAB 4: SETTINGS (was "More") */}
              {activeTab === 'settings' && (
                <SettingsPage
                  user={currentUser}
                  isDarkMode={isDarkMode}
                  onToggleTheme={toggleTheme}
                  onOpenTaxCenter={() => setActiveTab('accounts')}
                  onLogout={handleLogout}
                />
              )}

            </div>

            {/* UNIFORM FLOATING BOTTOM DOCK WITH EXACT CENTER '+' FAB */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <HomeBottomDock
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onQuickAddClick={() => setIsQuickAddOpen(true)}
              />
            </div>

          </div>
        )}

      </main>

      {/* GLOBAL 1-TAP DIFF APPROVAL MODAL */}
      <DiffInspectorModal 
        isOpen={isDiffOpen} 
        onClose={() => setIsDiffOpen(false)} 
        onApprove={() => {
          setIsDiffOpen(false);
          showToast('1-Tap Diff Approved', 'Petrol ₹350.00 logged. ₹70.00 advance tax saved.', 'success');
        }} 
      />

      {/* GLOBAL ADD TRANSACTION FLOW (Triggered by '+' FAB on ANY page): scan-or-manual choice, then review/approve */}
      <AddTransactionFlow
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={(newTx) => {
          const isIncome = newTx.type === 'income';
          const amount = Number(newTx.amount) || 0;
          showToast(
            isIncome ? 'Income Recorded' : 'Spending Recorded',
            `${newTx.rawDescription || (isIncome ? 'Income' : 'Expense')}: ${isIncome ? '+' : '-'}₹${amount.toFixed(2)} logged to ledger.`,
            'success'
          );
          setTransactionsRefreshTick((tick) => tick + 1);
        }}
        currency="₹"
      />

      {/* GLOBAL TOAST NOTIFICATION */}
      <StandardToastNotification 
        isOpen={toast.open} 
        title={toast.title} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))} 
      />

    </div>
  );
}
