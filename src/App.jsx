import React, { useState } from 'react';
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
} from './components/index.js';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('app');
  const [activeDashboard, setActiveDashboard] = useState('command');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      showToast('Obsidian Dark Mode Active', 'Refined non-neon matte slate theme engaged.', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      showToast('Solar Minimal Light Mode Active', 'Clean white canvas with solar yellow palette.', 'info');
    }
  };

  const showToast = (title, message, type = 'info') => {
    setToast({ open: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} font-sans p-2 sm:p-6 flex flex-col items-center transition-colors duration-300`}>
      
      {/* Top Controller Bar */}
      <header className="w-full max-w-6xl mb-6 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-300 text-slate-950 flex items-center justify-center font-extrabold text-base shadow-sm">
            GL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">GitLedgers React-JS Suite</h1>
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 text-[10px] font-bold uppercase tracking-wider border border-yellow-200 dark:border-yellow-800/60">
                32 Components Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Zero hardcoded colors · Mobile-first · React-JS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setViewMode('app')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'app' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            📱 Mobile App View
          </button>
          <button 
            onClick={() => setViewMode('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'gallery' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            🧩 Component Gallery (32)
          </button>
          <ThemeToggleSwitch isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </header>

      {/* VIEW 1: Mobile Simulator View */}
      {viewMode === 'app' ? (
        <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center">
          
          {/* Left: 3-Dashboard Navigator */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dashboard Switcher</div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => setActiveDashboard('command')}
                  className={`text-left p-3 rounded-2xl font-bold flex items-center justify-between transition ${activeDashboard === 'command' ? 'bg-yellow-300 text-slate-950 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <span>1. Financial Command</span>
                  <span className="text-[10px] font-mono opacity-80">Solar Wave</span>
                </button>
                <button
                  onClick={() => setActiveDashboard('platforms')}
                  className={`text-left p-3 rounded-2xl font-bold flex items-center justify-between transition ${activeDashboard === 'platforms' ? 'bg-yellow-300 text-slate-950 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <span>2. Multi-Platform Hub</span>
                  <span className="text-[10px] font-mono opacity-80">Inflow</span>
                </button>
                <button
                  onClick={() => setActiveDashboard('taxvault')}
                  className={`text-left p-3 rounded-2xl font-bold flex items-center justify-between transition ${activeDashboard === 'taxvault' ? 'bg-yellow-300 text-slate-950 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <span>3. Explainable Tax Vault</span>
                  <span className="text-[10px] font-mono opacity-80">RAG Math</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs shadow-sm">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Autonomous Agentic Diff</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Trigger live 1-Tap Before/After Diff modal for $42.50 Shell fuel receipt.</p>
              <SolarActionButton label="⚡ Review 1 Agent Proposal" onClick={() => setIsDiffOpen(true)} />
            </div>
          </div>

          {/* Center Phone Frame */}
          <div className="relative w-[390px] h-[834px] bg-slate-900 dark:bg-black rounded-[52px] p-[10px] shadow-[0_20px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-[4px] border-slate-300 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-[42px] overflow-hidden flex flex-col justify-between select-none">
              
              {/* Dynamic Island Status Bar */}
              <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-7 pt-3 pb-1 text-xs font-semibold pointer-events-none text-slate-900 dark:text-white">
                <span>9:41</span>
                <div className="w-24 h-6 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-[9px] text-slate-300 font-mono">Agent</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* DASHBOARD 1: COMMAND */}
              {activeDashboard === 'command' && (
                <div className="flex-1 overflow-y-auto no-scrollbar pt-14 px-5 pb-24 space-y-4">
                  <HeroCommandHeader 
                    userName="Alton" 
                    balance="$4,850.00" 
                    onNotificationClick={() => showToast('Approaching Q3 Tax Deadline', 'Due September 15. Reserve ready: $1,120.00', 'alert')} 
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <PastelWaveCard variant="sky" title="Gross Inflow" amount="↑ $5,200.00" />
                    <PastelWaveCard variant="yellow" title="Tax Reserve" amount="$1,120.00" />
                  </div>

                  <SegmentedLiquiditySlider safeCash="$3,730.00" safePercent={65} taxPercent={23} expensePercent={12} variant="sky" />

                  <AgentStatusPill 
                    summaryText="Shell Gas $42.50 · Matched Uber shift" 
                    onReviewClick={() => setIsDiffOpen(true)} 
                    variant="coral"
                  />

                  <HatchedBenchmarkBarChart variant="sky" />

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Recent Activity</div>
                    <TransactionItemRow platformName="Uber Driver Direct Deposit" amount="+$1,120.00" isIncome={true} logoLetter="UBER" />
                    <TransactionItemRow platformName="Shell Gas Station #2041" amount="-$42.50" isIncome={false} tagText="Sched C" logoLetter="GAS" />
                  </div>
                </div>
              )}

              {/* DASHBOARD 2: PLATFORMS */}
              {activeDashboard === 'platforms' && (
                <div className="flex-1 overflow-y-auto no-scrollbar pt-14 px-5 pb-24 space-y-4">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveDashboard('command')} className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500">←</button>
                    <h2 className="text-sm font-bold">Multi-Platform Inflow</h2>
                    <div className="w-8"></div>
                  </div>

                  <PlatformSwitcherTabs variant="yellow" />

                  <ShiftCalendarStrip variant="sky" />

                  <MultiPlatformDonutGauge />

                  <FeeBreakdownPopover />

                  <PlatformConnectionCard onConnect={() => showToast('Connecting New API', 'Instacart OAuth bridge initiated.', 'info')} />
                </div>
              )}

              {/* DASHBOARD 3: TAX VAULT */}
              {activeDashboard === 'taxvault' && (
                <div className="flex-1 overflow-y-auto no-scrollbar pt-14 px-5 pb-24 space-y-4">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveDashboard('command')} className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500">←</button>
                    <h2 className="text-sm font-bold">Explainable Tax Vault</h2>
                    <span className="text-xs font-bold text-sky-500 font-mono">Q3 2024</span>
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

              {/* Bottom Nav Dock */}
              <BottomNavigationDock 
                activeTab={activeDashboard} 
                onTabChange={(tab) => {
                  if (tab === 'agent') setIsDiffOpen(true);
                  else setActiveDashboard(tab);
                }} 
              />

            </div>
          </div>

        </main>
      ) : (
        /* VIEW 2: 32-COMPONENT REFERENCE GALLERY */
        <section className="w-full max-w-6xl space-y-8 pb-12">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">32 Custom React-JS Components Reference</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each component below is live, responsive, and accepts custom <code className="text-sky-500 font-mono">variant</code>, <code className="text-sky-500 font-mono">className</code>, and spread props.
            </p>
          </div>

          {/* Section 1: Charts */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Financial Visualizations & Charts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <HatchedBenchmarkBarChart variant="sky" />
              <TorusHaloDial variant="sky" />
              <SegmentedLiquiditySlider variant="sky" />
              <PastelWaveCard variant="sky" title="Gross Inflow Wave" amount="$5,200.00" />
              <MultiPlatformDonutGauge />
              <TaxWaterfallFlow variant="coral" />
            </div>
          </div>

          {/* Section 2: Hero & Bento */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Hero & Metric Bento Containers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <HeroCommandHeader userName="Sarah" balance="$5,120.00" />
              <MetricBentoGrid />
              <ShiftCalendarStrip variant="yellow" />
            </div>
          </div>

          {/* Section 3: Agentic AI */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">3. Agentic AI & Human-in-the-Loop</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AgentStatusPill onReviewClick={() => setIsDiffOpen(true)} variant="coral" />
              <AgentSubtaskRail />
            </div>
          </div>

          {/* Section 4: Scanner & Documents */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">4. Receipt Intelligence & Scanner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CameraViewfinderOverlay />
              <ExtractedEntityCard onConfirm={() => showToast('Receipt Saved', '$42.50 added to ledger.', 'success')} />
              <DeductionQuickAdder onSelectCategory={(c) => showToast('Category Selected', `Classified under ${c}`, 'info')} />
            </div>
          </div>

        </section>
      )}

      {/* 1-Tap Diff Approval Modal */}
      <DiffInspectorModal 
        isOpen={isDiffOpen} 
        onClose={() => setIsDiffOpen(false)} 
        onApprove={() => {
          setIsDiffOpen(false);
          showToast('1-Tap Diff Approved', 'Shell $42.50 logged under Schedule C. $11.50 tax saved.', 'success');
        }} 
      />

      {/* Toast Alert */}
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
