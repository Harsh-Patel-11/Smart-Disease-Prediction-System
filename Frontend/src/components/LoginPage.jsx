import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  User,
  Phone,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  HeartPulse,
  Brain,
  Shield,
  FileCheck,
  Mail
} from 'lucide-react';

export const LoginPage = () => {
  const { loginWithGoogle, sendPhoneOtp, verifyPhoneOtp, loginUser, setActiveTab } = useApp();

  const [role, setRole] = useState('Patient');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setOtpSuccessMsg('');
    if (!phoneInput || phoneInput.length < 10) {
      setErrorMsg('Please enter a valid phone number with country code (e.g. +91 9876543210)');
      return;
    }
    setIsLoading(true);
    const formattedPhone = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput}`;
    const result = await sendPhoneOtp(formattedPhone);
    setIsLoading(false);
    if (result.success) {
      setOtpSent(true);
      setOtpSuccessMsg('OTP code sent via SMS to your phone number!');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code received via SMS.');
      return;
    }
    setIsLoading(true);
    const result = await verifyPhoneOtp(otpCode, role, phoneInput);
    setIsLoading(false);
    if (result.success) {
      if (role === 'Admin') setActiveTab('admin');
      else if (role === 'Doctor') setActiveTab('history');
      else setActiveTab('checker');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    const result = await loginWithGoogle(role);
    setIsLoading(false);
    if (result && result.success) {
      if (role === 'Admin') setActiveTab('admin');
      else if (role === 'Doctor') setActiveTab('history');
      else setActiveTab('checker');
    } else if (result && result.message) {
      setErrorMsg(result.message);
    }
  };

  const handleCustomGoogleConnect = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!googleEmailInput) {
      setErrorMsg('Please enter a valid Google Account email address.');
      return;
    }
    setIsLoading(true);
    const result = await loginWithGoogle(role, googleEmailInput, googleNameInput);
    setIsLoading(false);
    if (result.success) {
      setShowGoogleModal(false);
      if (role === 'Admin') setActiveTab('admin');
      else if (role === 'Doctor') setActiveTab('history');
      else setActiveTab('checker');
    } else {
      setErrorMsg(result.message || 'Failed to authenticate Google Account.');
    }
  };

  const roleConfig = {
    Patient: { active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', icon: User, color: 'text-indigo-400' },
    Doctor: { active: 'bg-violet-500/20 text-violet-300 border-violet-500/40', icon: Stethoscope, color: 'text-violet-400' },
    Admin: { active: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: ShieldCheck, color: 'text-rose-400' },
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row selection:bg-indigo-500 selection:text-white overflow-x-hidden"
      style={{ background: '#0a0a1a' }}
    >
      {/* LEFT PANEL — Hero Image & Info (Desktop) */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden shrink-0">
        <img
          src="/login-hero.png"
          alt="AI Medical Diagnostics Visualization"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,10,26,0.7) 0%, rgba(30,15,60,0.55) 50%, rgba(10,10,26,0.9) 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: 'linear-gradient(to top, rgba(10,10,26,0.95) 0%, transparent 100%)' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                SDPS<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">.ai</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Smart Disease Prediction System</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                AI-Powered<br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Disease Prediction
                </span>
              </h1>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Advanced machine learning diagnostics with real-time symptom analysis, automated medical reports, and electronic prescriptions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { icon: Brain, label: 'ML Diagnostics', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                { icon: FileCheck, label: 'Auto Reports', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                { icon: Shield, label: 'RBAC Security', color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${f.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Auth · Google & Phone Verification · IEEE SRS Compliant
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Sign In Options */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative min-h-[100dvh] lg:min-h-0 overflow-y-auto">
        <div className="absolute top-1/4 right-1/4 w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] bg-violet-600/5 rounded-full blur-[70px] pointer-events-none" />

        <div className="w-full max-w-[400px] my-auto relative z-10 space-y-5 sm:space-y-6">
          {/* Mobile Header Card */}
          <div className="lg:hidden p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center space-y-2 mb-2 shadow-xl backdrop-blur-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                SDPS<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">.ai</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Clinical AI Diagnostic System</p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Sign In to SDPS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Authenticate via Google Account or Phone OTP
            </p>
          </div>

          {/* Role Selector Pills */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            {['Patient', 'Doctor', 'Admin'].map(r => {
              const rc = roleConfig[r];
              const Icon = rc.icon;
              const isActive = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold transition-all border min-h-[42px] sm:min-h-0 cursor-pointer ${
                    isActive ? `${rc.active} shadow-sm` : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? rc.color : ''}`} />
                  {r}
                </button>
              );
            })}
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md min-h-[46px]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div id="recaptcha-container"></div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-white/[0.08] w-full"></div>
            <span className="bg-[#0a0a1a] px-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold absolute">
              Or sign in with Phone
            </span>
          </div>

          {/* Success Toast */}
          {otpSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{otpSuccessMsg}</span>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Phone Form */}
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Include country code (e.g. +91 for India, +1 for US)</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                >
                  {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <>Send OTP SMS <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className={inputClasses + " text-center font-mono tracking-widest text-lg font-bold"}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Enter code sent to {phoneInput}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="py-3 px-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <>Verify & Sign In</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Account Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md animate-modal-backdrop">
          <div className="glass-panel w-full max-w-md p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5 animate-modal-content relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Connect Google Account</h3>
              <p className="text-xs text-slate-400">
                Authenticate with your official Google Account email address to sign into <strong className="text-white">{role} Portal</strong>.
              </p>
            </div>

            <form onSubmit={handleCustomGoogleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Google Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-slate-700 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name (Optional)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={googleNameInput}
                    onChange={(e) => setGoogleNameInput(e.target.value)}
                    placeholder="e.g. Harsh Patel"
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-slate-700 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                <p className="text-indigo-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Secure Google OAuth Protocol
                </p>
                <p>Your Google Account will be registered & synced with SDPS Database for role-based access.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Connect & Sign In</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
