import React from 'react';
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
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, activeTab, setActiveTab, switchRole, logoutUser } = useApp();

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
                  v2.4 AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">SMART DISEASE PREDICTION</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
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
              Symptom Checker
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

            {/* Profile Avatar & Login Trigger */}
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
                  className="ml-1 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-slate-950 font-semibold text-sm hover:bg-indigo-400 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign In
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
      </div>
    </header>
  );
};
