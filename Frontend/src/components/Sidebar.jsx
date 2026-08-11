import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Stethoscope,
  FileText,
  Pill,
  Users,
  Database,
  Clock,
  Layers,
  LogOut,
  HeartPulse,
  UserCircle,
  X
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { currentUser, activeTab, setActiveTab, logoutUser } = useApp();

  const role = currentUser?.role || 'Patient';

  const patientNav = [
    { id: 'checker', label: 'AI Symptom Checker', icon: Stethoscope, badge: 'ML' },
    { id: 'reports', label: 'My Diagnosis Reports', icon: FileText },
    { id: 'prescriptions', label: 'My Prescriptions', icon: Pill },
    { id: 'srs', label: 'SRS Architecture', icon: Layers }
  ];

  const doctorNav = [
    { id: 'doctor_cases', label: 'Patient Clinical Queue', icon: Stethoscope, badge: 'Live' },
    { id: 'reports', label: 'Diagnosis Reports & Rx', icon: FileText },
    { id: 'srs', label: 'SRS Architecture', icon: Layers }
  ];

  const adminNav = [
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_diseases', label: 'Master Disease Library', icon: Database },
    { id: 'admin_symptoms', label: 'Symptom Weight Matrix', icon: Activity },
    { id: 'admin_medicines', label: 'Medicines Inventory', icon: Pill },
    { id: 'admin_audit', label: 'System Audit Logs', icon: Clock, badge: 'Live' },
    { id: 'srs', label: 'SRS Architecture', icon: Layers }
  ];

  const navItems = role === 'Admin' ? adminNav : role === 'Doctor' ? doctorNav : patientNav;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside
      className="w-64 border-r border-white/[0.06] flex flex-col justify-between h-full shrink-0 select-none"
      style={{ background: 'rgba(10, 10, 26, 0.98)', backdropFilter: 'blur(20px)' }}
    >
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick(navItems[0].id)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">
                SDPS<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">.ai</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Clinical AI Suite</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${
              role === 'Admin' ? 'bg-rose-400' : role === 'Doctor' ? 'bg-violet-400' : 'bg-indigo-400'
            } animate-pulse`} />
            <span className="text-[11px] font-semibold text-slate-300">{role} Portal</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            role === 'Admin' ? 'bg-rose-500/10 text-rose-400' : role === 'Doctor' ? 'bg-violet-500/10 text-violet-400' : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            RBAC
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
          Navigation
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-3 sm:py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] sm:min-h-0 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${role === 'Admin' ? 'from-rose-500/20 to-rose-500/5 text-rose-300 border border-rose-500/20' : role === 'Doctor' ? 'from-violet-500/20 to-violet-500/5 text-violet-300 border border-violet-500/20' : 'from-indigo-500/20 to-indigo-500/5 text-indigo-300 border border-indigo-500/20'}`
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? (role === 'Admin' ? 'text-rose-400' : role === 'Doctor' ? 'text-violet-400' : 'text-indigo-400') : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive
                    ? (role === 'Admin' ? 'bg-rose-500/20 text-rose-300' : role === 'Doctor' ? 'bg-violet-500/20 text-violet-300' : 'bg-indigo-500/20 text-indigo-300')
                    : 'bg-white/[0.04] text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick('profile')}
          title="View my profile"
        >
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
            role === 'Admin' ? 'from-rose-500 to-pink-500' : role === 'Doctor' ? 'from-violet-500 to-purple-500' : 'from-indigo-500 to-violet-500'
          } text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
          </div>
          <UserCircle className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
        </div>

        <button
          onClick={() => { logoutUser(); if (onCloseMobile) onCloseMobile(); }}
          className="w-full py-2.5 sm:py-2 rounded-lg bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 text-slate-400 hover:text-rose-400 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[40px] sm:min-h-0"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-40 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay & Sliding Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#0a0a1a]/80 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full animate-modal-content">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
