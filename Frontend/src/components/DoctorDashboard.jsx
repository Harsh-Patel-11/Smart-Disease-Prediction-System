import React from 'react';
import { useApp } from '../context/AppContext';
import { PatientHistory } from './PatientHistory';
import { UserProfile } from './UserProfile';
import { PageTransition } from './PageTransition';
import {
  Stethoscope,
  Users,
  FileText,
  Pill,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const DoctorDashboard = ({ onOpenReport, onOpenPrescription }) => {
  const { currentUser, activeTab, predictions, reports } = useApp();

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Doctor Clinical Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-violet-100 relative overflow-hidden bg-white shadow-md shadow-slate-200/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700">
              <Stethoscope className="w-3.5 h-3.5 text-violet-600" /> Clinical Consultation Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Workspace · <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{currentUser?.name}</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-xl font-medium leading-relaxed">
              Review AI-generated patient diagnostics, confirm confidence scores, and issue verified electronic prescriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[100px]">
              <p className="text-xl font-extrabold text-violet-600">{predictions.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">Patient Cases</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[100px]">
              <p className="text-xl font-extrabold text-indigo-600">{reports.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">Verified Rx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Router */}
      <PageTransition tabKey={activeTab}>
        {activeTab === 'profile' ? (
          <UserProfile />
        ) : (
          <div className="space-y-8">
            
            {/* Recent Patient Prediction Cases */}
            <div className="p-6 rounded-3xl border border-slate-200/90 space-y-4 bg-white shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-600" /> Recent Clinical Predictions Queue
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predictions.map(pred => (
                  <div key={pred.prediction_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-violet-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold border border-indigo-200">
                          #CASE-{pred.prediction_id}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1">{pred.predicted_disease}</h4>
                      </div>
                      <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200">
                        {pred.confidence_score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">Patient: <strong className="text-slate-900 font-bold">{pred.user_name}</strong></p>
                    <p className="text-xs text-slate-500 font-medium">{pred.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <PatientHistory onOpenReport={onOpenReport} onOpenPrescription={onOpenPrescription} />

          </div>
        )}
      </PageTransition>

    </div>
  );
};
