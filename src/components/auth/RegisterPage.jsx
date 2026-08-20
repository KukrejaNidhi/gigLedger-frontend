import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GitLedgersLogo } from './GitLedgersLogo.jsx';
import { OtpVerification } from './OtpVerification.jsx';
import { storage } from '../../utils/storage.js';
import { authApi } from '../../services/authApi.js';

/**
 * GigLedger Registration Page
 * Mobile-First, fully responsive on all screen sizes (iPhone 12 Pro, Android, iPad, Desktop)
 */
export const RegisterPage = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onShowToast,
  className = '',
}) => {
  const [step, setStep] = useState(1); // 1 = Details, 2 = 2FA OTP
  const [pendingSessionId, setPendingSessionId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      const firstErrorMsg = 
        errors.firstName || errors.lastName || errors.email || 'Please fill in all required fields.';
      if (onShowToast) {
        onShowToast('Incomplete Form', firstErrorMsg, 'alert');
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });

      const sessionId = response?.data?.pendingSessionId || response?.pendingSessionId || '';
      setPendingSessionId(sessionId);

      storage.setRememberedEmail(formData.email.trim());
      setStep(2);

      if (onShowToast) {
        onShowToast(
          'Verification Code Sent',
          response?.message || 'A 6-digit OTP has been sent to your email.',
          'info'
        );
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check your details.';
      if (onShowToast) {
        onShowToast('Registration Failed', msg, 'alert');
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
        onShowToast('Verification Failed', err, 'alert');
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyRegistration({
        pendingSessionId,
        code: otpCode,
      });

      const token = response?.data?.token || response?.token;
      let user = response?.data?.user || response?.user;

      if (!user) {
        const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
        user = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          name: fullName,
          email: formData.email.trim(),
          role: 'Independent Earner',
        };
      }

      storage.setAuthSession(user, token);
      storage.setRememberedEmail(formData.email.trim());

      const displayName = user.firstName || formData.firstName.trim();
      if (onShowToast) {
        onShowToast(
          'Account Verified',
          `Welcome to gigLedgers, ${displayName}!`,
          'success'
        );
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(user);
      }
    } catch (err) {
      const msg = err.message || 'Invalid or expired verification code.';
      setOtpError(msg);
      if (onShowToast) {
        onShowToast('Verification Failed', msg, 'alert');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingSessionId) {
      handleDetailsSubmit();
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
    <div className={`w-full min-h-screen flex flex-col justify-between px-6 py-8 sm:px-8 bg-white dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 select-none transition-colors ${className}`}>
      
      {/* 1. TOP HEADER: BACK ARROW & CENTERED LOGO */}
      <div className="pt-6 sm:pt-10 pb-4 relative flex items-center justify-center w-full">
        <button
          type="button"
          onClick={step === 2 ? () => {
            setStep(1);
            setPendingSessionId('');
            setOtpError('');
          } : onNavigateToLogin}
          className="absolute left-0 w-10 h-10 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:border-sky-500 dark:hover:border-sky-400 transition active:scale-95"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <GitLedgersLogo size="lg" showTagline={false} />
      </div>

      {/* 2. MAIN FORM CONTAINER */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
        
        {/* STEP 1: SIGN UP DETAILS */}
        {step === 1 && (
          <div className="w-full space-y-5 animate-fadeIn">
            
            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create your Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your info to start managing your earnings
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleDetailsSubmit} className="space-y-3.5">
              
              {/* First Name */}
              <div className="space-y-1">
                <div className="w-full bg-slate-50 dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm transition-all focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:bg-white dark:focus-within:bg-[#161B22] focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="w-full px-4 py-3.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white rounded-2xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <div className="w-full bg-slate-50 dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm transition-all focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:bg-white dark:focus-within:bg-[#161B22] focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-4 py-3.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white rounded-2xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="w-full bg-slate-50 dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-[#30363D] shadow-sm transition-all focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:bg-white dark:focus-within:bg-[#161B22] focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white rounded-2xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.email}</p>
                )}
              </div>

              {/* Action Button: Electric Sky Blue */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Requesting Code...</span>
                  ) : (
                    <span>Sign up</span>
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
            actionLabel="Complete Registration"
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

      {/* 3. FOOTER: LINK TO SIGN IN */}
      <div className="pt-6 pb-2 text-center text-xs sm:text-sm">
        <span className="text-slate-400 dark:text-slate-500">Already have an account? </span>
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          Sign in
        </button>
      </div>

    </div>
  );
};
