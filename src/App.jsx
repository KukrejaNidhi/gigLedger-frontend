import React, { useState, useEffect } from 'react';
import { LogOut, Sun, Moon, ShieldCheck, User, Settings, HelpCircle, FileText, Bell } from 'lucide-react';
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
  AgentSubtaskRail,
  DiffInspectorModal,
  TaxLiabilityCard,
  RAGAuthorityDrawer,
  DeductionCategoryChip,
  AuditTrailStamp,
  PlatformSwitcherTabs,
  TransactionItemRow,
  PlatformConnectionCard,
  FeeBreakdownPopover,
  StandardToastNotification,
  ThemeToggleSwitch,
  GitLedgersLogo,
  SplashScreen,
  LoginPage,
  RegisterPage,
  HomePage,
  HomeBottomDock,
} from './components/index.js';
import { storage } from './utils/storage.js';
import { authApi } from './services/authApi.js';

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
  const [isDiffOpen, setIsDiffOpen] = useState(false);
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

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark bg-[#0D1117] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans p-0 m-0 flex flex-col items-center justify-start transition-colors duration-300`}>
      
      {/* 1. OPENING BOOTING SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen
          isDarkMode={isDarkMode}
          onComplete={() => setShowSplash(false)}
          duration={2200}
        />
      )}

      {/* 2. MAIN APP CONTAINER (MOBILE FIRST EDGE-TO-EDGE) */}
      <main className="w-full max-w-md mx-auto min-h-screen flex flex-col p-0 m-0 bg-white dark:bg-[#0D1117] shadow-none sm:shadow-xl sm:border-x sm:border-slate-200 dark:sm:border-[#30363D] relative">
        
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
            
            {/* ACTIVE TAB CONTENT */}
            <div className="flex-1 w-full pt-4">
              
              {/* TAB 1: HOME PAGE (Matches Reference Layout) */}
              {activeTab === 'home' && (
                <HomePage
                  user={currentUser}
                  onShowToast={showToast}
                  onOpenDiffModal={() => setIsDiffOpen(true)}
                  currency="$"
                  isQuickAddOpen={isQuickAddOpen}
                  onCloseQuickAdd={() => setIsQuickAddOpen(false)}
                />
              )}

              {/* TAB 2: ANALYSIS */}
              {activeTab === 'analysis' && (
                <div className="space-y-4 px-4 pb-24 animate-fadeIn">
                  <div className="flex items-center justify-between py-2">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Financial Analysis</h1>
                    <span className="text-xs font-mono font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">Live Forecast</span>
                  </div>

                  <HeroCommandHeader 
                    userName={currentUser.firstName || currentUser.name || 'Earner'} 
                    balance="₹4,850.0" 
                    onNotificationClick={() => showToast('Tax Alert', 'Reserve ready: ₹1,120.0', 'alert')} 
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <PastelWaveCard variant="sky" title="Gross Inflow" amount="↑ ₹5,200.0" />
                    <PastelWaveCard variant="steel" title="Tax Reserve" amount="₹1,120.0" />
                  </div>

                  <SegmentedLiquiditySlider safeCash="₹3,730.0" safePercent={65} taxPercent={23} expensePercent={12} variant="sky" />
                  
                  <HatchedBenchmarkBarChart variant="sky" />

                  <MultiPlatformDonutGauge />
                </div>
              )}

              {/* TAB 3: ACCOUNTS / PLATFORMS */}
              {activeTab === 'accounts' && (
                <div className="space-y-4 px-4 pb-24 animate-fadeIn">
                  <div className="flex items-center justify-between py-2">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Connected Accounts</h1>
                    <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">4 Active</span>
                  </div>

                  <PlatformSwitcherTabs variant="sky" />

                  <ShiftCalendarStrip variant="sky" />

                  <FeeBreakdownPopover />

                  <PlatformConnectionCard onConnect={() => showToast('New Account', 'Platform connection bridge initiated.', 'info')} />
                </div>
              )}

              {/* TAB 4: MORE & SETTINGS */}
              {activeTab === 'more' && (
                <div className="space-y-4 px-4 pb-24 animate-fadeIn">
                  <div className="flex items-center justify-between py-2">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">More & Settings</h1>
                    <span className="text-xs font-bold text-sky-500 font-mono">Q3 2024</span>
                  </div>

                  {/* USER SUMMARY CARD */}
                  <div className="p-4 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : currentUser.name || 'Earner'}
                        </h2>
                        <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* TAX VAULT QUICK SUMMARY */}
                  <TaxLiabilityCard liabilityAmount="₹1,120.0" variant="coral" />
                  <TaxWaterfallFlow variant="coral" />

                  {/* PREFERENCES LIST */}
                  <div className="rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-3 shadow-sm space-y-1">
                    
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</span>
                      </div>
                      <ThemeToggleSwitch isDarkMode={isDarkMode} onToggle={toggleTheme} />
                    </div>

                    {/* AI Agent Review */}
                    <div 
                      onClick={() => setIsDiffOpen(true)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Diff Review (1 Pending)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">1</span>
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

            {/* FLOATING BOTTOM NAVIGATION DOCK WITH CENTRAL '+' FAB */}
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

      {/* 1-Tap Diff Approval Modal */}
      <DiffInspectorModal 
        isOpen={isDiffOpen} 
        onClose={() => setIsDiffOpen(false)} 
        onApprove={() => {
          setIsDiffOpen(false);
          showToast('1-Tap Diff Approved', 'Shell ₹42.50 logged under Schedule C. ₹11.50 tax saved.', 'success');
        }} 
      />

      {/* Global Toast Notification */}
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
