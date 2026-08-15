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
    const userEmail = currentUser?.email?.toLowerCase();
    const userPhone = (currentUser?.contact_no || currentUser?.phone || '').replace(/[^0-9]/g, '');
    const userName = currentUser?.name?.toLowerCase();

    const belongsToUser = !isPatient ||
      (userEmail && r.patient_email?.toLowerCase() === userEmail) ||
      (userPhone && r.patient_phone?.replace(/[^0-9]/g, '') === userPhone) ||
      r.user_id === currentUser?.user_id ||
      (userName && r.patient_name?.toLowerCase() === userName);

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

  const CardHeader = ({ report }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-bold ${
          isPrescriptionsTab
            ? 'text-violet-700 bg-violet-50 border-violet-200'
            : 'text-indigo-700 bg-indigo-50 border-indigo-200'
        }`}>
          {isPrescriptionsTab ? '#Rx' : '#SDPS'}-{report.report_id}
        </span>
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {new Date(report.report_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        {report.groq_powered && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9px] font-bold">AI</span>
        )}
      </div>
      {deletingId !== report.report_id && (
        <button
          onClick={() => setDeletingId(report.report_id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const DeleteConfirm = ({ report }) =>
    deletingId === report.report_id ? (
      <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Delete this {isPrescriptionsTab ? 'prescription' : 'report'}?</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleDelete(report.report_id)} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer">Delete</button>
          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer font-medium">Cancel</button>
        </div>
      </div>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold mb-2 border ${
            isPrescriptionsTab
              ? 'bg-violet-50 text-violet-700 border-violet-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            {isPrescriptionsTab ? <Pill className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {isPrescriptionsTab ? 'My Digital Prescriptions' : 'My Diagnosis Reports'}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isPrescriptionsTab ? 'Prescriptions & Precautions' : 'Diagnosis Reports'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
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
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 font-medium shadow-xs"
          />
        </div>
      </div>

      {/* Empty State */}
      {userReports.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-3 shadow-xs">
          {isPrescriptionsTab
            ? <Pill className="w-12 h-12 text-slate-300 mx-auto" />
            : <FileText className="w-12 h-12 text-slate-300 mx-auto" />}
          <h3 className="text-lg font-bold text-slate-900">
            {isPrescriptionsTab ? 'No Prescriptions Found' : 'No Diagnosis Reports Found'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">Run a check in the AI Symptom Checker to generate your first report.</p>
        </div>
      ) : isPrescriptionsTab ? (

        <div className="space-y-6">
          {userReports.map(report => (
            <div key={report.report_id} className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md shadow-slate-200/50">

              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Primary Diagnosis</p>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" />
                    {report.primary_diagnosis}
                    {report.icd_code && <span className="text-xs font-mono text-slate-400">({report.icd_code})</span>}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Patient: <span className="text-slate-900 font-bold">{report.patient_name}</span></p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <p className="text-[10px] text-slate-500 font-bold">AI Match</p>
                    <p className={`text-lg font-extrabold ${report.confidence_score >= 75 ? 'text-emerald-600' : report.confidence_score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {report.confidence_score}%
                    </p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <p className="text-[10px] text-slate-500 font-bold">Severity</p>
                    <p className={`text-sm font-extrabold ${report.severity_level === 'High' || report.severity_level === 'Emergency' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {report.severity_level || 'Moderate'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <CardHeader report={report} />
                <DeleteConfirm report={report} />

                {/* Prescribed Medicines */}
                {report.prescriptions && report.prescriptions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Pill className="w-3.5 h-3.5 text-violet-600" /> Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {report.prescriptions.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                          <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm">{med.medicine_name}</p>
                            <p className="text-xs font-bold text-violet-700">{med.dosage}</p>
                            {med.notes && (
                              <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-0.5">
                                <Info className="w-3 h-3 shrink-0 text-amber-600" /> {med.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-slate-700 font-bold border border-slate-200 flex items-center gap-1 shrink-0 shadow-xs">
                            <Clock className="w-3 h-3 text-slate-400" /> {med.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions & Recommendations */}
                {Array.isArray(report.recommendations) && report.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Precautions & Recommendations
                    </h4>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                      {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up & Specialist */}
                {(report.follow_up_advice || report.recommended_specialist) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.recommended_specialist && (
                      <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                        <p className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Stethoscope className="w-3 h-3 text-indigo-600" /> Recommended Specialist
                        </p>
                        <p className="text-xs font-bold text-slate-900">{report.recommended_specialist}</p>
                      </div>
                    )}
                    {report.follow_up_advice && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                        <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-amber-600" /> Follow-Up Advice
                        </p>
                        <p className="text-xs font-medium text-amber-900">{report.follow_up_advice}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => onOpenPrescription(report)}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pill className="w-4 h-4" /> Open Full Digital Rx Card
                </button>
              </div>
            </div>
          ))}
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userReports.map(report => (
            <div key={report.report_id} className="bg-white p-5 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm hover:shadow-md transition-all">

              <CardHeader report={report} />
              <DeleteConfirm report={report} />

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Diagnosis</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{report.primary_diagnosis}</h3>
                {report.icd_code && (
                  <span className="text-[10px] font-mono text-slate-400 font-bold">ICD: {report.icd_code}</span>
                )}
              </div>

              {/* Confidence Score Bar */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">AI Confidence Score</span>
                  <span className={`${report.confidence_score >= 75 ? 'text-emerald-600' : report.confidence_score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {report.confidence_score}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${report.confidence_score >= 75 ? 'bg-emerald-500' : report.confidence_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${report.confidence_score}%` }}
                  />
                </div>
              </div>

              {/* Severity + Specialist row */}
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Severity: <strong className={`${report.severity_level === 'High' || report.severity_level === 'Emergency' ? 'text-rose-600' : 'text-amber-600'}`}>{report.severity_level || 'Moderate'}</strong></span>
                <span className="truncate ml-2 text-right text-slate-900 font-bold">{report.recommended_specialist}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenReport(report)}
                className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
