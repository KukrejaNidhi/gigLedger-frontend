import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GitLedgersLogo } from './GitLedgersLogo.jsx';
import { OtpVerification } from './OtpVerification.jsx';
import { SocialAuthButtons } from './SocialAuthButtons.jsx';
import { storage } from '../../utils/storage.js';

/**
 * GitLedgers Registration Page
 * Styled strictly with Electric Sky Blue (#38BDF8 / #0EA5E9), Obsidian (#0D1117), & Solar Canvas (#F8FAFC)
 */
export const RegisterPage = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onShowToast,
  className = '',
}) => {
  const [step, setStep] = useState(1); // 1 = Details, 2 = 2FA OTP
  
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

  const handleDetailsSubmit = (e) => {
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

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      if (onShowToast) {
        onShowToast(
          'Verification Code Sent',
          'A 6-digit OTP has been sent to your email.',
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
          onShowToast('Verification Failed', err, 'alert');
        }
        return;
      }

      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const newUser = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: fullName,
        email: formData.email.trim(),
        role: 'Independent Earner',
        token: `gl_reg_${Date.now()}`,
        registeredAt: new Date().toISOString(),
      };

      storage.setAuthSession(newUser, newUser.token);
      storage.setRememberedEmail(formData.email.trim());

      if (onShowToast) {
        onShowToast(
          'Account Verified',
          `Welcome to gigLedgers, ${formData.firstName.trim()}!`,
          'success'
        );
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(newUser);
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
    setFormData({
      firstName: provider === 'Google' ? 'Sarah' : 'Alex',
      lastName: provider === 'Google' ? 'Jenkins' : 'Rivera',
      email: provider === 'Google' ? 'sarah.google@gitledgers.io' : 'alex.social@gitledgers.io',
    });
    if (onShowToast) {
      onShowToast(`${provider} Connect`, `Pre-filled details from ${provider}. Click Sign up to receive 2FA code.`, 'info');
    }
  };

  return (
    <div className={`w-full max-w-sm sm:max-w-md mx-auto min-h-screen bg-[#F8FAFC] dark:bg-[#0D1117] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-6 sm:p-8 select-none transition-colors ${className}`}>
      
      {/* TOP HEADER: BACK ARROW & CENTERED LOGO */}
      <div className="pt-8 pb-4 relative flex items-center justify-center">
        <button
          type="button"
          onClick={step === 2 ? () => setStep(1) : onNavigateToLogin}
          className="absolute left-0 w-9 h-9 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:border-sky-500 dark:hover:border-sky-400 transition"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <GitLedgersLogo size="lg" showTagline={false} />
      </div>

      {/* MAIN FORM AREA */}
      <div className="flex-1 flex flex-col justify-center my-auto space-y-5">
        
        {/* STEP 1: SIGN UP DETAILS */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                Create your Account
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleDetailsSubmit} className="space-y-3.5">
              
              {/* First Name */}
              <div className="space-y-1">
                <div className="bg-white dark:bg-[#161B22] rounded-xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm transition focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <div className="bg-white dark:bg-[#161B22] rounded-xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm transition focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="bg-white dark:bg-[#161B22] rounded-xl border border-[#E2E8F0] dark:border-[#30363D] shadow-sm transition focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20">
                  <input
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 pl-1">{errors.email}</p>
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
                    <span>Sending Code...</span>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </div>

            </form>

            {/* Social Auth Providers */}
            <SocialAuthButtons
              actionText="Or sign up with"
              onSocialLogin={handleSocialClick}
            />

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
            onChangeEmail={() => setStep(1)}
            isLoading={isLoading}
            errorMessage={otpError}
          />
        )}

      </div>

      {/* FOOTER LINK: "Already have an account? Sign in" */}
      <div className="pt-6 pb-4 text-center text-xs">
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
