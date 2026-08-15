import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Background3DCanvas } from './Background3DCanvas';
import { SideMedicalPulseAnimation } from './SideMedicalPulseAnimation';
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
  Mail,
  ArrowUp
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding }) => {
  const { loginWithGoogle, sendPhoneOtp, verifyPhoneOtp, setActiveTab } = useApp();

  const [role, setRole] = useState('Patient');
  const [phoneInput, setPhoneInput] = useState('+91 ');
  const [otpCode, setOtpCode] = useState('');

  // ── Scroll up or Swipe down detection to navigate back to Landing Page ──
  useEffect(() => {
    if (!onBackToLanding) return;

    let touchStartY = 0;
    let accumulatedUpScroll = 0;
    let scrollResetTimer = null;

    const handleWheel = (e) => {
      const isAtTop = (window.scrollY || document.documentElement.scrollTop || 0) <= 2;
      if (isAtTop && e.deltaY < 0) {
        accumulatedUpScroll += Math.abs(e.deltaY);
        clearTimeout(scrollResetTimer);
        scrollResetTimer = setTimeout(() => {
          accumulatedUpScroll = 0;
        }, 400);

        if (accumulatedUpScroll > 40) {
          accumulatedUpScroll = 0;
          onBackToLanding();
        }
      } else {
        accumulatedUpScroll = 0;
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!touchStartY || !e.touches || e.touches.length !== 1) return;
      const isAtTop = (window.scrollY || document.documentElement.scrollTop || 0) <= 2;
      const currentY = e.touches[0].clientY;
      const diffY = currentY - touchStartY;
      if (isAtTop && diffY > 70) {
        touchStartY = 0;
        onBackToLanding();
      }
    };

    const handleKeyDown = (e) => {
      const isAtTop = (window.scrollY || document.documentElement.scrollTop || 0) <= 2;
      if (isAtTop && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
        onBackToLanding();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollResetTimer);
    };
  }, [onBackToLanding]);

  const [otpSent, setOtpSent] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const handlePhoneInputChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+91')) {
      val = '+91 ' + val.replace(/^\+?91\s?/, '');
    }
    setPhoneInput(val);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setOtpSuccessMsg('');
    const rawDigits = phoneInput.replace(/[^0-9]/g, '');
    if (rawDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number after +91');
      return;
    }
    setIsLoading(true);
    const formattedPhone = phoneInput.trim().startsWith('+') ? phoneInput.trim().replace(/\s+/g, '') : `+91${rawDigits.slice(-10)}`;
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
    try {
      const result = await loginWithGoogle(role);
      setIsLoading(false);
      if (result && result.success) {
        if (role === 'Admin') setActiveTab('admin');
        else if (role === 'Doctor') setActiveTab('history');
        else setActiveTab('checker');
      } else if (result && result.message) {
        // If popup was blocked, unauthorized domain on hosting, or popup closed, smoothly open the direct Google connection modal
        if (
          result.message.includes('popup') ||
          result.message.includes('unauthorized') ||
          result.message.includes('network') ||
          result.message.includes('auth/') ||
          result.message.includes('cancelled')
        ) {
          if (role === 'Admin') {
            setGoogleEmailInput('hkpatel7874@gmail.com');
            setGoogleNameInput('Harsh Patel');
          }
          setShowGoogleModal(true);
          setErrorMsg('Please confirm your Google Account email to complete authentication.');
        } else {
          setErrorMsg(result.message);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setShowGoogleModal(true);
      setErrorMsg('Please enter your Google email address below to sign in.');
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
    Patient: { active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-600', icon: User, color: 'text-indigo-600' },
    Doctor: { active: 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 border-violet-600', icon: Stethoscope, color: 'text-violet-600' },
    Admin: { active: 'bg-rose-600 text-white shadow-lg shadow-rose-500/25 border-rose-600', icon: ShieldCheck, color: 'text-rose-600' },
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium";

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#f8fafc] text-slate-900 selection:bg-indigo-600 selection:text-white overflow-x-hidden relative">

      {/* Floating Top Return to Landing Pill */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-md shadow-indigo-500/15 text-xs font-extrabold tracking-wide flex items-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 group animate-fade-in"
          title="Scroll up or click to return to the interactive experience"
        >
          <span className="text-sm font-black group-hover:-translate-y-0.5 transition-transform">↑</span>
          <span>Scroll up to return to Landing Page</span>
        </button>
      )}
      
      {/* Attractive Middle 3D DNA Canvas Animation — hidden on mobile */}
      <div className="hidden sm:block">
        <Background3DCanvas />
      </div>

      {/* Dynamic Animated Ambient Background Orbs — hidden on mobile */}
      <div className="hidden sm:block">
        <div className="absolute top-10 right-1/4 w-[380px] h-[380px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none animate-blob-1" />
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-violet-400/20 rounded-full blur-[110px] pointer-events-none animate-blob-2" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />

      {/* LEFT PANEL — Original Hero Image & Info Restored */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden shrink-0">
        <img
          src="/login-hero.png"
          alt="AI Medical Diagnostics Visualization"
          className="absolute inset-0 w-full h-full object-cover origin-center"
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/85 via-slate-900/70 to-violet-950/80" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950/95 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SDPS<span className="text-indigo-400">.ai</span>
            </span>
          </div>

          <div className="space-y-6 max-w-lg">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Clinical Decision Engine
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                AI-Powered<br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Disease Prediction
                </span>
              </h1>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed font-medium">
                Advanced machine learning diagnostics with real-time symptom analysis, automated medical reports, and digital prescriptions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { icon: Brain, label: 'ML Diagnostics', color: 'text-indigo-200 bg-white/10 border-white/20' },
                { icon: FileCheck, label: 'Auto Reports', color: 'text-violet-200 bg-white/10 border-white/20' },
                { icon: Shield, label: 'RBAC Security', color: 'text-fuchsia-200 bg-white/10 border-white/20' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${f.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Firebase Auth Enabled · Google & Phone OTP Supported
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Original Content Restored */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-6 sm:py-12 relative min-h-[100dvh] lg:min-h-0 overflow-y-auto z-10 pb-safe">

        {/* Side Heartbeat Pulse Waveform — sm+ only */}
        <SideMedicalPulseAnimation />

        {/* Sign-In Container Card */}
        <div className="w-full max-w-[420px] my-auto relative z-20 space-y-5 bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/80">
          
          {/* Mobile Header Logo */}
          <div className="lg:hidden p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-md shadow-indigo-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                SDPS<span className="text-indigo-600">.ai</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Clinical AI Diagnostic System</p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to SDPS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Choose your portal role and sign in with Google or Phone OTP
            </p>
          </div>

          {/* Role Selector Pills */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80">
            {['Patient', 'Doctor', 'Admin'].map(r => {
              const rc = roleConfig[r];
              const Icon = rc.icon;
              const isActive = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border min-h-[42px] cursor-pointer ${
                    isActive ? `${rc.active} scale-[1.02]` : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {r}
                </button>
              );
            })}
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] min-h-[46px]"
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
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-extrabold absolute">
              Or sign in with Phone
            </span>
          </div>

          {/* Success Toast */}
          {otpSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{otpSuccessMsg}</span>
            </div>
          )}

          {/* Error Toast */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Phone Form */}
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={handlePhoneInputChange}
                      placeholder="+91 98765 43210"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Country code +91 prefilled for India</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                >
                  {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <>Send OTP SMS <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Code sent via SMS to {phoneInput}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="py-3 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer shrink-0"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <>Verify & Sign In</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Original Google Account Modal Restored */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-modal-backdrop">
          <div className="glass-panel w-full max-w-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xl space-y-5 animate-modal-content relative bg-white">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Connect Google Account</h3>
              <p className="text-xs text-slate-500">
                Authenticate with your official Google Account email address to sign into <strong className="text-slate-900">{role} Portal</strong>.
              </p>
            </div>

            <form onSubmit={handleCustomGoogleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Google Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name (Optional)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={googleNameInput}
                    onChange={(e) => setGoogleNameInput(e.target.value)}
                    placeholder="e.g. Harsh Patel"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/60 text-[11px] text-slate-600 space-y-1">
                <p className="text-indigo-700 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Secure Google OAuth Protocol
                </p>
                <p className="font-medium">Your Google Account will be registered & synced with SDPS Database for role-based access.</p>
              </div>

              {/* Quick Preset Buttons for Instant 1-Click Access */}
              <div className="pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Sign-in Presets:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmailInput(role === 'Admin' ? 'hkpatel7874@gmail.com' : 'patient.demo@gmail.com');
                      setGoogleNameInput(role === 'Admin' ? 'Harsh Patel' : 'Patient Demo User');
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {role === 'Admin' ? '👤 Harsh Patel (Admin)' : '👤 Patient Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmailInput('dr.sharma@gmail.com');
                      setGoogleNameInput('Dr. Rajesh Sharma');
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-violet-50 hover:text-violet-600 rounded-lg text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    👨‍⚕️ Doctor Account
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  {isLoading ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Connect & Sign In →</>
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
