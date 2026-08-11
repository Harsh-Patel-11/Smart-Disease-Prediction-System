import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  Activity,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  FileCheck,
  RotateCcw,
  Sliders,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SymptomChecker = ({ onOpenReport }) => {
  const { symptoms, predictDisease, predictDiseaseWithAI, generateDiagnosisReport, setActiveTab } = useApp();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severities, setSeverities] = useState({});
  const [durations, setDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const categories = ['All', 'General', 'Neurological', 'Respiratory', 'Cardiovascular', 'Gastrointestinal', 'Musculoskeletal', 'Dermatological'];

  const filteredSymptoms = symptoms.filter(s => {
    const matchesSearch = s.symptom_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(prev => prev.filter(item => item !== id));
      const newSev = { ...severities };
      delete newSev[id];
      setSeverities(newSev);
    } else {
      setSelectedSymptoms(prev => [...prev, id]);
      setSeverities(prev => ({ ...prev, [id]: 'Moderate' }));
      setDurations(prev => ({ ...prev, [id]: '3-5 Days' }));
    }
  };

  const handleSeverityChange = (id, sev) => {
    setSeverities(prev => ({ ...prev, [id]: sev }));
  };

  const handleRunPrediction = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsProcessing(true);

    try {
      // Try Groq AI backend first
      const result = await predictDiseaseWithAI(selectedSymptoms, severities);
      setPredictionResult(result);

      // Trigger high confidence confetti if >= 80%
      if (result?.primary && result.primary.confidence_score >= 80) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      // Should not reach here since predictDiseaseWithAI has internal fallback
      console.error('Prediction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setSeverities({});
    setDurations({});
    setPredictionResult(null);
    setGeneratedReport(null);
  };

  const handleGenerateReportClick = () => {
    if (!predictionResult) return;
    const selectedSymptomNames = selectedSymptoms.map(id => {
      const s = symptoms.find(sym => sym.symptom_id === id);
      const sev = severities[id] || 'Moderate';
      return `${s ? s.symptom_name : ''} (${sev})`;
    });

    const report = generateDiagnosisReport(
      predictionResult.predictionEntry,
      predictionResult.primary,
      selectedSymptomNames
    );
    setGeneratedReport(report);
    if (onOpenReport) {
      onOpenReport(report);
    }
  };

  const isEmergency = selectedSymptoms.includes(5) && selectedSymptoms.includes(4); // Chest pain + Dyspnea

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <Stethoscope className="w-4 h-4" /> UC-02 Symptom Entry & ML Engine
          </div>
          <h2 className="text-3xl font-extrabold text-white">AI Symptom Checker & Diagnostic Engine</h2>
          <p className="text-sm text-slate-400">Select observed patient symptoms to trigger automated disease prediction rules.</p>
        </div>

        {selectedSymptoms.length > 0 && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto px-4 py-2 rounded-xl glass-panel text-xs text-slate-300 hover:text-white flex items-center gap-2 border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Selection ({selectedSymptoms.length})
          </button>
        )}
      </div>

      {/* Emergency Alert Banner */}
      {isEmergency && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 flex items-start gap-4 shadow-xl shadow-rose-500/10 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-base">CRITICAL EMERGENCY SYMPTOM DETECTED</h4>
            <p className="text-xs text-rose-200">
              Combination of <span className="font-bold underline">Chest Pain</span> and <span className="font-bold underline">Shortness of Breath (Dyspnea)</span> indicates potential Acute Coronary Syndrome or Respiratory Distress. Seek immediate emergency ambulance evaluation!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Symptom Selection Library (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Search & Category Filter */}
          <div className="glass-panel p-5 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms (e.g. Fever, Cough, Chest Pain)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-500 text-slate-950 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Checklist Cards */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredSymptoms.map(sym => {
              const isSelected = selectedSymptoms.includes(sym.symptom_id);
              return (
                <div
                  key={sym.symptom_id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : 'glass-panel border-white/[0.06] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleSymptom(sym.symptom_id)}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-indigo-400">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-400 fill-indigo-500/20" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{sym.symptom_name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-mono">
                            {sym.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{sym.description}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.06]">
                      {sym.body_part}
                    </span>
                  </div>

                  {/* Severity Controls when selected */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-4 text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Severity:
                      </span>
                      <div className="flex items-center gap-2">
                        {['Mild', 'Moderate', 'Severe'].map(sev => (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => handleSeverityChange(sym.symptom_id, sev)}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              severities[sym.symptom_id] === sev
                                ? sev === 'Severe'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Trigger Button */}
          <button
            onClick={handleRunPrediction}
            disabled={selectedSymptoms.length === 0 || isProcessing}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all ${
              selectedSymptoms.length > 0 && !isProcessing
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 shadow-xl shadow-indigo-500/25 hover:opacity-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Activity className="w-5 h-5 animate-spin text-slate-950" />
                Predicting Disease...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Predict Disease ({selectedSymptoms.length} Symptoms)
              </>
            )}
          </button>
        </div>

        {/* Right Column: ML Prediction Results Panel (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            
            {!predictionResult ? (
              <div className="glass-panel p-8 rounded-3xl border border-white/[0.06] text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                  <Activity className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white">Prediction Console Idle</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Select one or more symptoms from the clinical checklist on the left and click <span className="text-indigo-400 font-semibold">"Run ML Prediction Engine"</span> to generate diagnostic confidence probabilities.
                </p>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-white/[0.06] text-[11px] text-slate-400 text-left space-y-1">
                  <p className="font-semibold text-indigo-400">Sample Test Sequences:</p>
                  <p>1. <span className="text-white">Fever + Headache + Pain Behind Eyes</span> → Dengue</p>
                  <p>2. <span className="text-white">Cough + Shortness of Breath + Wheezing</span> → Pneumonia</p>
                  <p>3. <span className="text-white">Heartburn + Nausea</span> → GERD</p>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl shadow-indigo-500/10">
                
                {/* Groq AI / Fallback Badge */}
                {predictionResult.groqPowered ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Powered by Groq AI · llama-3.3-70b-versatile
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold w-fit">
                    <Activity className="w-3.5 h-3.5" />
                    Local ML Engine (Groq backend offline)
                  </div>
                )}

                {/* Primary Result Banner */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Top Primary Match
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                      predictionResult.primary.severity_level === 'Emergency' || predictionResult.primary.severity_level === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                    }`}>
                      {predictionResult.primary.severity_level} Severity
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white">{predictionResult.primary.disease_name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{predictionResult.primary.category}</p>
                  </div>

                  {/* Confidence Score Bar */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{predictionResult.groqPowered ? 'Groq AI Confidence Score' : 'ML Confidence Score'}</span>
                      <span className="text-indigo-400">{predictionResult.primary.confidence_score}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${predictionResult.primary.confidence_score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-white/[0.06]">
                    {predictionResult.primary.description}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-violet-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Recommended Clinical Specialist:
                    </p>
                    <p className="text-slate-200 bg-white/[0.03] p-2 rounded-lg border border-white/[0.06] font-medium">
                      {predictionResult.primary.recommended_specialist}
                    </p>
                  </div>
                </div>

                {/* Differential Diagnoses */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Differential Diagnosis Alternatives</h4>
                  <div className="space-y-2">
                    {predictionResult.differentials.map((diff, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs">
                        <span className="font-medium text-slate-200">{diff.disease_name}</span>
                        <span className="font-mono text-indigo-400 font-bold">{diff.confidence_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Trigger for Official Report */}
                <button
                  onClick={handleGenerateReportClick}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-400 text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  Generate Official Diagnosis & Prescription Report
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
