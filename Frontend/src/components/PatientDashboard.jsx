import React from 'react';
import { useApp } from '../context/AppContext';
import { SymptomChecker } from './SymptomChecker';
import { PatientHistory } from './PatientHistory';
import { SrsArchitectureViewer } from './SrsArchitectureViewer';
import { UserProfile } from './UserProfile';
import { PageTransition } from './PageTransition';
import { Heart } from 'lucide-react';

export const PatientDashboard = ({ onOpenReport, onOpenPrescription }) => {
  const { currentUser, activeTab, reports, predictions } = useApp();

  const userReports = reports.filter(r => r.patient_name === currentUser?.name || r.user_id === currentUser?.user_id);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      
      {/* Patient Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-indigo-500/15 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(30, 20, 60, 0.6) 100%)' }}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Heart className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" /> Patient Health Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{currentUser?.name}</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Use our ML Diagnostic Engine to check symptoms, view medical reports, and manage digital prescriptions.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-indigo-400">{predictions.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">Diagnostics</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-violet-400">{userReports.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Component Router */}
      <PageTransition tabKey={activeTab}>
        <div className="pt-2">
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'checker' && <SymptomChecker onOpenReport={onOpenReport} />}
          {(activeTab === 'reports' || activeTab === 'prescriptions') && (
            <PatientHistory
              onOpenReport={onOpenReport}
              onOpenPrescription={onOpenPrescription}
            />
          )}
          {activeTab === 'srs' && <SrsArchitectureViewer />}
        </div>
      </PageTransition>

    </div>
  );
};
