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
      default: return 'Healthcare Dashboard';
    }
  };

  const roleColors = {
    Admin: { grad: 'from-rose-500 to-pink-500', accent: 'text-rose-600', hover: 'hover:bg-rose-50 hover:border-rose-200' },
    Doctor: { grad: 'from-violet-600 to-purple-600', accent: 'text-violet-600', hover: 'hover:bg-violet-50 hover:border-violet-200' },
    Patient: { grad: 'from-indigo-600 to-violet-600', accent: 'text-indigo-600', hover: 'hover:bg-indigo-50 hover:border-indigo-200' }
  };
  const c = roleColors[role] || roleColors.Patient;

  return (
    <header className="h-14 border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 bg-white/90 backdrop-blur-md shadow-xs">
      
      {/* Left: Mobile Menu Toggle + Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 shrink-0 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
          title="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <span className={`text-[11px] font-extrabold ${c.accent} shrink-0`}>{role}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{getTabTitle()}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('profile')}
          title="View & edit my profile"
          className={`flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200/80 pr-2 py-1 rounded-xl border border-transparent ${c.hover} transition-all group cursor-pointer`}
        >
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.grad} text-white flex items-center justify-center font-bold text-[11px] group-hover:scale-105 transition-transform shadow-xs shrink-0`}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{currentUser?.name}</p>
            <p className={`text-[10px] font-bold leading-tight ${c.accent} flex items-center gap-1`}>
              {role} <UserCircle className="w-3 h-3 opacity-60" />
            </p>
          </div>
        </button>
      </div>

    </header>
  );
};
