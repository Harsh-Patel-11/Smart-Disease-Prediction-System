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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md overflow-y-auto animate-modal-backdrop"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto animate-modal-content max-h-[92vh] flex flex-col text-slate-900"
      >

        {/* Sticky Top Control Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Digital Prescription</span>
              <span className="text-[10px] font-mono text-violet-700 font-bold">#Rx-{report.report_id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handleDownloadPDF} className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Download Rx
            </button>
            <button onClick={handleDelete} className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200">
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>

        {/* Scrollable Printable Card */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          <div id="printable-prescription-card" className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-violet-600 font-serif">Rx</span>
                  <h3 className="text-lg font-extrabold text-slate-900">ELECTRONIC MEDICAL PRESCRIPTION</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Smart Disease Prediction System · Clinical Diagnostics</p>
              </div>

              <div className="text-right text-xs text-slate-500 font-medium">
                <p className="font-extrabold text-slate-900">Date: {new Date(report.report_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="text-slate-400 font-mono text-[10px]">Doc ID: #SDPS-MED-992</p>
              </div>
            </div>

            {/* Patient & Diagnosis Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Information</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{report.patient_name}</p>
                <p className="text-slate-600 font-medium">{report.patient_age || '25'} yrs · {report.patient_gender || 'Male'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosed Condition</p>
                <p className="font-extrabold text-indigo-700 text-sm mt-0.5">{report.primary_diagnosis}</p>
                <p className="text-slate-600 font-medium">Specialist: <strong className="text-slate-900 font-bold">{report.recommended_specialist}</strong></p>
              </div>
            </div>

            {/* Prescribed Medications */}
            {report.prescriptions && report.prescriptions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4 text-violet-600" /> Prescribed Medications & Dosages
                </h4>

                <div className="space-y-2.5">
                  {report.prescriptions.map((med, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-violet-50/60 border border-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{med.medicine_name}</p>
                          <p className="text-xs font-bold text-violet-700 mt-0.5">{med.dosage}</p>
                          {med.notes && (
                            <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-1">
                              <Info className="w-3 h-3 text-amber-600" /> {med.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-white text-slate-700 font-bold border border-slate-200 shadow-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {med.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                No specific medicines listed for this diagnostic entry. Consult attending physician for tailored pharmacotherapy.
              </div>
            )}

            {/* Precautions */}
            {precautions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Precautions & Clinical Advice
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  {precautions.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Signature */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500 font-medium">
              <div>
                <p className="font-extrabold text-slate-900">Dr. System Diagnostic AI</p>
                <p className="text-[10px] text-slate-400">Electronic Health Record Verification</p>
              </div>
              <div className="text-right">
                <div className="w-32 h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                  <span className="text-[10px] text-violet-700 font-mono font-bold">DIGITAL_RX_SEAL</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">Authorized Medical Seal</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
