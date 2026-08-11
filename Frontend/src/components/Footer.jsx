import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Shield, Code2, Globe, Heart } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="glass-panel border-t border-white/[0.06] bg-slate-950/90 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Smart Disease Prediction System <span className="text-indigo-400 font-normal text-xs">(SDPS)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A comprehensive clinical decision support web application built strictly in compliance with IEEE Software Requirements Specification standards. Features ML disease prediction, automated diagnosis report generation, electronic prescriptions, and audit control.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-white uppercase tracking-wider mb-2">Quick Navigation</p>
            <ul className="space-y-1.5">
              <li><button onClick={() => setActiveTab('hero')} className="hover:text-indigo-400 transition-colors">Overview</button></li>
              <li><button onClick={() => setActiveTab('checker')} className="hover:text-indigo-400 transition-colors">AI Symptom Checker</button></li>
              <li><button onClick={() => setActiveTab('history')} className="hover:text-indigo-400 transition-colors">Reports & Prescriptions</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-indigo-400 transition-colors">Admin Management</button></li>
              <li><button onClick={() => setActiveTab('srs')} className="hover:text-indigo-400 transition-colors">SRS Architecture Models</button></li>
            </ul>
          </div>

          {/* Compliance & Specs */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-white uppercase tracking-wider mb-2">Technical Standards</p>
            <p className="text-slate-400 font-mono text-[11px]">• IEEE-830 SRS Compliant</p>
            <p className="text-slate-400 font-mono text-[11px]">• 10 Master Database Entities</p>
            <p className="text-slate-400 font-mono text-[11px]">• Role-Based Access Control</p>
            <p className="text-slate-400 font-mono text-[11px]">• Automated PDF Exporting</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Disease Prediction System. Developed for Academic Software Engineering Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> React & Vite
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
