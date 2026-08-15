import React from 'react';
import { useApp } from '../context/AppContext';
import { SymptomChecker } from './SymptomChecker';
import { PatientHistory } from './PatientHistory';
import { UserProfile } from './UserProfile';
import { PageTransition } from './PageTransition';
import { PatientScrollBackground } from './PatientScrollBackground';
import { Heart } from 'lucide-react';

export const PatientDashboard = ({ onOpenReport, onOpenPrescription, scrollContainerRef }) => {
  const { currentUser, activeTab, reports, predictions } = useApp();

  const userEmail = currentUser?.email?.toLowerCase();
  const userPhone = (currentUser?.contact_no || currentUser?.phone || '').replace(/[^0-9]/g, '');
  const userName = currentUser?.name?.toLowerCase();

  const userReports = reports.filter(r =>
    (userEmail && r.patient_email?.toLowerCase() === userEmail) ||
    (userPhone && r.patient_phone?.replace(/[^0-9]/g, '') === userPhone) ||
    r.user_id === currentUser?.user_id ||
    (userName && r.patient_name?.toLowerCase() === userName)
  );

  return (
    <div className="relative min-h-full">

      {/* Mont-Fort Style Scroll-Driven 3D Background Canvas — absolute within this container */}
      <PatientScrollBackground scrollContainerRef={scrollContainerRef} />

      {/* Dashboard Content — above canvas via z-10 */}
      <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto relative z-10">

        {/* Patient Welcome Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-indigo-100 relative overflow-hidden bg-white/80 backdrop-blur-sm shadow-md shadow-slate-200/50">
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                <Heart className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" /> Patient Health Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{currentUser?.name}</span>
              </h1>
              <p className="text-xs text-slate-500 max-w-xl font-medium leading-relaxed">
                Use our ML Diagnostic Engine to check symptoms, view medical reports, and manage digital prescriptions.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 text-center min-w-[95px] backdrop-blur-sm">
                <p className="text-xl font-extrabold text-indigo-600">{predictions.length}</p>
                <p className="text-[10px] text-slate-500 font-bold">Diagnostics</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 text-center min-w-[95px] backdrop-blur-sm">
                <p className="text-xl font-extrabold text-violet-600">{userReports.length}</p>
                <p className="text-[10px] text-slate-500 font-bold">Reports</p>
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
          </div>
        </PageTransition>

      </div>
    </div>
  );
};
