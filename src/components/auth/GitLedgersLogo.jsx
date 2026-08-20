import React from 'react';

/**
 * Premium Visually Appealing gigLedgers Logo
 * Features:
 * - Geometric 3D isometric commit cube / interlocking ledger nodes
 * - Electric Sky Blue (#38BDF8) & Cyan (#06B6D4) gradients
 * - Sleek typography: "gigLedgers"
 * - Completely zero yellow!
 */
export const GitLedgersLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = false,
  isWhite = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-xl', badge: 'text-[9px]' },
    md: { icon: 34, text: 'text-2xl', badge: 'text-[10px]' },
    lg: { icon: 42, text: 'text-3xl', badge: 'text-[11px]' },
    xl: { icon: 52, text: 'text-4xl', badge: 'text-xs' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      
      {/* GEOMETRIC EMBLEM: Interlocking Git Branch & Vault Prism */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        
        {/* Ambient Back Glow */}
        <div className="absolute inset-0 bg-sky-500/20 rounded-2xl blur-md"></div>

        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          <defs>
            <linearGradient id="gl-sky-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            
            <linearGradient id="gl-cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <linearGradient id="gl-shield-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Rounded Squircle Outer Frame */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="url(#gl-shield-bg)"
            stroke="url(#gl-sky-grad)"
            strokeWidth="1.75"
          />

          {/* Interlocking Git Ledger Nodes */}
          {/* Node 1: Top Right Branch */}
          <circle cx="33" cy="15" r="4" fill="#38BDF8" />
          
          {/* Node 2: Bottom Right Branch */}
          <circle cx="33" cy="33" r="4" fill="#0284C7" />

          {/* Node 3: Left Main Root Node */}
          <circle cx="15" cy="24" r="5" fill="#06B6D4" />

          {/* Connecting Branch Bezier Paths */}
          <path
            d="M15 24 C 22 24, 25 15, 33 15"
            stroke="url(#gl-cyan-glow)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          <path
            d="M15 24 C 22 24, 25 33, 33 33"
            stroke="url(#gl-sky-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Central Diamond Ledger Core */}
          <polygon
            points="24,19 28,24 24,29 20,24"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* TYPOGRAPHY: "gigLedgers" */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-sans">
          <span className={`font-black tracking-tight ${isWhite ? 'text-white' : 'text-slate-900 dark:text-white'} ${current.text}`}>
            gig<span className="text-sky-500 dark:text-sky-400 font-extrabold">Ledgers</span>
          </span>
        </div>

        {showTagline && (
          <span className={`font-mono uppercase font-bold tracking-widest ${isWhite ? 'text-sky-200' : 'text-slate-400 dark:text-slate-500'} ${current.badge}`}>
            Autonomous Ledger
          </span>
        )}
      </div>

    </div>
  );
};
