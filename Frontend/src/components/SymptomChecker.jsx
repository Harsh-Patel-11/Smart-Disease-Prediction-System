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
      const result = await predictDiseaseWithAI(selectedSymptoms, severities);
      setPredictionResult(result);

      if (result?.primary && result.primary.confidence_score >= 80) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
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

  const isEmergency = selectedSymptoms.includes(5) && selectedSymptoms.includes(4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-2">
            <Stethoscope className="w-4 h-4 text-indigo-600" /> UC-02 Symptom Entry & ML Engine
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Symptom Checker & Diagnostic Engine</h2>
          <p className="text-sm text-slate-500 font-medium">Select observed patient symptoms to trigger automated disease prediction rules.</p>
        </div>

        {selectedSymptoms.length > 0 && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white text-xs text-slate-700 hover:text-slate-900 flex items-center gap-2 border border-slate-200 shadow-xs hover:bg-slate-50 transition-all font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Selection ({selectedSymptoms.length})
          </button>
        )}
      </div>

      {/* Emergency Alert Banner */}
      {isEmergency && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 flex items-start gap-4 shadow-md animate-pulse">
          <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-rose-900 text-base">CRITICAL EMERGENCY SYMPTOM DETECTED</h4>
            <p className="text-xs text-rose-700 font-medium">
              Combination of <span className="font-bold underline">Chest Pain</span> and <span className="font-bold underline">Shortness of Breath (Dyspnea)</span> indicates potential Acute Coronary Syndrome or Respiratory Distress. Seek immediate emergency ambulance evaluation!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Symptom Selection Library */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Search & Category Filter */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms (e.g. Fever, Cough, Chest Pain)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
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
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200/90 hover:border-indigo-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleSymptom(sym.symptom_id)}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-indigo-600">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{sym.symptom_name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-indigo-700 font-bold border border-slate-200">
                            {sym.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{sym.description}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-600 shrink-0 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 font-semibold">
                      {sym.body_part}
                    </span>
                  </div>

                  {/* Severity Controls when selected */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-indigo-200/60 flex items-center justify-between gap-4 text-xs">
                      <span className="text-slate-600 font-bold flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Severity:
                      </span>
                      <div className="flex items-center gap-2">
                        {['Mild', 'Moderate', 'Severe'].map(sev => (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => handleSeverityChange(sym.symptom_id, sev)}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              severities[sym.symptom_id] === sev
                                ? sev === 'Severe'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            {isProcessing ? (
              <>
                <Activity className="w-5 h-5 animate-spin text-white" />
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

        {/* Right Column: ML Prediction Results Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-6">
            
            {!predictionResult ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                  <Activity className="w-8 h-8 animate-pulse text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Prediction Console Idle</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Select one or more symptoms from the checklist on the left and click <span className="text-indigo-600 font-bold">"Predict Disease"</span> to calculate diagnostic match probabilities.
                </p>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 text-left space-y-1">
                  <p className="font-bold text-indigo-700">Sample Test Sequences:</p>
                  <p>1. <span className="text-slate-900 font-medium">Fever + Headache + Pain Behind Eyes</span> → Dengue</p>
                  <p>2. <span className="text-slate-900 font-medium">Cough + Shortness of Breath + Wheezing</span> → Pneumonia</p>
                  <p>3. <span className="text-slate-900 font-medium">Heartburn + Nausea</span> → GERD</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-indigo-200 space-y-6 shadow-xl shadow-slate-200/50">
                
                {/* Groq AI / Fallback Badge */}
                {predictionResult.groqPowered ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Powered by Groq AI · llama-3.3-70b-versatile
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold w-fit">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    Local ML Engine (Groq offline)
                  </div>
                )}

                {/* Primary Result Banner */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" /> Top Primary Match
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                      predictionResult.primary.severity_level === 'Emergency' || predictionResult.primary.severity_level === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-violet-50 text-violet-700 border-violet-200'
                    }`}>
                      {predictionResult.primary.severity_level} Severity
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{predictionResult.primary.disease_name}</h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{predictionResult.primary.category}</p>
                  </div>

                  {/* Confidence Score Bar */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{predictionResult.groqPowered ? 'Groq AI Match Score' : 'ML Match Score'}</span>
                      <span className="text-indigo-600">{predictionResult.primary.confidence_score}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-xs"
                        style={{ width: `${predictionResult.primary.confidence_score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-medium">
                    {predictionResult.primary.description}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-violet-700 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Recommended Clinical Specialist:
                    </p>
                    <p className="text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-bold">
                      {predictionResult.primary.recommended_specialist}
                    </p>
                  </div>
                </div>

                {/* Differential Diagnoses */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Differential Diagnosis Alternatives</h4>
                  <div className="space-y-2">
                    {predictionResult.differentials.map((diff, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <span className="font-bold text-slate-800">{diff.disease_name}</span>
                        <span className="font-mono text-indigo-600 font-extrabold">{diff.confidence_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Trigger for Official Report */}
                <button
                  onClick={handleGenerateReportClick}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  Generate Official Report & Prescription
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
