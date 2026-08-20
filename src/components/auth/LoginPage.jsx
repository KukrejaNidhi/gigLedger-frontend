import React, { useState, useEffect } from 'react';
import { GitLedgersLogo } from './GitLedgersLogo.jsx';
import { OtpVerification } from './OtpVerification.jsx';
import { storage } from '../../utils/storage.js';

/**
 * GitLedgers Login Page
 * Styled strictly with Electric Sky Blue (#38BDF8 / #0EA5E9), Obsidian (#0D1117), & Solar Canvas (#F8FAFC)
 */
export const LoginPage = ({
  onLoginSuccess,
  onNavigateToRegister,
  onShowToast,
  className = '',
}) => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = 2FA OTP
  const [email, setEmail] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered email
  useEffect(() => {
    const saved = storage.getRememberedEmail();
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return 'Please enter your email address.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleEmailSubmit = (e) => {
    if (e) e.preventDefault();
    setEmailError('');

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      if (onShowToast) {
        onShowToast('Validation Error', error, 'alert');
      }
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (rememberEmail) {
        storage.setRememberedEmail(email.trim());
      } else {
        storage.setRememberedEmail('');
      }

      setStep(2);
      if (onShowToast) {
        onShowToast(
          'Verification Code Sent',
          'A 6-digit security code was dispatched to your email.',
          'info'
        );
      }
    }, 400);
  };

  const handleOtpVerify = (otpCode) => {
    setOtpError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        const err = 'Please enter a valid 6-digit verification code.';
        setOtpError(err);
        if (onShowToast) {
          onShowToast('Authentication Failed', err, 'alert');
        }
        return;
      }

      const rawName = email.split('@')[0] || 'Earner';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const userSession = {
        email: email.trim(),
        name: formattedName,
        role: 'Independent Earner',
        token: `gl_sess_${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
      };

      storage.setAuthSession(userSession, userSession.token);

      if (onShowToast) {
        onShowToast(
          'Welcome Back',
          `Successfully signed in as ${formattedName}.`,
          'success'
        );
      }

      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      }
    }, 550);
  };

  const handleResendOtp = () => {
    if (onShowToast) {
      onShowToast(
        'New Code Sent',
        'A fresh 6-digit OTP was dispatched to your email.',
        'info'
      );
    }
  };

  const handleSocialClick = (provider) => {
    const demoEmail = provider === 'Google' ? 'sarah.google@gitledgers.io' : 'alex.auth@gitledgers.io';
    setEmail(demoEmail);
    if (onShowToast) {
      onShowToast(`${provider} Sign In`, `Pre-filled demo account. Click Sign in to receive 2FA code.`, 'info');
    }
  };

  return (
    <div className={`w-full max-w-sm sm:max-w-md mx-auto min-h-screen bg-[#F8FAFC] dark:bg-[#0D1117] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-6 sm:p-8 select-none transition-colors ${className}`}>

      {/* TOP HEADER: CENTERED LOGO */}
      <div className="pt-10 pb-6 flex justify-center">
        <GitLedgersLogo size="lg" showTagline={false} />
      </div>

      {/* MAIN FORM AREA */}
      <div className="flex-1 flex flex-col justify-center my-auto space-y-6">

        {/* STEP 1: EMAIL ENTRY */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">

            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                Login to your Account
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">

              {/* Email Input Field */}
              <div className="space-y-1.5">
                <div className="bg-white dark:bg-[#161B22] rounded-xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm transition focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Email"
                    className="w-full px-4 py-3.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 pl-1">{emailError}</p>
                )}
              </div>

              {/* Action Button: Electric Sky Blue */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-extrabold text-sm shadow-md shadow-sky-500/20 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Signing In...</span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>

            </form>

            {/* Social Auth Providers */}


          </div>
        )}

        {/* STEP 2: 2FA OTP VERIFICATION */}
        {step === 2 && (
          <OtpVerification
            title="Verification"
            subtitle="Enter the 6-digit security code sent to your email"
            actionLabel="Verify & Enter Dashboard"
            onVerify={handleOtpVerify}
            onResend={handleResendOtp}
            onChangeEmail={() => setStep(1)}
            isLoading={isLoading}
            errorMessage={otpError}
          />
        )}

      </div>

      {/* FOOTER LINK: "Don't have an account? Sign up" */}
      <div className="pt-6 pb-4 text-center text-xs">
        <span className="text-slate-400 dark:text-slate-500">Don't have an account? </span>
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          Sign up
        </button>
      </div>

    </div>
  );
};
