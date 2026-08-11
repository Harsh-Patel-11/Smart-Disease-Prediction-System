import React from 'react';
import { useApp } from '../context/AppContext';
import { PatientHistory } from './PatientHistory';
import { SrsArchitectureViewer } from './SrsArchitectureViewer';
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      
      {/* Doctor Clinical Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-violet-500/15 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(40, 20, 60, 0.5) 100%)' }}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
              <Stethoscope className="w-3.5 h-3.5 text-violet-400" /> Clinical Consultation Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Clinical Workspace · <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{currentUser?.name}</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Review AI-generated patient diagnostics, confirm confidence scores, and issue verified electronic prescriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[100px]">
              <p className="text-xl font-extrabold text-violet-400">{predictions.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">Patient Cases</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[100px]">
              <p className="text-xl font-extrabold text-indigo-400">{reports.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">Verified Rx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Router */}
      <PageTransition tabKey={activeTab}>
        {activeTab === 'profile' ? (
          <UserProfile />
        ) : activeTab === 'srs' ? (
          <SrsArchitectureViewer />
        ) : (
          <div className="space-y-8">
            
            {/* Recent Patient Prediction Cases */}
            <div className="p-6 rounded-2xl border border-white/[0.06] space-y-4"
              style={{ background: 'rgba(15, 15, 35, 0.7)' }}
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-400" /> Recent Clinical Predictions Queue
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predictions.map(pred => (
                  <div key={pred.prediction_id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-violet-500/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          #CASE-{pred.prediction_id}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{pred.predicted_disease}</h4>
                      </div>
                      <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg border border-violet-500/15">
                        {pred.confidence_score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">Patient: <strong className="text-white">{pred.user_name}</strong></p>
                    <p className="text-xs text-slate-500">{pred.notes}</p>
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
