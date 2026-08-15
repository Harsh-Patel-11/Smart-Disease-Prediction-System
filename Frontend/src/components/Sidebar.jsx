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
    { id: 'prescriptions', label: 'My Prescriptions', icon: Pill }
  ];

  const doctorNav = [
    { id: 'doctor_cases', label: 'Patient Clinical Queue', icon: Stethoscope, badge: 'Live' },
    { id: 'reports', label: 'Diagnosis Reports & Rx', icon: FileText }
  ];

  const adminNav = [
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_diseases', label: 'Master Disease Library', icon: Database },
    { id: 'admin_symptoms', label: 'Symptom Weight Matrix', icon: Activity },
    { id: 'admin_medicines', label: 'Medicines Inventory', icon: Pill },
    { id: 'admin_audit', label: 'System Audit Logs', icon: Clock, badge: 'Live' }
  ];

  const navItems = role === 'Admin' ? adminNav : role === 'Doctor' ? doctorNav : patientNav;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside
      className="w-64 border-r border-slate-200/90 flex flex-col justify-between h-full shrink-0 select-none bg-white/95 backdrop-blur-xl text-slate-800 shadow-sm"
    >
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick(navItems[0].id)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                SDPS<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">.ai</span>
              </span>
              <p className="text-[10px] text-slate-500 font-semibold">Clinical AI Suite</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              role === 'Admin' ? 'bg-rose-500' : role === 'Doctor' ? 'bg-violet-500' : 'bg-indigo-500'
            } animate-pulse`} />
            <span className="text-[11px] font-bold text-slate-700">{role} Portal</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            role === 'Admin' ? 'bg-rose-100 text-rose-700 border border-rose-200' : role === 'Doctor' ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}>
            RBAC
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          Navigation
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 sm:py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] sm:min-h-0 cursor-pointer ${
                isActive
                  ? `bg-indigo-600 text-white shadow-md shadow-indigo-500/25`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200/80 space-y-3 bg-slate-50/50">
        <div
          className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => handleNavClick('profile')}
          title="View my profile"
        >
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
            role === 'Admin' ? 'from-rose-500 to-pink-500' : role === 'Doctor' ? 'from-violet-500 to-purple-500' : 'from-indigo-600 to-violet-600'
          } text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
          </div>
          <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
        </div>

        <button
          onClick={() => { logoutUser(); if (onCloseMobile) onCloseMobile(); }}
          className="w-full py-2.5 sm:py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-h-[40px] sm:min-h-0"
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
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
