import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Sun, 
  Moon, 
  ShieldCheck, 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  Bell,
  Sparkles,
  Camera,
  Layers,
  BarChart3,
  TrendingUp,
  Receipt
} from 'lucide-react';
import {
  HatchedBenchmarkBarChart,
  TorusHaloDial,
  SegmentedLiquiditySlider,
  PastelWaveCard,
  MultiPlatformDonutGauge,
  QuarterlyHorizonTimeline,
  TaxWaterfallFlow,
  HeroCommandHeader,
  MetricBentoGrid,
  ShiftCalendarStrip,
  AgentStatusPill,
  DiffInspectorModal,
  TaxLiabilityCard,
  RAGAuthorityDrawer,
  PlatformSwitcherTabs,
  PlatformConnectionCard,
  FeeBreakdownPopover,
  CameraViewfinderOverlay,
  ExtractedEntityCard,
  DeductionQuickAdder,
  StandardToastNotification,
  ThemeToggleSwitch,
  SplashScreen,
  LoginPage,
  RegisterPage,
  HomeHeader,
  HomePage,
  HomeBottomDock,
  AddTransactionFlow,
  CategoryPieChart,
} from './components/index.js';
import { storage } from './utils/storage.js';
import { authApi } from './services/authApi.js';
import { transactionsApi } from './services/transactionsApi.js';
import { categoriesApi } from './services/categoriesApi.js';
import { buildCategoryBreakdown } from './utils/categoryBreakdown.js';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => storage.getThemePref());
  const [currentUser, setCurrentUser] = useState(() => {
    const session = storage.getAuthSession();
    return session ? session.user : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'analysis' | 'accounts' | 'more'
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [categoryBreakdownStatus, setCategoryBreakdownStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

  // Live category-wise spend breakdown for the Analysis tab pie chart —
  // fetched once per visit to that tab while authenticated, not re-polled.
  useEffect(() => {
    if (activeTab !== 'analysis' || !currentUser || categoryBreakdownStatus !== 'idle') return;
    setCategoryBreakdownStatus('loading');
    Promise.all([
      transactionsApi.listAll({ type: 'expense' }),
      categoriesApi.list({ type: 'expense' }),
    ])
      .then(([transactions, categoriesResult]) => {
        const breakdown = buildCategoryBreakdown(transactions, categoriesResult?.data || []);
        setCategoryBreakdown(breakdown);
        setCategoryBreakdownStatus('ready');
      })
      .catch((err) => {
        console.warn('Category breakdown fetch failed:', err.message);
        setCategoryBreakdownStatus('error');
      });
  }, [activeTab, currentUser, categoryBreakdownStatus]);

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
    setCurrentUser(null);
    setAuthMode('login');
    setActiveTab('home');
    showToast('Signed Out', `Goodbye ${userName}. Your 2FA session has been securely ended.`, 'info');
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    showToast('Voice Assistant', 'Listening for commands (e.g. "Spent ₹350 on petrol")...', 'info');
    setTimeout(() => {
      setIsListening(false);
      showToast('Voice Logged', 'Shell Petrol ₹350.00 logged as work mileage expense.', 'success');
    }, 2200);
  };

  const handleSearchClick = () => {
    showToast('Search Ledger', 'Filter transactions by Uber, Zomato, Swiggy, Apple, or tax tags.', 'info');
  };

  const handleUpgradePro = () => {
    showToast('GigLedger Pro', 'Unlocked Autonomous Agent Deductions & Multi-Platform Sync!', 'info');
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
          pageTitle: 'Connected Accounts',
          pageSubtitle: '4 Active Platforms Syncing',
        };
      case 'more':
        return {
          pageTitle: 'Settings & Tax Vault',
          pageSubtitle: 'Preferences & AI Review',
        };
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
            
            {/* UNIFORM APP TOP HEADER */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-5 pt-3 pb-2 shadow-2xs">
              <HomeHeader
                user={currentUser}
                onUpgradePro={handleUpgradePro}
                onVoiceClick={handleVoiceCommand}
                onSearchClick={handleSearchClick}
                isListening={isListening}
                {...getHeaderProps()}
              />
            </div>

            {/* ACTIVE TAB CONTENT AREA */}
            <div className="flex-1 w-full px-4 sm:px-5 pt-3 pb-28 space-y-4.5">
              
              {/* TAB 1: HOME PAGE */}
              {activeTab === 'home' && (
                <HomePage
                  user={currentUser}
                  onShowToast={showToast}
                  onOpenDiffModal={() => setIsDiffOpen(true)}
                  currency="₹"
                  isQuickAddOpen={isQuickAddOpen}
                  onCloseQuickAdd={() => setIsQuickAddOpen(false)}
                />
              )}

              {/* TAB 2: ANALYSIS */}
              {activeTab === 'analysis' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Financial Overview</span>
                    <span className="text-[11px] font-mono font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800/50">Live Sync</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <PastelWaveCard variant="sky" title="Gross Inflow" amount="+₹52,000" />
                    <PastelWaveCard variant="steel" title="Tax Reserve" amount="₹11,200" />
                  </div>

                  <SegmentedLiquiditySlider safeCash="₹37,300" safePercent={65} taxPercent={23} expensePercent={12} variant="sky" />
                  
                  <HatchedBenchmarkBarChart variant="sky" title="Daily Inflow (Last 7 Days)" totalLabel="₹59,500 total" />

                  <MultiPlatformDonutGauge
                    shares={[
                      { name: 'Uber Driver', amount: '₹33,500', percent: 52, variant: 'sky' },
                      { name: 'Zomato / Delivery', amount: '₹18,900', percent: 29, variant: 'coral' },
                      { name: 'Direct Freelance', amount: '₹11,800', percent: 19, variant: 'olive' },
                    ]}
                  />

                  {categoryBreakdownStatus === 'error' ? (
                    <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 rounded-2xl px-4 py-3">
                      Couldn't load category breakdown. Pull to refresh or try again shortly.
                    </div>
                  ) : (
                    <CategoryPieChart
                      title="Spending by Category"
                      segments={categoryBreakdownStatus === 'ready' ? categoryBreakdown : []}
                      emptyLabel={categoryBreakdownStatus === 'loading' ? 'Loading…' : 'No data yet'}
                    />
                  )}
                </div>
              )}

              {/* TAB 3: ACCOUNTS & PLATFORMS */}
              {activeTab === 'accounts' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Active Stream Sync</span>
                    <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">4 Connected</span>
                  </div>

                  <PlatformSwitcherTabs variant="yellow" />

                  <ShiftCalendarStrip variant="sky" />

                  <FeeBreakdownPopover 
                    grossPayout="₹13,500.00"
                    platformCut="-₹2,300.00"
                    netDeposited="+₹11,200.00"
                    taxHold="₹2,576.00"
                  />

                  <PlatformConnectionCard onConnect={() => showToast('New Account', 'Platform connection bridge initiated for Swiggy & Rapido.', 'info')} />

                  {/* RECEIPT EXTRACTION DRAWER */}
                  <div className="pt-2 space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Instant Receipt Scanner</h3>
                    <CameraViewfinderOverlay merchantPreview="Bharat Petroleum #2041" onCapture={() => showToast('Receipt Captured', 'Bharat Petroleum #2041 extracted with 99.4% confidence.', 'success')} />
                    <ExtractedEntityCard 
                      merchant="Bharat Petroleum #2041"
                      date="August 20, 2026"
                      totalAmount="-₹350.00"
                      taxSchedule="Line 9 (Vehicle & Fuel)"
                      onConfirm={() => showToast('Deduction Saved', 'Saved ₹70.00 in tax deductions.', 'success')}
                    />
                    <DeductionQuickAdder onSelectCategory={(c) => showToast('Category Logged', `Logged expense under ${c}.`, 'info')} />
                  </div>
                </div>
              )}

              {/* TAB 4: MORE & SETTINGS */}
              {activeTab === 'more' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Profile & Preferences</span>
                    <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">Q3 2026</span>
                  </div>

                  {/* USER SUMMARY CARD */}
                  <div className="p-4 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-2xs">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : currentUser.name || 'Earner'}
                        </h2>
                        <p className="text-xs text-slate-400 font-mono">{currentUser.email || 'earner@gigledgers.app'}</p>
                      </div>
                    </div>
                  </div>

                  {/* TAX VAULT SUMMARY */}
                  <TaxLiabilityCard liabilityAmount="₹11,200.00" variant="coral" quarterLabel="Advance Tax Reserve" />
                  <TaxWaterfallFlow 
                    grossInflow="+₹64,200.00"
                    deductions="-₹15,700.00"
                    netScheduleC="₹48,500.00"
                    totalReserve="₹11,200.00"
                    variant="coral" 
                  />
                  <QuarterlyHorizonTimeline reserveReady="₹11,200.00" variant="sky" />
                  <RAGAuthorityDrawer 
                    title="Section 44ADA Presumptive Tax Authority"
                    excerpt='"Presumptive taxation under Section 44ADA offers 50% flat tax-free expense deduction on gross receipts for gig freelancers and drivers."'
                    sourceUrl="incometax.gov.in"
                    variant="steel"
                  />

                  {/* PREFERENCES LIST */}
                  <div className="rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] p-3 shadow-sm hover:shadow-md transition-all space-y-1">
                    
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Theme</span>
                      </div>
                      <ThemeToggleSwitch isDarkMode={isDarkMode} onToggle={toggleTheme} />
                    </div>

                    {/* AI Agent Review */}
                    <div 
                      onClick={() => setIsDiffOpen(true)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Diff Review (1 Pending)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-2xs">1</span>
                    </div>

                    {/* Sign Out */}
                    <div 
                      onClick={handleLogout}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Sign Out</span>
                      </div>
                    </div>

                  </div>
                </div>
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
