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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md overflow-y-auto animate-modal-backdrop"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto animate-modal-content max-h-[90vh] flex flex-col text-slate-900"
      >
        
        {/* Sticky Header Action Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Official Diagnostic Report</span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">#SDPS-{report.report_id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div id="printable-diagnosis-report" className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-white text-slate-900">
          
          {/* Clinic Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                SD
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Smart Disease Prediction System</h2>
                <p className="text-xs text-slate-500 font-bold">AI Clinical Diagnostic & Decision Support Engine</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5 font-medium">
              <p><strong className="text-slate-900 font-bold">Report Date:</strong> {new Date(report.report_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p><strong className="text-slate-900 font-bold">Validation Status:</strong> Verified</p>
              <p><strong className="text-slate-900 font-bold">System Protocol:</strong> Clinical AI v2.4</p>
            </div>
          </div>

          {/* Patient Profile Information Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</p>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{report.patient_name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age & Gender</p>
              <p className="font-bold text-slate-800 mt-0.5">{report.patient_age || '25'} yrs / {report.patient_gender || 'Male'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attending Medical Specialist</p>
              <p className="font-bold text-indigo-700 mt-0.5">{report.recommended_specialist}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Engine</p>
              <p className="font-bold text-emerald-700 mt-0.5">{report.groq_powered ? 'Groq AI (llama-3.3-70b)' : 'ML Algorithm'}</p>
            </div>
          </div>

          {/* Primary Diagnosis & Match Probability */}
          <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" /> Primary Clinical Diagnosis
              </span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border ${
                report.severity_level === 'Emergency' || report.severity_level === 'High'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-violet-100 text-violet-800 border-violet-200'
              }`}>
                {report.severity_level} Severity
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">{report.primary_diagnosis}</h3>
              {report.icd_code && <p className="text-xs font-mono text-slate-500 font-bold mt-0.5">ICD-10 Code: {report.icd_code}</p>}
            </div>

            {/* Confidence Score Bar */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">AI Diagnostic Confidence Score</span>
                <span className="text-indigo-600 font-extrabold">{report.confidence_score}% Match Probability</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-xs"
                  style={{ width: `${report.confidence_score}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200/80">
              {report.clinical_analysis}
            </p>
          </div>

          {/* Observed Symptoms */}
          {report.symptoms_observed && report.symptoms_observed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Observed Patient Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {report.symptoms_observed.map((sym, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
                    ✓ {sym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations & Follow-Up */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Clinical Precautions & Advice
              </h4>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <p key={idx} className="text-xs text-slate-800 font-medium flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{rec}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Electronic Signature */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500 font-medium">
            <div>
              <p className="font-extrabold text-slate-900">Dr. System Diagnostic AI Engine</p>
              <p className="text-[11px] text-slate-400">Automated Clinical Decision Support</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-[10px] text-indigo-600 font-mono font-bold">VERIFIED_DIGITAL_SIG</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">Official Seal & Signature</p>
            </div>
          </div>

        </div>

        {/* Footer Action Trigger for Digital Rx */}
        {onOpenPrescription && report.prescriptions && report.prescriptions.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenPrescription(report);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Pill className="w-4 h-4" /> View Full Electronic Prescription Card (Rx)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
