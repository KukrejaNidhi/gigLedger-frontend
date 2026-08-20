import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

/**
 * 6-Digit 2FA OTP Verification Component
 * Features:
 * - Mobile-First responsive sizing (h-16 sm:h-20)
 * - Subtitle: "Enter the 6-digit security code sent to your email"
 * - Electric Sky Blue Palette & zero yellow
 */
export const OtpVerification = ({
  title = 'Verification',
  subtitle = 'Enter the 6-digit security code sent to your email',
  actionLabel = 'Verify & Proceed',
  onVerify,
  onResend,
  onChangeEmail,
  isLoading = false,
  errorMessage = '',
  className = '',
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [hasShaked, setHasShaked] = useState(false);

  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendSeconds > 0) {
      const timer = setTimeout(() => {
        setResendSeconds(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendSeconds]);

  // Trigger error shake animation when errorMessage changes
  useEffect(() => {
    if (errorMessage) {
      setHasShaked(true);
      const timer = setTimeout(() => setHasShaked(false), 600);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChange = (index, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');

    if (sanitized.length > 1) {
      handlePasteDirect(sanitized);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = sanitized;
    setDigits(newDigits);

    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (sanitized && index === 5 && newDigits.every(d => d !== '')) {
      const fullOtp = newDigits.join('');
      if (onVerify) {
        onVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    handlePasteDirect(pastedData);
  };

  const handlePasteDirect = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
    if (!numbersOnly) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < numbersOnly.length; i++) {
      newDigits[i] = numbersOnly[i];
    }
    setDigits(newDigits);

    const focusIdx = Math.min(numbersOnly.length, 5);
    inputRefs.current[focusIdx]?.focus();

    if (numbersOnly.length === 6 && onVerify) {
      onVerify(numbersOnly);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const fullOtp = digits.join('');
    if (onVerify) {
      onVerify(fullOtp);
    }
  };

  const handleResendClick = () => {
    if (!canResend) return;
    setDigits(['', '', '', '', '', '']);
    setResendSeconds(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    if (onResend) {
      onResend();
    }
  };

  const isComplete = digits.every(d => d !== '');

  return (
    <div className={`w-full space-y-6 select-none animate-fadeIn ${className}`}>
      
      {/* Title & Simplified Subtitle */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
        {onChangeEmail && (
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-block mt-1"
          >
            Change email address
          </button>
        )}
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-1">
        
        {/* 6 TALL Digit Input Cards */}
        <div className={`flex justify-between items-center gap-2 sm:gap-2.5 ${hasShaked ? 'animate-bounce' : ''}`}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`w-11 sm:w-13 h-16 sm:h-20 text-center text-2xl sm:text-3xl font-extrabold font-mono rounded-2xl border transition-all outline-none focus:ring-2 shadow-sm ${
                errorMessage
                  ? 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 focus:ring-rose-400'
                  : digit
                  ? 'border-sky-500 dark:border-sky-400 bg-sky-50/50 dark:bg-sky-950/30 text-slate-900 dark:text-white focus:ring-sky-500/30'
                  : 'border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white focus:bg-white focus:border-sky-500 focus:ring-sky-500/30 dark:focus:border-sky-400 dark:focus:ring-sky-400/30'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="text-center text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 py-2.5 px-3 rounded-2xl border border-rose-200 dark:border-rose-800/60">
            {errorMessage}
          </div>
        )}

        {/* Action Button: Electric Sky Blue */}
        <button
          type="submit"
          disabled={!isComplete || isLoading}
          className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              {actionLabel} <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        {/* Resend OTP */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1 px-1">
          <span className="text-slate-400">Didn't receive the code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend OTP
            </button>
          ) : (
            <span className="font-mono text-slate-500 dark:text-slate-400">
              Resend in <strong className="text-slate-800 dark:text-slate-200 font-bold">{resendSeconds}s</strong>
            </span>
          )}
        </div>

      </form>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-[#30363D]">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>End-to-End Encrypted</span>
      </div>

    </div>
  );
};
