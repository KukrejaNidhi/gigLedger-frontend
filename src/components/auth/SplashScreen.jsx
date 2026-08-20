import React, { useEffect, useState } from 'react';

/**
 * Liquid Logo Loader Splash Screen
 * Inspired by the reference animation (Quik logo loader):
 * - Light Mode by default (#FFFFFF / #F8FAFC)
 * - Muted outline / ghost silhouette of "gigLedgers"
 * - Undulating liquid wave fill rising from bottom to top
 * - Elastic spring pulse upon complete fill
 * - Smooth transition into the login screen
 */
export const SplashScreen = ({
  isDarkMode = false,
  onComplete,
  duration = 2400,
}) => {
  const [fadeout, setFadeout] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Liquid fill completes around 1.8s
    const fillTimer = setTimeout(() => {
      setIsFilled(true);
    }, 1800);

    const endTimer = setTimeout(() => {
      setFadeout(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 400);
    }, duration);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(endTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      onClick={() => onComplete && onComplete()}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between min-h-screen w-full p-8 cursor-pointer select-none overflow-hidden transition-all duration-400 ${
        isDarkMode
          ? 'bg-[#0D1117] text-white'
          : 'bg-white text-slate-900'
      } ${fadeout ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
      {/* Top spacing */}
      <div className="h-12"></div>

      {/* CENTER: LIQUID WAVE LOGO LOADER */}
      <div className="relative flex flex-col items-center justify-center space-y-6">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-logo-glow"></div>

        {/* 1. Geometric Emblem with rising spring-up */}
        <div className={`relative flex items-center justify-center transition-all duration-700 ${isFilled ? 'scale-110' : 'scale-100'}`}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/40 dark:to-slate-900 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm"
            >
              <defs>
                <linearGradient id="splash-sky-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>
              <circle cx="33" cy="15" r="4" fill="#38BDF8" />
              <circle cx="33" cy="33" r="4" fill="#0284C7" />
              <circle cx="15" cy="24" r="5" fill="#06B6D4" />
              <path
                d="M15 24 C 22 24, 25 15, 33 15"
                stroke="url(#splash-sky-grad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M15 24 C 22 24, 25 33, 33 33"
                stroke="url(#splash-sky-grad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="24,19 28,24 24,29 20,24" fill="#0284C7" opacity="0.9" />
            </svg>
          </div>
        </div>

        {/* 2. Layered Liquid Fill Wordmark: "gigLedgers" */}
        <div className="relative select-none font-sans font-black text-4xl sm:text-5xl tracking-tight text-center">
          
          {/* BASE GHOST OUTLINE (Visible initially like in Quik logo loader) */}
          <div className="text-slate-200 dark:text-slate-800 transition-colors">
            <span>gig</span>
            <span>Ledgers</span>
          </div>

          {/* RISING LIQUID WAVE LAYER (Fills smoothly from bottom to top) */}
          <div className="absolute inset-0 animate-liquid-fill pointer-events-none">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>gig</span>
            <span className="text-sky-500 dark:text-sky-400">Ledgers</span>
          </div>

        </div>

        {/* 3. Subtitle Tagline */}
        <div className="pt-2 animate-fadeIn">
          <span className="text-xs font-mono font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
            Autonomous Financial Command
          </span>
        </div>

      </div>

      {/* BOTTOM SUBTLE LOADING BAR */}
      <div className="w-full max-w-[140px] pb-10 flex flex-col items-center space-y-2">
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all duration-1800 ease-out" style={{ width: isFilled ? '100%' : '85%' }}></div>
        </div>
      </div>

    </div>
  );
};
