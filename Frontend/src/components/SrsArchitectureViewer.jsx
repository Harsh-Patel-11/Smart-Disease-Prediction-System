import React, { useState } from 'react';
import {
  Layers,
  GitBranch,
  Database,
  Code2,
  Workflow,
  FileCheck,
  Table,
  CheckCircle2,
  Cpu,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const SrsArchitectureViewer = () => {
  const [activeDiagram, setActiveDiagram] = useState('dfd'); // dfd, erd, class, sequence, activity, dictionary, rtm, rules

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-2">
            <BookOpen className="w-4 h-4" /> Section 3 & 11 IEEE SRS Architecture & UML Visualizer
          </div>
          <h2 className="text-3xl font-extrabold text-white">System Architecture & UML Diagrams Explorer</h2>
          <p className="text-sm text-slate-400">Interactive visual documentation matching the formal SDPS Software Requirements Specification.</p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveDiagram('dfd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'dfd' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <GitBranch className="w-4 h-4" /> Data Flow Diagrams (DFD 0-2)
        </button>

        <button
          onClick={() => setActiveDiagram('erd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'erd' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Entity Relationship Diagram (ERD)
        </button>

        <button
          onClick={() => setActiveDiagram('class')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'class' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" /> UML Class Diagram
        </button>

        <button
          onClick={() => setActiveDiagram('sequence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'sequence' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Workflow className="w-4 h-4" /> Sequence Diagram
        </button>

        <button
          onClick={() => setActiveDiagram('activity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'activity' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> Activity Workflow
        </button>

        <button
          onClick={() => setActiveDiagram('dictionary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'dictionary' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" /> Data Dictionary (10 Tables)
        </button>

        <button
          onClick={() => setActiveDiagram('rtm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeDiagram === 'rtm' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" /> RTM Matrix
        </button>
      </div>

      {/* DFD Visualizer */}
      {activeDiagram === 'dfd' && (
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <h3 className="text-xl font-bold text-white">3.2.1 DFD Level 0 (Context Diagram)</h3>
            <p className="text-xs text-slate-400">High-level boundary model showing external entities (Patient & Admin) interacting with the SDPS Generator System.</p>
            
            {/* Visual Diagram Box */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-center w-40">
                Patient / User<br /><span className="text-[10px] text-slate-400 font-normal">Symptom Selection</span>
              </div>
              <div className="flex-1 text-center space-y-2">
                <div className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px]">
                  Input: Login Credentials, Symptoms, Diagnosis Requests
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-indigo-500/20">
                  SMART DISEASE PREDICTION SYSTEM (SDPS)
                </div>
                <div className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px]">
                  Output: Dashboards, Predictions, Clinical Reports, Prescriptions
                </div>
              </div>
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-bold text-center w-40">
                System Admin<br /><span className="text-[10px] text-slate-400 font-normal">Master Library Control</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <h3 className="text-xl font-bold text-white">3.2.2 DFD Level 1 (Major Modules Breakdown)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center font-bold text-white">
                1.0 Authentication Process
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center font-bold text-white">
                2.0 User Management
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center font-bold text-white">
                3.0 Symptom & Prediction Engine
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center font-bold text-white">
                4.0 Report & Prescription Module
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center font-bold text-white">
                5.0 Admin Control & Audit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ERD Visualizer */}
      {activeDiagram === 'erd' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">3.3 Entity Relationship Diagram (ERD Schema)</h3>
            <p className="text-xs text-slate-400">Relational schema enforcing Referential Integrity across 10 tables.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <span className="font-mono text-indigo-400 font-bold">USERS (Entity)</span>
              <p className="text-slate-400">PK: user_id | Fields: name, email, password, contact_no, role</p>
              <div className="text-[10px] text-violet-400">1:N with Predictions & Login_History</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <span className="font-mono text-indigo-400 font-bold">DISEASES & SYMPTOMS</span>
              <p className="text-slate-400">Junction: DISEASE_SYMPTOMS (FK disease_id, FK symptom_id, weight)</p>
              <div className="text-[10px] text-violet-400">M:N Relationship</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <span className="font-mono text-indigo-400 font-bold">PREDICTIONS & REPORTS</span>
              <p className="text-slate-400">FK prediction_id linked to DIAGNOSIS_REPORTS and PRESCRIPTIONS</p>
              <div className="text-[10px] text-violet-400">1:1 with Diagnosis Report</div>
            </div>
          </div>
        </div>
      )}

      {/* Class Diagram Visualizer */}
      {activeDiagram === 'class' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-6">
          <h3 className="text-xl font-bold text-white">3.4 Object-Oriented Class Diagram</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2 font-mono">
              <p className="text-indigo-400 font-bold text-sm">class User</p>
              <p className="text-slate-400">+ int user_id<br />+ string name<br />+ string email<br />+ string role</p>
              <p className="text-violet-400">+ register()<br />+ login()<br />+ updateProfile()</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2 font-mono">
              <p className="text-indigo-400 font-bold text-sm">class DiseaseEngine</p>
              <p className="text-slate-400">+ int prediction_id<br />+ float confidence_score<br />+ array mapping_rules</p>
              <p className="text-violet-400">+ predictDisease()<br />+ calculateConfidence()</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2 font-mono">
              <p className="text-indigo-400 font-bold text-sm">class ReportGenerator</p>
              <p className="text-slate-400">+ int report_id<br />+ string primary_diagnosis<br />+ array prescriptions</p>
              <p className="text-violet-400">+ generateReport()<br />+ exportPDF()</p>
            </div>
          </div>
        </div>
      )}

      {/* Sequence Diagram Visualizer */}
      {activeDiagram === 'sequence' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-6">
          <h3 className="text-xl font-bold text-white">3.5 Sequence Diagram (Time-Ordered Interaction)</h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
              <span className="font-bold text-white">Step 1: Patient selects symptoms on Web Browser</span>
              <span className="text-indigo-400 font-mono">Browser → Django Backend</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
              <span className="font-bold text-white">Step 2: Backend fetches disease-symptom mapping rules</span>
              <span className="text-indigo-400 font-mono">Django Server → MySQL Database</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
              <span className="font-bold text-white">Step 3: ML Engine computes weighted scores & confidence</span>
              <span className="text-indigo-400 font-mono">ML Prediction Engine</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
              <span className="font-bold text-white">Step 4: Save Prediction & auto-generate Diagnosis Report</span>
              <span className="text-violet-400 font-mono">Database Commit & UI Render</span>
            </div>
          </div>
        </div>
      )}

      {/* Data Dictionary Tab */}
      {activeDiagram === 'dictionary' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-6">
          <h3 className="text-xl font-bold text-white">Section 9: Appendices Data Dictionary</h3>
          <p className="text-xs text-slate-400">Complete database structure definitions for all 10 relational tables.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <h4 className="font-bold text-indigo-400">Table 1: USERS</h4>
              <p className="text-slate-300 font-mono">user_id (PK, int), name (varchar), email (varchar, unique), password (varchar), role (varchar)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <h4 className="font-bold text-indigo-400">Table 2: SYMPTOMS</h4>
              <p className="text-slate-300 font-mono">symptom_id (PK, int), symptom_name (varchar), category (varchar)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <h4 className="font-bold text-indigo-400">Table 3: DISEASE</h4>
              <p className="text-slate-300 font-mono">disease_id (PK, int), disease_name (varchar), category (varchar), precautions (text)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-2">
              <h4 className="font-bold text-indigo-400">Table 6: PREDICTION</h4>
              <p className="text-slate-300 font-mono">prediction_id (PK, int), user_id (FK), disease_id (FK), confidence_score (float), timestamp</p>
            </div>
          </div>
        </div>
      )}

      {/* RTM Tab */}
      {activeDiagram === 'rtm' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-6">
          <h3 className="text-xl font-bold text-white">Section 18: Requirement Traceability Matrix (RTM)</h3>
          
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] text-xs">
            <table className="w-full text-left">
              <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/[0.06]">
                <tr>
                  <th className="p-3">Req ID</th>
                  <th className="p-3">Requirement Description</th>
                  <th className="p-3">Associated System Module</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr><td className="p-3 font-mono text-indigo-400">FR01</td><td className="p-3 text-white">User Login & Role Authentication</td><td className="p-3 text-slate-300">Authentication Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR02</td><td className="p-3 text-white">User Registration</td><td className="p-3 text-slate-300">User Management Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR03</td><td className="p-3 text-white">Enter Symptoms Selection</td><td className="p-3 text-slate-300">Symptom Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR04</td><td className="p-3 text-white">Disease ML Prediction Engine</td><td className="p-3 text-slate-300">Prediction Engine Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR05</td><td className="p-3 text-white">View Diagnosis Report</td><td className="p-3 text-slate-300">Report Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR06</td><td className="p-3 text-white">Generate Digital Prescription</td><td className="p-3 text-slate-300">Prescription Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR07-FR09</td><td className="p-3 text-white">Manage Diseases, Symptoms & Medicines</td><td className="p-3 text-slate-300">Admin Control Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
                <tr><td className="p-3 font-mono text-indigo-400">FR10</td><td className="p-3 text-white">View System Login History & Audit</td><td className="p-3 text-slate-300">Logging Module</td><td className="p-3 text-violet-400 font-bold">Passed / Implemented</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
