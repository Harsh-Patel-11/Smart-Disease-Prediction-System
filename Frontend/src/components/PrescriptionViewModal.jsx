import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill, Printer, Download, X, Shield, XCircle, Trash2,
  AlertTriangle, CheckCircle2, Clock, Info, Calendar,
  Stethoscope, Activity, ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const PrescriptionViewModal = ({ report, onClose }) => {
  const { deleteReport } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!report) return null;

  const handleDelete = () => {
    deleteReport(report.report_id);
    onClose();
  };

  const handleDownloadPDF = async () => {
    const rxElement = document.getElementById('printable-prescription-card');
    if (!rxElement) return;
    try {
      const canvas = await html2canvas(rxElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SDPS_Prescription_Rx_${report.report_id}.pdf`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  const precautions = Array.isArray(report.recommendations) && report.recommendations.length > 0
    ? report.recommendations
    : report.clinical_advice
      ? [report.clinical_advice]
      : [];

  const warnings = Array.isArray(report.emergency_warnings) ? report.emergency_warnings : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a0a1a]/85 backdrop-blur-md overflow-y-auto animate-modal-backdrop"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-auto animate-modal-content max-h-[92vh] flex flex-col"
      >

        {/* Sticky Top Control Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Digital Prescription</span>
              <span className="text-[10px] font-mono text-violet-400">#Rx-{report.report_id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handleDownloadPDF} className="px-3 py-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-violet-500/20 cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Download Rx
            </button>
            <button onClick={handleDelete} className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer" title="Delete Prescription & Report">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer" title="Close (Esc)">
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>

        {/* Scrollable Printable Card */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-[#0a0a1a] text-slate-100 space-y-6">
          <div id="printable-prescription-card" className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/[0.06] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-violet-400 font-serif">Rx</span>
                  <h3 className="text-lg font-bold text-white">ELECTRONIC MEDICAL PRESCRIPTION</h3>
                </div>
                <p className="text-xs text-slate-400">Smart Disease Prediction System · Groq AI Clinical Module</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p className="font-mono text-white">Rx-{report.report_id}</p>
                <p className="flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />{new Date(report.report_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                {report.groq_powered && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-semibold">Groq AI Powered</span>
                )}
              </div>
            </div>

            {/* Patient Meta */}
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Patient</span>
                <strong className="text-white">{report.patient_name}</strong>
                {(report.patient_age || report.patient_gender) && (
                  <span className="text-slate-400"> · {report.patient_age && `${report.patient_age} yrs`}{report.patient_gender && `, ${report.patient_gender}`}</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Primary Diagnosis</span>
                <strong className="text-indigo-400">{report.primary_diagnosis}</strong>
                {report.icd_code && <span className="text-slate-500 text-[10px] ml-1">({report.icd_code})</span>}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Confidence Score</span>
                <span className={`font-bold ${report.confidence_score >= 75 ? 'text-emerald-400' : report.confidence_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {report.confidence_score}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Severity</span>
                <span className={`font-bold ${report.severity_level === 'High' || report.severity_level === 'Emergency' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {report.severity_level || 'Moderate'}
                </span>
              </div>
            </div>

            {/* ─── PRESCRIBED MEDICATIONS ─── */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-3.5 h-3.5 text-violet-400" /> Prescribed Medications
              </h4>

              {report.prescriptions && report.prescriptions.length > 0 ? (
                <div className="space-y-3">
                  {report.prescriptions.map((med, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-violet-500/15 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-sm">{med.medicine_name}</h5>
                            <p className="text-xs text-indigo-300 font-medium">{med.dosage}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {med.duration}
                          </span>
                        </div>
                      </div>
                      {med.notes && (
                        <p className="text-[11px] text-amber-300/80 flex items-start gap-1.5 pl-11">
                          <Info className="w-3 h-3 shrink-0 mt-0.5" /> {med.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No medicines prescribed.</p>
              )}
            </div>

            {/* ─── PRECAUTIONS & RECOMMENDATIONS ─── */}
            {precautions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Precautions & Recommendations
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/15 space-y-2">
                  {precautions.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── RECOMMENDED SPECIALIST ─── */}
            {report.recommended_specialist && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-400" /> Recommended Specialist
                </h4>
                <div className="px-4 py-3 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 text-sm font-semibold text-indigo-300">
                  {report.recommended_specialist}
                </div>
              </div>
            )}

            {/* ─── FOLLOW-UP ADVICE ─── */}
            {report.follow_up_advice && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> Follow-Up Advice
                </h4>
                <div className="px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-200">
                  {report.follow_up_advice}
                </div>
              </div>
            )}

            {/* ─── EMERGENCY WARNINGS ─── */}
            {warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Emergency Warning Signs
                </h4>
                <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 space-y-2">
                  <p className="text-[10px] text-rose-300/80 mb-2">Seek immediate emergency care if you experience any of the following:</p>
                  {warnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guidelines */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/[0.06] text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">General Pharmacy Guidelines:</p>
              <p>1. Take all medications exactly as prescribed. Do not alter dosage without medical advice.</p>
              <p>2. Complete the full prescribed course even if symptoms resolve earlier.</p>
              <p>3. Store medicines in a cool, dry place away from direct sunlight and children's reach.</p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs">
              <span className="text-violet-400 flex items-center gap-1 font-semibold">
                <Shield className="w-4 h-4" /> Electronically Signed & Verified by SDPS AI System
              </span>
              <div className="text-right text-[10px] font-mono text-slate-500">
                SDPS RX VERIFIED
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="sticky bottom-0 z-30 flex items-center justify-end px-6 py-4 bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/[0.08] shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" /> Close Prescription
          </button>
        </div>

      </div>
    </div>
  );
};
