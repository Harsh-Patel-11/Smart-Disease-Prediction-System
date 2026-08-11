import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Pill,
  Calendar,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Activity,
  Stethoscope,
  Clock,
  Info
} from 'lucide-react';

export const PatientHistory = ({ onOpenReport, onOpenPrescription }) => {
  const { reports, deleteReport, currentUser, activeTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const isPatient = currentUser?.role === 'Patient';
  const isPrescriptionsTab = activeTab === 'prescriptions';

  const userReports = reports.filter(r => {
    const belongsToUser = !isPatient || r.patient_name === currentUser?.name || r.user_id === currentUser?.user_id;
    const term = searchTerm.toLowerCase();
    const matchesSearch = r.patient_name?.toLowerCase().includes(term) ||
      r.primary_diagnosis?.toLowerCase().includes(term) ||
      r.report_id?.toString().includes(term);
    return belongsToUser && matchesSearch;
  });

  const handleDelete = (reportId) => {
    deleteReport(reportId);
    setDeletingId(null);
  };

  // ─── Shared: card header row (ID + date + delete) ───
  const CardHeader = ({ report }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-semibold ${
          isPrescriptionsTab
            ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
            : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
        }`}>
          {isPrescriptionsTab ? '#Rx' : '#SDPS'}-{report.report_id}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {new Date(report.report_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        {report.groq_powered && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-semibold">AI</span>
        )}
      </div>
      {deletingId !== report.report_id && (
        <button
          onClick={() => setDeletingId(report.report_id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  // ─── Shared: inline delete confirmation ───
  const DeleteConfirm = ({ report }) =>
    deletingId === report.report_id ? (
      <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Delete this {isPrescriptionsTab ? 'prescription' : 'report'}?</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleDelete(report.report_id)} className="px-2.5 py-1 rounded-lg bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 cursor-pointer">Delete</button>
          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">Cancel</button>
        </div>
      </div>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold mb-2 border ${
            isPrescriptionsTab
              ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}>
            {isPrescriptionsTab ? <Pill className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {isPrescriptionsTab ? 'My Digital Prescriptions' : 'My Diagnosis Reports'}
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {isPrescriptionsTab ? 'Prescriptions & Precautions' : 'Diagnosis Reports'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isPrescriptionsTab
              ? 'View your prescribed medicines, precautions, and follow-up advice.'
              : 'Your AI-powered clinical diagnoses with confidence scores.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Search by diagnosis or ${isPrescriptionsTab ? 'Rx' : 'report'} ID...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Empty State */}
      {userReports.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/[0.06] text-center space-y-3">
          {isPrescriptionsTab
            ? <Pill className="w-12 h-12 text-slate-600 mx-auto" />
            : <FileText className="w-12 h-12 text-slate-600 mx-auto" />}
          <h3 className="text-lg font-bold text-white">
            {isPrescriptionsTab ? 'No Prescriptions Found' : 'No Diagnosis Reports Found'}
          </h3>
          <p className="text-xs text-slate-400">Run a check in the AI Symptom Checker to generate your first report.</p>
        </div>
      ) : isPrescriptionsTab ? (

        /* ══════════════════════════════════════════
           PRESCRIPTIONS TAB — Full Rx Cards
           ══════════════════════════════════════════ */
        <div className="space-y-6">
          {userReports.map(report => (
            <div key={report.report_id} className="glass-panel rounded-3xl border border-violet-500/15 overflow-hidden">

              {/* ── Diagnosis Banner (top) ── */}
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Primary Diagnosis</p>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0" />
                    {report.primary_diagnosis}
                    {report.icd_code && <span className="text-xs font-mono text-slate-500">({report.icd_code})</span>}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Patient: <span className="text-slate-200 font-semibold">{report.patient_name}</span></p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-[10px] text-slate-500">AI Confidence</p>
                    <p className={`text-lg font-extrabold ${report.confidence_score >= 75 ? 'text-emerald-400' : report.confidence_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {report.confidence_score}%
                    </p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[10px] text-slate-500">Severity</p>
                    <p className={`text-sm font-extrabold ${report.severity_level === 'High' || report.severity_level === 'Emergency' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {report.severity_level || 'Moderate'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <CardHeader report={report} />
                <DeleteConfirm report={report} />

                {/* ── Prescribed Medicines (highlighted) ── */}
                {report.prescriptions && report.prescriptions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Pill className="w-3.5 h-3.5 text-violet-400" /> Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {report.prescriptions.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-violet-500/[0.07] border border-violet-500/20">
                          <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm">{med.medicine_name}</p>
                            <p className="text-xs text-violet-300">{med.dosage}</p>
                            {med.notes && (
                              <p className="text-[11px] text-amber-300/80 flex items-center gap-1 mt-0.5">
                                <Info className="w-3 h-3 shrink-0" /> {med.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-medium flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> {med.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Precautions & Recommendations (highlighted) ── */}
                {Array.isArray(report.recommendations) && report.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Precautions & Recommendations
                    </h4>
                    <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-2">
                      {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Follow-up & Specialist ── */}
                {(report.follow_up_advice || report.recommended_specialist) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.recommended_specialist && (
                      <div className="p-3 rounded-xl bg-indigo-500/[0.05] border border-indigo-500/15">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Stethoscope className="w-3 h-3 text-indigo-400" /> Recommended Specialist
                        </p>
                        <p className="text-xs font-semibold text-indigo-300">{report.recommended_specialist}</p>
                      </div>
                    )}
                    {report.follow_up_advice && (
                      <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/15">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-amber-400" /> Follow-Up Advice
                        </p>
                        <p className="text-xs text-amber-200">{report.follow_up_advice}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Action Button ── */}
                <button
                  onClick={() => onOpenPrescription(report)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-950 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pill className="w-4 h-4" /> Open Full Digital Rx Card
                </button>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ══════════════════════════════════════════
           DIAGNOSIS TAB — Clean score-focused cards
           ══════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userReports.map(report => (
            <div key={report.report_id} className="glass-panel-hover glass-panel p-5 rounded-3xl border border-white/[0.06] space-y-4 group">

              <CardHeader report={report} />
              <DeleteConfirm report={report} />

              {/* Diagnosis Name */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Primary Diagnosis</p>
                <h3 className="text-xl font-extrabold text-white mt-1">{report.primary_diagnosis}</h3>
                {report.icd_code && (
                  <span className="text-[10px] font-mono text-slate-500">ICD: {report.icd_code}</span>
                )}
              </div>

              {/* Confidence Score Bar */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">AI Confidence Score</span>
                  <span className={`${report.confidence_score >= 75 ? 'text-emerald-400' : report.confidence_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {report.confidence_score}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${report.confidence_score >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : report.confidence_score >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'}`}
                    style={{ width: `${report.confidence_score}%` }}
                  />
                </div>
              </div>

              {/* Severity + Specialist row */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Severity: <strong className={`${report.severity_level === 'High' || report.severity_level === 'Emergency' ? 'text-rose-400' : 'text-amber-400'}`}>{report.severity_level || 'Moderate'}</strong></span>
                <span className="truncate ml-2 text-right text-slate-300 font-medium">{report.recommended_specialist}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenReport(report)}
                className="w-full py-2.5 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" /> View Full Diagnosis Report
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
