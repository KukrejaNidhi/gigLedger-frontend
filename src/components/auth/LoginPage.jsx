import React, { useState, useEffect } from 'react';
import { GitLedgersLogo } from './GitLedgersLogo.jsx';
import { OtpVerification } from './OtpVerification.jsx';
import { storage } from '../../utils/storage.js';
import { authApi } from '../../services/authApi.js';

/**
 * GigLedger Login Page
 * Fully integrated with backend passwordless email-OTP endpoints:
 * - POST /api/auth/login -> returns pendingSessionId
 * - POST /api/auth/login/verify -> verifies OTP code and returns token + user
 * - POST /api/auth/resend-otp -> resends OTP code
 */
export const LoginPage = ({
  onLoginSuccess,
  onNavigateToRegister,
  onShowToast,
  className = '',
}) => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = 2FA OTP
  const [email, setEmail] = useState('');
  const [pendingSessionId, setPendingSessionId] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered email on mount
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

  const handleEmailSubmit = async (e) => {
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

    try {
      const response = await authApi.login({ email: email.trim() });
      const sessionId = response?.data?.pendingSessionId || response?.pendingSessionId || '';
      
      setPendingSessionId(sessionId);

      if (rememberEmail) {
        storage.setRememberedEmail(email.trim());
      } else {
        storage.setRememberedEmail('');
      }

      setStep(2);
      if (onShowToast) {
        onShowToast(
          'Verification Code Sent',
          response?.message || 'A 6-digit security code was dispatched to your email.',
          'info'
        );
      }
    } catch (err) {
      const msg = err.message || 'Failed to request login verification code.';
      setEmailError(msg);
      if (onShowToast) {
        onShowToast('Login Failed', msg, 'alert');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otpCode) => {
    setOtpError('');

    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      const err = 'Please enter a valid 6-digit verification code.';
      setOtpError(err);
      if (onShowToast) {
        onShowToast('Authentication Failed', err, 'alert');
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyLogin({
        pendingSessionId,
        code: otpCode,
      });

      const token = response?.data?.token || response?.token;
      let user = response?.data?.user || response?.user;

      if (!user) {
        const rawName = email.split('@')[0] || 'Earner';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        user = {
          email: email.trim(),
          firstName: formattedName,
          name: formattedName,
          role: 'Independent Earner',
        };
      }

      // Persist session token and user details
      storage.setAuthSession(user, token);

      const displayName = user.firstName || user.name || user.email;
      if (onShowToast) {
        onShowToast(
          'Welcome Back',
          `Successfully signed in as ${displayName}.`,
          'success'
        );
      }

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      const msg = err.message || 'Invalid or expired verification code.';
      setOtpError(msg);
      if (onShowToast) {
        onShowToast('Authentication Failed', msg, 'alert');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingSessionId) {
      // Re-trigger login if session id is missing
      handleEmailSubmit();
      return;
    }

    try {
      const response = await authApi.resendOtp({ pendingSessionId });
      if (response?.data?.pendingSessionId) {
        setPendingSessionId(response.data.pendingSessionId);
      }
      if (onShowToast) {
        onShowToast(
          'New Code Sent',
          response?.message || 'A fresh 6-digit OTP was dispatched to your email.',
          'info'
        );
      }
    } catch (err) {
      const msg = err.message || 'Unable to resend OTP. Please try again.';
      if (onShowToast) {
        onShowToast('Resend Failed', msg, 'alert');
      }
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
                    <span>Requesting Code...</span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>

            </form>

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
            onChangeEmail={() => {
              setStep(1);
              setPendingSessionId('');
              setOtpError('');
            }}
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
