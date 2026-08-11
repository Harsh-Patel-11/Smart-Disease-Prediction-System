import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  X,
  Award,
  ShieldCheck,
  Stethoscope,
  Pill,
  Building2,
  XCircle,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Brain,
  CalendarClock,
  Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DiagnosisReportModal = ({ report, onClose, onOpenPrescription }) => {
  const { deleteReport } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!report) return null;

  const handleDelete = () => {
    deleteReport(report.report_id);
    onClose();
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('printable-diagnosis-report');
    if (!reportElement) return;

    try {
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SDPS_Diagnosis_Report_${report.report_id}.pdf`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a0a1a]/85 backdrop-blur-md overflow-y-auto animate-modal-backdrop"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-auto animate-modal-content max-h-[90vh] flex flex-col"
      >
        
        {/* Sticky Header Action Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Official Diagnostic Report</span>
              <span className="text-[10px] font-mono text-indigo-400">#SDPS-{report.report_id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Delete Report"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Close Report (Esc)"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Document Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-[#0a0a1a] text-slate-100 space-y-6">
          <div id="printable-diagnosis-report" className="space-y-6">
            
            {/* Clinic / System Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/[0.06] pb-6 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-xl font-extrabold text-white">SMART DISEASE PREDICTION SYSTEM</h2>
                </div>
                <p className="text-xs text-slate-400 font-medium">Department of AI Diagnostics & Clinical Decision Support</p>
                <p className="text-[11px] text-slate-500 font-mono">ISO 27001 Certified • SRS Compliant Module UC-05/UC-06</p>
                {/* AI model badge */}
                {report.groq_powered ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                    <Sparkles className="w-3 h-3" /> Groq AI · {report.ai_model || 'llama-3.3-70b-versatile'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                    <Activity className="w-3 h-3" /> Local ML Engine (offline fallback)
                  </span>
                )}
              </div>

              <div className="text-left sm:text-right space-y-1 text-xs text-slate-400">
                <p><span className="text-slate-500">Report ID:</span> <strong className="text-white font-mono">#SDPS-{report.report_id}</strong></p>
                <p><span className="text-slate-500">Issued On:</span> <strong className="text-white">{new Date(report.report_date).toLocaleString()}</strong></p>
                <p><span className="text-slate-500">Verification Status:</span> <span className="text-violet-400 font-semibold">VERIFIED AI RESULT</span></p>
                {report.urgency_level && (
                  <p><span className="text-slate-500">Urgency:</span> <span className={`font-bold ${
                    report.urgency_level === 'Emergency' ? 'text-rose-400'
                    : report.urgency_level === 'Urgent' ? 'text-amber-400'
                    : 'text-emerald-400'
                  }`}>{report.urgency_level}</span></p>
                )}
              </div>
            </div>

            {/* Patient Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <div>
                <p className="text-slate-500">Patient Name</p>
                <p className="font-bold text-white text-sm">{report.patient_name}</p>
              </div>
              <div>
                <p className="text-slate-500">Age / Gender</p>
                <p className="font-bold text-white text-sm">{report.patient_age ? `${report.patient_age} Yrs` : 'N/A'} {report.patient_gender ? `/ ${report.patient_gender}` : ''}</p>
              </div>
              <div>
                <p className="text-slate-500">Confidence Level</p>
                <p className="font-extrabold text-indigo-400 text-sm">{report.confidence_score}% Match</p>
              </div>
            </div>

            {/* Primary Diagnosis Summary Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> PRIMARY AI DIAGNOSIS RESULT
                </span>
                <div className="flex items-center gap-2">
                  {report.icd_code && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20">
                      ICD: {report.icd_code}
                    </span>
                  )}
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Confidence: {report.confidence_score}%
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-white">{report.primary_diagnosis}</h3>

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Evaluated Input Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {report.symptoms_summary.map((sym, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Clinical Analysis */}
            {report.clinical_analysis && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5 text-sm">
                  <Brain className="w-4 h-4" /> AI Clinical Analysis
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">{report.clinical_analysis}</p>
              </div>
            )}

            {/* AI Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Clinical Recommendations
                </h4>
                <ul className="space-y-1.5">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Warnings */}
            {report.emergency_warnings && report.emergency_warnings.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <h4 className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4" /> Emergency Warning Signs
                </h4>
                <p className="text-[11px] text-rose-200/70">Seek immediate emergency care if any of the following occur:</p>
                <ul className="space-y-1.5">
                  {report.emergency_warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-rose-200">
                      <span className="text-rose-400 mt-0.5 shrink-0">⚠</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clinical Advice & Recommended Specialist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-violet-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Clinical Precautions & Advice
                </h4>
                <p className="text-slate-300 leading-relaxed">{report.clinical_advice || report.clinical_analysis || 'Follow your doctor\'s instructions.'}</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4" /> Recommended Specialist
                  </h4>
                  <p className="text-slate-200 font-semibold">{report.recommended_specialist}</p>
                  <p className="text-slate-400">Consult with the recommended specialist for formal clinical evaluation and lab tests.</p>
                </div>
                {report.follow_up_advice && (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-1.5">
                    <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <CalendarClock className="w-4 h-4" /> Follow-Up Advice
                    </h4>
                    <p className="text-slate-300">{report.follow_up_advice}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prescribed Medications Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-indigo-400" /> Prescribed Medications Schedule
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenPrescription) onOpenPrescription(report);
                  }}
                  className="text-xs text-indigo-400 hover:underline font-semibold"
                >
                  View Full Digital Prescription Card →
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/[0.06]">
                    <tr>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Dosage Instruction</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {report.prescriptions.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{med.medicine_name}</td>
                        <td className="p-3 text-indigo-300">{med.dosage}</td>
                        <td className="p-3 text-slate-300">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="pt-6 border-t border-white/[0.06] flex justify-between items-end text-xs text-slate-400">
              <div>
                <p className="text-[10px] text-slate-500 font-mono">COMPUTER GENERATED CLINICAL REPORT • VERIFIED BY SDPS AI</p>
                <p>SDPS AI Core · {report.ai_model || 'Local ML Engine'}</p>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                OFFICIAL SYSTEM DIAGNOSIS
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="sticky bottom-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/[0.08] shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onOpenPrescription) onOpenPrescription(report);
            }}
            className="px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Pill className="w-4 h-4" /> View Prescription Card
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" /> Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
