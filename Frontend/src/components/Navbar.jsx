import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Activity,
  FileText,
  ShieldCheck,
  Cpu,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Lock,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, activeTab, setActiveTab, switchRole, logoutUser, loginUser } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const res = loginUser(loginEmail, loginPassword);
    if (res.success) {
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError(res.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0a0a1a] rounded-[10px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                  SDPS<span className="text-indigo-400">.ai</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  v2.4 SRS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Disease Prediction System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'checker'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              AI Symptom Checker
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Reports & Prescriptions
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>

            <button
              onClick={() => setActiveTab('srs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'srs'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4 text-violet-400" />
              SRS Architecture
            </button>
          </nav>

          {/* Quick Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Toggle */}
            <div className="hidden lg:flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-xs">
              <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Role:
              </span>
              {['Patient', 'Doctor', 'Admin'].map(r => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                    currentUser?.role === r
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Profile Avatar & Login Modal Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white/[0.03] pl-3 pr-2 py-1.5 rounded-xl border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-400 font-mono leading-tight">{currentUser.role}</p>
                </div>
                <button
                  onClick={logoutUser}
                  title="Logout Session"
                  className="ml-1 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-slate-950 font-semibold text-sm hover:bg-indigo-400 transition-all shadow-md shadow-indigo-500/20"
              >
                <Lock className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 bg-[#0a0a1a] border-t border-white/[0.06] text-xs">
        <button onClick={() => setActiveTab('hero')} className={`p-2 ${activeTab === 'hero' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Overview</button>
        <button onClick={() => setActiveTab('checker')} className={`p-2 ${activeTab === 'checker' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Checker</button>
        <button onClick={() => setActiveTab('history')} className={`p-2 ${activeTab === 'history' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Reports</button>
        <button onClick={() => setActiveTab('admin')} className={`p-2 ${activeTab === 'admin' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Admin</button>
        <button onClick={() => setActiveTab('srs')} className={`p-2 ${activeTab === 'srs' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>SRS</button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/[0.06] shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" /> SDPS User Authentication
            </h3>
            <p className="text-xs text-slate-400 mb-6">Enter registered user credentials from SRS database.</p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@sdps.health or ananya.patient@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password123!"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div className="p-3 bg-slate-900/50 rounded-xl border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-indigo-400">Demo Accounts (Password: Password123!):</p>
                <p>• Admin: <code className="text-white">admin@sdps.health</code></p>
                <p>• Patient: <code className="text-white">ananya.patient@example.com</code></p>
                <p>• Doctor: <code className="text-white">doctor@sdps.health</code></p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity shadow-md shadow-indigo-500/20"
                >
                  Login to System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
