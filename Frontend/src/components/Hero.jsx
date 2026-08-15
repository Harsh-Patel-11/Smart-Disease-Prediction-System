import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Activity,
  ShieldCheck,
  Brain,
  FileCheck,
  Pill,
  ArrowRight,
  Database,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const Hero = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="relative overflow-hidden py-12 lg:py-20 bg-grid-pattern">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 animate-float">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Next-Generation Healthcare Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Smart Disease <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
              Prediction System
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            An automated diagnostic platform leveraging data-driven Machine Learning algorithms, 
            symptom pattern matching, automated digital prescriptions, and instant clinical report generation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('checker')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-extrabold text-base hover:opacity-95 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 group"
            >
              <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Diagnostic Check
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-white font-bold text-base hover:bg-slate-800/80 transition-all border border-slate-700 flex items-center justify-center gap-3"
            >
              <FileCheck className="w-5 h-5 text-violet-400" />
              View Medical History
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] text-center">
              <p className="text-2xl lg:text-3xl font-extrabold text-indigo-400">98.5%</p>
              <p className="text-xs text-slate-400 font-medium">Confidence Score</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] text-center">
              <p className="text-2xl lg:text-3xl font-extrabold text-violet-400">50+</p>
              <p className="text-xs text-slate-400 font-medium">Clinical Symptoms</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] text-center">
              <p className="text-2xl lg:text-3xl font-extrabold text-indigo-400">&lt; 3s</p>
              <p className="text-xs text-slate-400 font-medium">Response Latency</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.06] text-center">
              <p className="text-2xl lg:text-3xl font-extrabold text-violet-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Digital Rx Ready</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Comprehensive System Modules
            </h2>
            <p className="text-sm text-slate-400">
              Designed in accordance with IEEE Software Requirements Specifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Machine Learning Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates probability weights, primary vs differential diagnoses, and confidence percentages in real time based on disease-symptom relation matrices.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Multi-symptom weighted scoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Differential diagnosis rankings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Emergency cardiac/respiratory alerts</li>
              </ul>
            </div>

            <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Diagnosis & Prescriptions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantly generates downloadable clinical diagnosis reports complete with symptom severity breakdown, specialist referral, and electronic prescriptions.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> PDF & Print ready reports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Exact dosage & duration guidance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Digital doctor verification</li>
              </ul>
            </div>

            <div className="glass-panel-hover glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">RBAC Admin & Audit Controls</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-Based Access Control (Patient, Doctor, Admin) with complete master database management for symptoms, diseases, medicines, and login history logs.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-fuchsia-400" /> Master library CRUD operations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-fuchsia-400" /> Symptom mapping weight matrix</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-fuchsia-400" /> Full audit trail & login tracking</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
