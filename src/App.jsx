import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
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
  CameraViewfinderOverlay,
  ExtractedEntityCard,
  DeductionQuickAdder,
  SolarActionButton,
  StandardToastNotification,
  ThemeToggleSwitch,
  BottomNavigationDock,
  GitLedgersLogo,
  SplashScreen,
  LoginPage,
  RegisterPage,
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
  const [activeDashboard, setActiveDashboard] = useState('command'); // 'command' | 'platforms' | 'taxvault'
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

  // Optionally refresh existing session token with backend on mount
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
        showToast('Obsidian Dark Mode', 'Refined matte slate theme engaged.', 'info');
      } else {
        showToast('Solar Minimal Light Mode', 'Clean white canvas with electric sky palette.', 'info');
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
    showToast('Signed Out', `Goodbye ${userName}. Your 2FA session has been securely ended.`, 'info');
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark bg-[#0D1117] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'} font-sans p-0 m-0 flex flex-col items-center justify-start transition-colors duration-300`}>
      
      {/* 1. OPENING BOOTING SPLASH SCREEN (Dynamic Theme & Kinetic Typography Bouncing) */}
      {showSplash && (
        <SplashScreen
          isDarkMode={isDarkMode}
          onComplete={() => setShowSplash(false)}
          duration={2200}
        />
      )}

      {/* 2. MAIN APP CONTENT (MOBILE-FIRST EDGE-TO-EDGE) */}
      <main className="w-full max-w-md mx-auto min-h-screen flex flex-col p-0 m-0">
        
        {/* VIEW 1: AUTHENTICATION FLOW (LANDS ON LOGIN PAGE BY DEFAULT) */}
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
          /* VIEW 2: AUTHENTICATED MOBILE APP DASHBOARD */
          <div className="w-full min-h-screen p-4 pb-20 space-y-4 animate-fadeIn bg-[#F8FAFC] dark:bg-[#0D1117]">
            
            {/* App Internal Header with User Profile, Theme Switcher & Logout */}
            <div className="w-full bg-white dark:bg-[#161B22] p-3.5 rounded-2xl border border-[#E2E8F0] dark:border-[#30363D] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <GitLedgersLogo size="sm" showTagline={false} />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.firstName || currentUser.name || 'Active'}</span>
                </div>
                <ThemeToggleSwitch isDarkMode={isDarkMode} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs in Sky Blue */}
            <div className="w-full bg-white dark:bg-[#161B22] p-1.5 rounded-2xl border border-[#E2E8F0] dark:border-[#30363D] flex items-center justify-between gap-1 text-xs shadow-sm overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveDashboard('command')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap text-center transition ${
                  activeDashboard === 'command'
                    ? 'bg-sky-500 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                1. Command
              </button>
              <button
                onClick={() => setActiveDashboard('platforms')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap text-center transition ${
                  activeDashboard === 'platforms'
                    ? 'bg-sky-500 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                2. Inflow
              </button>
              <button
                onClick={() => setActiveDashboard('taxvault')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap text-center transition ${
                  activeDashboard === 'taxvault'
                    ? 'bg-sky-500 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                3. Tax Vault
              </button>
            </div>

            {/* DASHBOARD 1: FINANCIAL COMMAND */}
            {activeDashboard === 'command' && (
              <div className="space-y-4 animate-fadeIn">
                <HeroCommandHeader 
                  userName={currentUser.firstName || currentUser.name || 'Earner'} 
                  balance="$4,850.00" 
                  onNotificationClick={() => showToast('Approaching Q3 Tax Deadline', 'Due September 15. Reserve ready: $1,120.00', 'alert')} 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <PastelWaveCard variant="sky" title="Gross Inflow" amount="↑ $5,200.00" />
                  <PastelWaveCard variant="steel" title="Tax Reserve" amount="$1,120.00" />
                </div>

                <SegmentedLiquiditySlider safeCash="$3,730.00" safePercent={65} taxPercent={23} expensePercent={12} variant="sky" />

                <AgentStatusPill 
                  summaryText="Shell Gas $42.50 · Matched Uber shift" 
                  onReviewClick={() => setIsDiffOpen(true)} 
                  variant="coral"
                />

                <HatchedBenchmarkBarChart variant="sky" />

                <div className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#30363D] space-y-2.5 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Transactions</div>
                  <TransactionItemRow platformName="Uber Driver Direct Deposit" amount="+$1,120.00" isIncome={true} logoLetter="UBER" />
                  <TransactionItemRow platformName="Shell Gas Station #2041" amount="-$42.50" isIncome={false} tagText="Sched C" logoLetter="GAS" />
                </div>
              </div>
            )}

            {/* DASHBOARD 2: PLATFORMS / INFLOW */}
            {activeDashboard === 'platforms' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm">
                  <h2 className="text-sm font-bold">Multi-Platform Inflow Hub</h2>
                  <span className="text-xs font-mono font-bold text-[#38BDF8]">Live Sync</span>
                </div>

                <PlatformSwitcherTabs variant="sky" />

                <ShiftCalendarStrip variant="sky" />

                <MultiPlatformDonutGauge />

                <FeeBreakdownPopover />

                <PlatformConnectionCard onConnect={() => showToast('Connecting New API', 'Instacart OAuth bridge initiated.', 'info')} />
              </div>
            )}

            {/* DASHBOARD 3: TAX VAULT */}
            {activeDashboard === 'taxvault' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm">
                  <h2 className="text-sm font-bold">Explainable Tax Vault</h2>
                  <span className="text-xs font-bold text-[#38BDF8] font-mono">Q3 2024</span>
                </div>

                <TaxLiabilityCard liabilityAmount="$1,120.00" variant="coral" />

                <TaxWaterfallFlow variant="coral" />

                <QuarterlyHorizonTimeline variant="sky" />

                <RAGAuthorityDrawer variant="steel" />

                <div className="flex justify-between items-center px-1">
                  <DeductionCategoryChip scheduleLine="Line 9" categoryName="Vehicle & Fuel" variant="olive" />
                  <AuditTrailStamp ruleId="IRS-IRC-162A" />
                </div>
              </div>
            )}

            {/* Floating Mobile Bottom Dock */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNavigationDock 
                activeTab={activeDashboard} 
                onTabChange={(tab) => {
                  if (tab === 'agent') setIsDiffOpen(true);
                  else setActiveDashboard(tab);
                }} 
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
          showToast('1-Tap Diff Approved', 'Shell $42.50 logged under Schedule C. $11.50 tax saved.', 'success');
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
