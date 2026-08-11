import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronRight,
  UserCircle,
  Menu
} from 'lucide-react';

export const HeaderBar = ({ onToggleMobileSidebar }) => {
  const { currentUser, activeTab, setActiveTab } = useApp();
  const role = currentUser?.role || 'Patient';

  const getTabTitle = () => {
    switch (activeTab) {
      case 'profile': return 'My Profile & Settings';
      case 'checker': return 'AI Symptom Console';
      case 'reports': return 'Diagnosis Reports';
      case 'prescriptions': return 'Prescriptions (Rx)';
      case 'doctor_cases': return 'Clinical Queue';
      case 'admin_users': return 'User Accounts';
      case 'admin_diseases': return 'Disease Library';
      case 'admin_symptoms': return 'Symptom Matrix';
      case 'admin_medicines': return 'Medicines Inventory';
      case 'admin_audit': return 'Audit Logs';
      case 'srs': return 'IEEE SRS Architecture';
      default: return 'Healthcare Dashboard';
    }
  };

  const roleColors = {
    Admin: { grad: 'from-rose-500 to-pink-500', accent: 'text-rose-400', hover: 'hover:bg-rose-500/10 hover:border-rose-500/20' },
    Doctor: { grad: 'from-violet-500 to-purple-500', accent: 'text-violet-400', hover: 'hover:bg-violet-500/10 hover:border-violet-500/20' },
    Patient: { grad: 'from-indigo-500 to-violet-500', accent: 'text-indigo-400', hover: 'hover:bg-indigo-500/10 hover:border-indigo-500/20' }
  };
  const c = roleColors[role] || roleColors.Patient;

  return (
    <header className="h-14 border-b border-white/[0.06] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0"
      style={{ background: 'rgba(10, 10, 26, 0.9)', backdropFilter: 'blur(16px)' }}
    >
      
      {/* Left: Mobile Menu Toggle + Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white shrink-0 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
          title="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <span className={`text-[11px] font-semibold ${c.accent} opacity-90 shrink-0`}>{role}</span>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-white truncate">{getTabTitle()}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('profile')}
          title="View & edit my profile"
          className={`flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/[0.06] pr-2 py-1 rounded-xl border border-transparent ${c.hover} transition-all group cursor-pointer`}
        >
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.grad} text-white flex items-center justify-center font-bold text-[11px] group-hover:scale-105 transition-transform shadow-sm shrink-0`}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-white leading-tight group-hover:text-indigo-200 transition-colors">{currentUser?.name}</p>
            <p className={`text-[10px] font-medium leading-tight ${c.accent} flex items-center gap-1`}>
              {role} <UserCircle className="w-3 h-3 opacity-60" />
            </p>
          </div>
        </button>
      </div>

    </header>
  );
};
