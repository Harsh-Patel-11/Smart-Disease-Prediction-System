import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_SYMPTOMS,
  INITIAL_DISEASES,
  INITIAL_DISEASE_SYMPTOMS,
  INITIAL_MEDICINES,
  DISEASE_MEDICINE_MAP,
  INITIAL_PREDICTIONS,
  INITIAL_DIAGNOSIS_REPORTS,
  INITIAL_LOGIN_HISTORY
} from '../data/initialData';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from '../firebase/config';

const AppContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://empty-banks-make.loca.lt';

export const AppProvider = ({ children }) => {
  const getStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`sdps_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = (key, data) => {
    try {
      localStorage.setItem(`sdps_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const loadSymptoms = () => {
    const saved = getStored('symptoms', INITIAL_SYMPTOMS);
    return saved.map(s => {
      const init = INITIAL_SYMPTOMS.find(i => i.symptom_id === s.symptom_id);
      return init ? { ...s, symptom_name: init.symptom_name, description: init.description } : s;
    });
  };

  const loadDiseases = () => {
    const saved = getStored('diseases', INITIAL_DISEASES);
    return saved.map(d => {
      const init = INITIAL_DISEASES.find(i => i.disease_id === d.disease_id);
      return init ? { ...d, disease_name: init.disease_name, description: init.description } : d;
    });
  };

  const [currentUser, setCurrentUser] = useState(() => getStored('currentUser', null));
  const [activeTab, setActiveTab] = useState('checker');
  const [users, setUsers] = useState(() => getStored('users', INITIAL_USERS));
  const [symptoms, setSymptoms] = useState(loadSymptoms);
  const [diseases, setDiseases] = useState(loadDiseases);
  const [mappings, setMappings] = useState(() => getStored('mappings', INITIAL_DISEASE_SYMPTOMS));
  const [medicines, setMedicines] = useState(() => getStored('medicines', INITIAL_MEDICINES));
  const [predictions, setPredictions] = useState(() => getStored('predictions', INITIAL_PREDICTIONS));
  const [reports, setReports] = useState(() => getStored('reports', INITIAL_DIAGNOSIS_REPORTS));
  const [loginHistory, setLoginHistory] = useState(() => getStored('loginHistory', INITIAL_LOGIN_HISTORY));

  useEffect(() => setStored('currentUser', currentUser), [currentUser]);
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('symptoms', symptoms), [symptoms]);
  useEffect(() => setStored('diseases', diseases), [diseases]);
  useEffect(() => setStored('mappings', mappings), [mappings]);
  useEffect(() => setStored('medicines', medicines), [medicines]);
  useEffect(() => setStored('predictions', predictions), [predictions]);
  useEffect(() => setStored('reports', reports), [reports]);
  useEffect(() => setStored('loginHistory', loginHistory), [loginHistory]);

  // Listen to Firebase Auth API state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase Auth API Session Active:', firebaseUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const syncWithBackendDb = async (userData) => {
    try {
      await fetch(`${BACKEND_URL}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
  };

  // Google Sign-In via Firebase Auth API
  const loginWithGoogle = async (selectedRole = 'Patient', customEmail = null, customName = null) => {
    try {
      let googleUser = null;
      if (customEmail) {
        googleUser = {
          displayName: customName || customEmail.split('@')[0],
          email: customEmail
        };
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        googleUser = result.user;
      }

      const lowerEmail = googleUser.email.toLowerCase();

      // STRICT ADMIN PERMISSION CHECK: Only hkpatel7874@gmail.com can log in as Admin
      if (selectedRole === 'Admin' && lowerEmail !== 'hkpatel7874@gmail.com') {
        return {
          success: false,
          message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
        };
      }

      const existingUser = users.find(u => u.email?.toLowerCase() === lowerEmail) ||
                           getStored(`profile_${lowerEmail}`, null);

      const userPayload = existingUser ? {
        ...existingUser,
        name: existingUser.name || googleUser.displayName || lowerEmail.split('@')[0],
        role: selectedRole
      } : {
        user_id: Date.now(),
        name: googleUser.displayName || googleUser.name || lowerEmail.split('@')[0],
        email: googleUser.email,
        password: 'GoogleAuthenticated',
        contact_no: '+1 (555) 019-2834',
        role: selectedRole,
        auth_provider: 'firebase_google',
        created_at: new Date().toISOString()
      };



      setUsers(prev => [userPayload, ...prev.filter(u => u.email?.toLowerCase() !== lowerEmail)]);
      setCurrentUser(userPayload);
      await syncWithBackendDb(userPayload);

      setLoginHistory(prev => [{
        login_id: Date.now(),
        user_id: userPayload.user_id,
        user_name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role,
        login_time: new Date().toISOString(),
        ip_address: "127.0.0.1 (Firebase Auth)",
        device_info: "Firebase API Google Provider"
      }, ...prev]);

      return { success: true, user: userPayload };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  // Login via Firebase Auth API (Email & Password)
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      const lowerEmail = email.toLowerCase();

      // Check if user is trying to access Admin but isn't hkpatel7874@gmail.com
      const existingUser = users.find(u => u.email?.toLowerCase() === lowerEmail) ||
                           getStored(`profile_${lowerEmail}`, null);

      if (existingUser && existingUser.role === 'Admin' && lowerEmail !== 'hkpatel7874@gmail.com') {
        return {
          success: false,
          message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
        };
      }

      const found = existingUser ? {
        ...existingUser,
        role: existingUser.role || 'Patient'
      } : {
        user_id: Date.now(),
        name: fbUser.displayName || lowerEmail.split('@')[0],
        email: fbUser.email,
        role: 'Patient',
        password
      };



      setCurrentUser(found);
      await syncWithBackendDb(found);
      
      setLoginHistory(prev => [{
        login_id: Date.now(),
        user_id: found.user_id,
        user_name: found.name,
        email: found.email,
        role: found.role,
        login_time: new Date().toISOString(),
        ip_address: "127.0.0.1 (Firebase Auth)",
        device_info: "Firebase API Email/Password"
      }, ...prev]);

      return { success: true, user: found };
    } catch (err) {
      // Local fallback lookup
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found) {
        setCurrentUser(found);
        syncWithBackendDb(found);
        return { success: true, user: found };
      }
      return { success: false, message: err.message || "Invalid credentials." };
    }
  };

  // Register via Firebase Auth API
  const registerUser = async (userPayload) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userPayload.email, userPayload.password);
      const fbUser = userCredential.user;
      
      const fullUserPayload = {
        ...userPayload,
        user_id: Date.now(),
        auth_provider: 'firebase_email'
      };

      setUsers(prev => [fullUserPayload, ...prev]);
      setCurrentUser(fullUserPayload);
      await syncWithBackendDb(fullUserPayload);

      return { success: true, user: fullUserPayload };
    } catch (err) {
      const fullUserPayload = {
        ...userPayload,
        user_id: Date.now(),
        auth_provider: 'local'
      };
      setUsers(prev => [fullUserPayload, ...prev]);
      setCurrentUser(fullUserPayload);
      await syncWithBackendDb(fullUserPayload);
      return { success: true, user: fullUserPayload };
    }
  };

  // Firebase Phone Auth - Send OTP SMS API
  const sendPhoneOtp = async (phoneNumber) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {}
        });
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true, message: 'OTP sent via SMS successfully.' };
    } catch (err) {
      console.error('Firebase Phone OTP Error:', err);
      return { success: false, message: err.message || 'Failed to send OTP.' };
    }
  };

  // Firebase Phone Auth - Verify 6-Digit OTP API
  const verifyPhoneOtp = async (otpCode, selectedRole = 'Patient', phoneNumber = '') => {
    try {
      let verifiedUser = null;
      if (window.confirmationResult) {
        const result = await window.confirmationResult.confirm(otpCode);
        verifiedUser = result.user;
      }

      const cleanPhone = phoneNumber || verifiedUser?.phoneNumber || '+91 99999 99999';
      const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
      const phoneEmail = `${cleanDigits}@phone.sdps.health`;

      const existingUser = users.find(u => u.contact_no?.replace(/[^0-9]/g, '') === cleanDigits || u.email === phoneEmail) ||
                           getStored(`profile_phone_${cleanDigits}`, null);

      // STRICT ADMIN CHECK FOR PHONE LOGINS
      if (selectedRole === 'Admin' && (!existingUser || existingUser.email?.toLowerCase() !== 'hkpatel7874@gmail.com')) {
        return {
          success: false,
          message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
        };
      }

      const userPayload = existingUser ? {
        ...existingUser,
        role: selectedRole
      } : {
        user_id: Date.now(),
        name: `Phone User (${cleanPhone})`,
        email: phoneEmail,
        contact_no: cleanPhone,
        role: selectedRole,
        auth_provider: 'firebase_phone',
        created_at: new Date().toISOString()
      };



      setUsers(prev => [userPayload, ...prev.filter(u => u.email !== userPayload.email)]);
      setCurrentUser(userPayload);
      await syncWithBackendDb(userPayload);

      setLoginHistory(prev => [{
        login_id: Date.now(),
        user_id: userPayload.user_id,
        user_name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role,
        login_time: new Date().toISOString(),
        ip_address: "127.0.0.1 (Firebase Auth)",
        device_info: "Firebase API Phone OTP"
      }, ...prev]);

      return { success: true, user: userPayload };
    } catch (err) {
      console.error('OTP Verification Error:', err);
      return { success: false, message: err.message || 'Invalid OTP code.' };
    }
  };

  const switchRole = (newRole) => {
    const foundRoleUser = users.find(u => u.role === newRole) || {
      user_id: Date.now(),
      name: `Guest ${newRole}`,
      email: `${newRole.toLowerCase()}@sdps.health`,
      role: newRole
    };
    setCurrentUser(foundRoleUser);
  };

  const logoutUser = () => {
    signOut(auth).catch(() => {});
    setCurrentUser(null);
  };

  // ─── Groq AI Disease Prediction (calls backend) ───────────────────────────
  const predictDiseaseWithAI = async (selectedSymptomIds, severities = {}) => {
    if (!selectedSymptomIds || selectedSymptomIds.length === 0) return null;

    // Build the local result first (rule-based fallback)
    const localResults = diseases.map(disease => {
      const diseaseMappings = mappings.filter(m => m.disease_id === disease.disease_id);
      if (diseaseMappings.length === 0) return { disease, score: 0, matchedSymptoms: [] };

      let weightedSum = 0;
      let maxPossibleWeight = 0;
      const matchedSymptoms = [];

      diseaseMappings.forEach(mapRule => {
        maxPossibleWeight += mapRule.weight;
        if (selectedSymptomIds.includes(mapRule.symptom_id)) {
          const symptomObj = symptoms.find(s => s.symptom_id === mapRule.symptom_id);
          const severityMultiplier = severities[mapRule.symptom_id] === 'Severe' ? 1.2
            : severities[mapRule.symptom_id] === 'Moderate' ? 1.0 : 0.85;
          const symptomScore = mapRule.weight * severityMultiplier;
          weightedSum += symptomScore;
          if (symptomObj) matchedSymptoms.push(symptomObj.symptom_name);
        }
      });

      let confidence = (weightedSum / maxPossibleWeight) * 100;
      const primaryCount = diseaseMappings.filter(m => m.is_primary && selectedSymptomIds.includes(m.symptom_id)).length;
      if (primaryCount > 0) confidence += primaryCount * 5;
      confidence = Math.min(Math.round(confidence * 10) / 10, 98.5);

      return {
        disease_id: disease.disease_id,
        disease_name: disease.disease_name,
        category: disease.category,
        severity_level: disease.severity_level,
        description: disease.description,
        precautions: disease.precautions,
        recommended_specialist: disease.recommended_specialist,
        confidence_score: Math.max(confidence, 12),
        matchedSymptoms
      };
    });

    localResults.sort((a, b) => b.confidence_score - a.confidence_score);
    const topLocal = localResults[0];

    // Build payload for Groq AI
    const symptomsPayload = selectedSymptomIds.map(id => {
      const s = symptoms.find(sym => sym.symptom_id === id);
      return {
        name: s ? s.symptom_name : `Symptom ${id}`,
        severity: severities[id] || 'Moderate',
        category: s ? s.category : '',
        description: s ? s.description : ''
      };
    });

    const newPredictionEntry = {
      prediction_id: Date.now(),
      user_id: currentUser ? currentUser.user_id : 99,
      user_name: currentUser ? currentUser.name : 'Guest Patient',
      symptoms_selected: selectedSymptomIds,
      disease_id: topLocal.disease_id,
      predicted_disease: topLocal.disease_name,
      confidence_score: topLocal.confidence_score, // will be updated after Groq responds
      prediction_date: new Date().toISOString(),
      status: 'Completed',
      notes: `Groq AI + ML engine evaluated ${selectedSymptomIds.length} symptoms.`
    };

    // Note: we set predictions after Groq responds so we have the AI score

    // 1. Try Backend API endpoint first
    try {
      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({
          symptoms: symptomsPayload,
          patientName: currentUser ? currentUser.name : 'Guest Patient',
          userId: currentUser ? currentUser.user_id : null,
          localPrediction: { disease_name: topLocal.disease_name, confidence_score: topLocal.confidence_score }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const ai = data.result;

        const aiConfidenceScore = ai.primaryDiagnosis?.confidenceScore ?? topLocal.confidence_score;

        const aiPrimary = {
          ...topLocal,
          disease_name: ai.primaryDiagnosis?.name ?? topLocal.disease_name,
          confidence_score: aiConfidenceScore,
          severity_level: ai.primaryDiagnosis?.severityLevel ?? topLocal.severity_level,
          category: ai.primaryDiagnosis?.category ?? topLocal.category,
          description: ai.primaryDiagnosis?.clinicalSummary ?? topLocal.description,
          recommended_specialist: ai.recommendedSpecialist ?? topLocal.recommended_specialist,
          icdCode: ai.primaryDiagnosis?.icdCode || '',
          urgencyLevel: ai.primaryDiagnosis?.urgencyLevel || 'Normal',
          ai_clinical_analysis: ai.clinicalAnalysis || '',
          ai_recommendations: ai.recommendations || [],
          ai_prescriptions: ai.prescriptions || [],
          ai_follow_up: ai.followUpAdvice || '',
          ai_emergency_warnings: ai.emergencyWarnings || [],
          groqPowered: true
        };

        const finalPredictionEntry = {
          ...newPredictionEntry,
          predicted_disease: aiPrimary.disease_name,
          confidence_score: aiConfidenceScore
        };
        setPredictions(prev => [finalPredictionEntry, ...prev]);

        const aiDifferentials = (ai.differentialDiagnoses || []).map((d, i) => ({
          ...(localResults[i + 1] || {}),
          disease_name: d.name,
          confidence_score: d.confidenceScore ?? (localResults[i + 1]?.confidence_score || 0),
          reason: d.reason
        }));

        return {
          primary: aiPrimary,
          differentials: aiDifferentials.length > 0 ? aiDifferentials : localResults.slice(1, 4),
          predictionEntry: finalPredictionEntry,
          groqPowered: true,
          predictionId: data.predictionId
        };
      }
    } catch (backendErr) {
      console.warn('[Backend Predict Failed] Retrying via direct Groq AI API client...', backendErr.message);
    }

    // 2. Direct Groq AI API client call fallback (works on live Firebase deployment)
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (groqKey) {
      try {
        const symptomsText = symptomsPayload.map(s => `• ${s.name} (Severity: ${s.severity || 'Moderate'})`).join('\n');
        const systemPrompt = `You are an expert medical AI diagnostic assistant integrated into a Smart Disease Prediction System (SDPS). You analyze patient symptoms and produce detailed clinical assessments. Always respond with valid JSON only — no markdown outside JSON.`;
        
        const userPrompt = `Analyze the following patient case and provide a clinical diagnosis and treatment plan.

Patient: ${currentUser?.name || 'Patient'}
REPORTED SYMPTOMS:
${symptomsText}

IMPORTANT: Compute a UNIQUE confidenceScore (integer 40-97) for primaryDiagnosis based on symptom match and severity.
Differential diagnoses confidence scores must be strictly lower.

Respond ONLY with a JSON object in this exact structure:
{
  "primaryDiagnosis": {
    "name": "Disease name",
    "icdCode": "ICD-10 code e.g. J18.9",
    "confidenceScore": 85,
    "severityLevel": "Moderate",
    "category": "General",
    "urgencyLevel": "Normal",
    "clinicalSummary": "Clinical summary of diagnosis based on symptoms"
  },
  "differentialDiagnoses": [
    { "name": "Disease 2", "confidenceScore": 60, "reason": "reason" },
    { "name": "Disease 3", "confidenceScore": 40, "reason": "reason" }
  ],
  "clinicalAnalysis": "Detailed 2-3 paragraph clinical analysis explaining the pathophysiology and diagnostic reasoning",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "prescriptions": [
    { "medicine": "Medicine name", "dosage": "500mg", "frequency": "Twice daily", "duration": "5 days", "notes": "Take after meals" }
  ],
  "recommendedSpecialist": "General Physician / Specialist",
  "followUpAdvice": "Follow up within 3-5 days.",
  "emergencyWarnings": ["Warning sign 1 requiring ER visit"]
}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.4,
            max_tokens: 2048,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content || '{}';
          const ai = JSON.parse(rawContent);

          const aiConfidenceScore = ai.primaryDiagnosis?.confidenceScore ?? topLocal.confidence_score;

          const aiPrimary = {
            ...topLocal,
            disease_name: ai.primaryDiagnosis?.name ?? topLocal.disease_name,
            confidence_score: aiConfidenceScore,
            severity_level: ai.primaryDiagnosis?.severityLevel ?? topLocal.severity_level,
            category: ai.primaryDiagnosis?.category ?? topLocal.category,
            description: ai.primaryDiagnosis?.clinicalSummary ?? topLocal.description,
            recommended_specialist: ai.recommendedSpecialist ?? topLocal.recommended_specialist,
            icdCode: ai.primaryDiagnosis?.icdCode || '',
            urgencyLevel: ai.primaryDiagnosis?.urgencyLevel || 'Normal',
            ai_clinical_analysis: ai.clinicalAnalysis || '',
            ai_recommendations: ai.recommendations || [],
            ai_prescriptions: ai.prescriptions || [],
            ai_follow_up: ai.followUpAdvice || '',
            ai_emergency_warnings: ai.emergencyWarnings || [],
            groqPowered: true
          };

          const finalPredictionEntry = {
            ...newPredictionEntry,
            predicted_disease: aiPrimary.disease_name,
            confidence_score: aiConfidenceScore
          };
          setPredictions(prev => [finalPredictionEntry, ...prev]);

          const aiDifferentials = (ai.differentialDiagnoses || []).map((d, i) => ({
            ...(localResults[i + 1] || {}),
            disease_name: d.name,
            confidence_score: d.confidenceScore ?? (localResults[i + 1]?.confidence_score || 0),
            reason: d.reason
          }));

          return {
            primary: aiPrimary,
            differentials: aiDifferentials.length > 0 ? aiDifferentials : localResults.slice(1, 4),
            predictionEntry: finalPredictionEntry,
            groqPowered: true
          };
        }
      } catch (directErr) {
        console.warn('[Direct Groq AI Predict Failed]', directErr.message);
      }
    }

    // 3. Fallback to local ML engine if both backend and direct Groq API fail
    setPredictions(prev => [newPredictionEntry, ...prev]);
    return {
      primary: { ...topLocal, groqPowered: false },
      differentials: localResults.slice(1, 4),
      predictionEntry: newPredictionEntry,
      groqPowered: false
    };
  };

  const sendChatMessage = async (conversationMessages) => {
    // 1. Try Backend API endpoint first
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({
          messages: conversationMessages,
          patientContext: {
            name: currentUser?.name || 'Patient',
            role: currentUser?.role || 'Patient'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          reply: data.reply,
          groqPowered: true
        };
      }
    } catch (backendErr) {
      console.warn('[Backend Chat Failed] Retrying via direct Groq AI API client...', backendErr.message);
    }

    // 2. Direct Groq AI API client call fallback (for live Firebase host or offline backend)
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (groqKey) {
      try {
        const systemPrompt = `You are SDPS Health Assistant, an empathetic, highly knowledgeable, and precise AI medical & health assistant integrated into the Smart Disease Prediction System (SDPS).
Provide accurate, reassuring, and practical medical guidance, health recommendations, symptom explanations, diet tips, and general medical knowledge.
Format your responses using clean GitHub-style Markdown with bullet points, bold key terms, and short paragraphs for readability.
If a user asks about urgent or life-threatening symptoms (chest pain, stroke, severe bleeding), emphasize seeking emergency care immediately.
Keep responses concise, informative, warm, and helpful.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
            ],
            temperature: 0.6,
            max_tokens: 1024
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || 'Unable to parse Groq response.';
          return {
            success: true,
            reply,
            groqPowered: true
          };
        }
      } catch (directErr) {
        console.warn('[Direct Groq AI Call Failed]', directErr.message);
      }
    }

    // 3. Offline static advice fallback
    const lastUserMsg = conversationMessages[conversationMessages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = "I am currently operating in offline fallback mode. Connect to the SDPS backend server for live Groq AI answers.";
    
    if (lastUserMsg.includes('fever') || lastUserMsg.includes('temperature')) {
      fallbackReply = "**Offline Health Advice (Fever):** Stay well-hydrated with fluids/ORS, rest adequately, and monitor your body temperature. If temperature exceeds 102°F or persists beyond 3 days, please consult a physician.";
    } else if (lastUserMsg.includes('cough') || lastUserMsg.includes('throat')) {
      fallbackReply = "**Offline Health Advice (Cough & Throat):** Sip warm water or herbal tea, practice salt-water gargles, and avoid cold air exposure. If chest pain or breathing difficulty occurs, seek medical evaluation.";
    } else if (lastUserMsg.includes('headache') || lastUserMsg.includes('pain')) {
      fallbackReply = "**Offline Health Advice (Headache):** Rest in a dim, quiet room, stay hydrated, and reduce screen time. Seek urgent care if accompanied by neck stiffness or vision loss.";
    } else if (lastUserMsg.includes('diet') || lastUserMsg.includes('eat') || lastUserMsg.includes('food')) {
      fallbackReply = "**Offline Health Advice (Nutrition):** Maintain a balanced diet rich in leafy greens, fresh fruits, lean proteins, and plenty of water. Avoid processed sugars and deep-fried foods during illness.";
    }

    return {
      success: true,
      reply: fallbackReply,
      groqPowered: false
    };
  };

  // Keep backward-compatible sync version as internal helper
  const predictDisease = (selectedSymptomIds, severities = {}) => {
    if (!selectedSymptomIds || selectedSymptomIds.length === 0) return [];
    const results = diseases.map(disease => {
      const diseaseMappings = mappings.filter(m => m.disease_id === disease.disease_id);
      if (diseaseMappings.length === 0) return { disease, score: 0, matchedSymptoms: [] };
      let weightedSum = 0;
      let maxPossibleWeight = 0;
      const matchedSymptoms = [];
      diseaseMappings.forEach(mapRule => {
        maxPossibleWeight += mapRule.weight;
        if (selectedSymptomIds.includes(mapRule.symptom_id)) {
          const symptomObj = symptoms.find(s => s.symptom_id === mapRule.symptom_id);
          const severityMultiplier = severities[mapRule.symptom_id] === 'Severe' ? 1.2 : severities[mapRule.symptom_id] === 'Moderate' ? 1.0 : 0.85;
          weightedSum += mapRule.weight * severityMultiplier;
          if (symptomObj) matchedSymptoms.push(symptomObj.symptom_name);
        }
      });
      let confidence = maxPossibleWeight > 0 ? (weightedSum / maxPossibleWeight) * 100 : 0;
      // Bonus for matched primary symptoms
      const primaryCount = diseaseMappings.filter(m => m.is_primary && selectedSymptomIds.includes(m.symptom_id)).length;
      if (primaryCount > 0) confidence += primaryCount * 6;
      // Small bonus for breadth: more matched symptoms = higher confidence
      const matchRatio = matchedSymptoms.length / Math.max(diseaseMappings.length, 1);
      confidence += matchRatio * 8;
      // If nothing matched at all, give 0 — don't fake a score
      if (weightedSum === 0) confidence = 0;
      // Cap at 97, round to integer
      confidence = Math.min(Math.round(confidence), 97);
      return {
        disease_id: disease.disease_id,
        disease_name: disease.disease_name,
        category: disease.category,
        severity_level: disease.severity_level,
        description: disease.description,
        precautions: disease.precautions,
        recommended_specialist: disease.recommended_specialist,
        confidence_score: confidence,
        matchedSymptoms
      };
    });
    results.sort((a, b) => b.confidence_score - a.confidence_score);
    const topPrediction = results[0];
    const newPredictionEntry = {
      prediction_id: Date.now(),
      user_id: currentUser ? currentUser.user_id : 99,
      user_name: currentUser ? currentUser.name : 'Guest Patient',
      symptoms_selected: selectedSymptomIds,
      disease_id: topPrediction.disease_id,
      predicted_disease: topPrediction.disease_name,
      confidence_score: topPrediction.confidence_score,
      prediction_date: new Date().toISOString(),
      status: 'Completed',
      notes: `Automated ML decision matrix evaluated ${selectedSymptomIds.length} input symptoms.`
    };
    setPredictions(prev => [newPredictionEntry, ...prev]);
    return { primary: topPrediction, differentials: results.slice(1, 4), predictionEntry: newPredictionEntry };
  };

  // ─── Generate Official Diagnosis Report (uses Groq AI data if available) ───
  const generateDiagnosisReport = (predictionEntry, primaryDisease, selectedSymptomNames) => {
    // Use AI-generated prescriptions if available, otherwise fall back to static map
    let prescriptions;
    if (primaryDisease.ai_prescriptions && primaryDisease.ai_prescriptions.length > 0) {
      prescriptions = primaryDisease.ai_prescriptions.map(rx => ({
        medicine_name: rx.medicine,
        dosage: `${rx.dosage} — ${rx.frequency}`,
        duration: rx.duration,
        notes: rx.notes || ''
      }));
    } else {
      const medIds = DISEASE_MEDICINE_MAP[primaryDisease.disease_id] || [1, 3];
      prescriptions = medIds.map(mId => {
        const medObj = medicines.find(m => m.medicine_id === mId);
        return {
          medicine_name: medObj ? medObj.medicine_name : 'Paracetamol 650mg',
          dosage: medObj ? medObj.default_dosage : '1 Tablet twice daily',
          duration: medObj ? medObj.default_duration : '5 Days',
          notes: ''
        };
      });
    }

    // Use AI-generated clinical analysis or fall back to precautions
    const clinicalAnalysis = primaryDisease.ai_clinical_analysis || primaryDisease.precautions || '';
    const recommendations = primaryDisease.ai_recommendations && primaryDisease.ai_recommendations.length > 0
      ? primaryDisease.ai_recommendations
      : [primaryDisease.precautions || 'Follow up with your doctor.'];

    const newReport = {
      report_id: Math.floor(100 + Math.random() * 900),
      prediction_id: predictionEntry.prediction_id,
      user_id: currentUser ? currentUser.user_id : 2,
      patient_name: currentUser ? currentUser.name : 'Patient',
      patient_age: currentUser?.age || null,
      patient_gender: currentUser?.gender || null,
      report_date: new Date().toISOString(),
      primary_diagnosis: primaryDisease.disease_name,
      icd_code: primaryDisease.icdCode || '',
      confidence_score: primaryDisease.confidence_score,
      urgency_level: primaryDisease.urgencyLevel || 'Normal',
      severity_level: primaryDisease.severity_level,
      symptoms_summary: selectedSymptomNames,
      clinical_analysis: clinicalAnalysis,
      clinical_advice: clinicalAnalysis,
      recommendations,
      recommended_specialist: primaryDisease.recommended_specialist,
      follow_up_advice: primaryDisease.ai_follow_up || 'Schedule follow-up within 5-7 days.',
      emergency_warnings: primaryDisease.ai_emergency_warnings || [],
      prescriptions,
      attending_doctor: 'Dr. Rajesh Sharma (Chief Medical Officer)',
      groq_powered: primaryDisease.groqPowered || false,
      ai_model: primaryDisease.groqPowered ? 'llama-3.3-70b-versatile (Groq)' : 'Local ML Engine'
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const deleteReport = (report_id) => {
    setReports(prev => prev.filter(r => r.report_id !== report_id));
  };

  const updateUserProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    if (updatedUser.email) {
      setStored(`profile_${updatedUser.email.toLowerCase()}`, updatedUser);
    }
    if (updatedUser.contact_no || updatedUser.phone) {
      const p = (updatedUser.contact_no || updatedUser.phone).replace(/[^0-9]/g, '');
      if (p) setStored(`profile_phone_${p}`, updatedUser);
    }
    setUsers(prev => {
      const exists = prev.some(u => u.email?.toLowerCase() === updatedUser.email?.toLowerCase());
      if (exists) {
        return prev.map(u => u.email?.toLowerCase() === updatedUser.email?.toLowerCase() ? updatedUser : u);
      }
      return [updatedUser, ...prev];
    });
    syncWithBackendDb(updatedUser);
  };

  const addDisease = (newDisease) => {
    const id = Date.now();
    setDiseases(prev => [...prev, { ...newDisease, disease_id: id }]);
  };

  const updateDisease = (updated) => {
    setDiseases(prev => prev.map(d => d.disease_id === updated.disease_id ? updated : d));
  };

  const deleteDisease = (disease_id) => {
    setDiseases(prev => prev.filter(d => d.disease_id !== disease_id));
    setMappings(prev => prev.filter(m => m.disease_id !== disease_id));
  };

  const addSymptom = (newSymptom) => {
    const id = Date.now();
    setSymptoms(prev => [...prev, { ...newSymptom, symptom_id: id }]);
  };

  const deleteSymptom = (symptom_id) => {
    setSymptoms(prev => prev.filter(s => s.symptom_id !== symptom_id));
    setMappings(prev => prev.filter(m => m.symptom_id !== symptom_id));
  };

  const addMedicine = (newMed) => {
    const id = Date.now();
    setMedicines(prev => [...prev, { ...newMed, medicine_id: id }]);
  };

  const addUser = (newUser) => {
    const userWithId = { ...newUser, user_id: newUser.user_id || Date.now() };
    setUsers(prev => [userWithId, ...prev]);
    syncWithBackendDb(userWithId);
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
    if (currentUser?.user_id === updatedUser.user_id) {
      setCurrentUser(updatedUser);
    }
    syncWithBackendDb(updatedUser);
  };

  const deleteUser = (user_id) => {
    setUsers(prev => prev.filter(u => u.user_id !== user_id));
  };

  const updateSymptom = (updatedSymptom) => {
    setSymptoms(prev => prev.map(s => s.symptom_id === updatedSymptom.symptom_id ? updatedSymptom : s));
  };

  const updateMedicine = (updatedMed) => {
    setMedicines(prev => prev.map(m => m.medicine_id === updatedMed.medicine_id ? updatedMed : m));
  };

  const deleteMedicine = (medicine_id) => {
    setMedicines(prev => prev.filter(m => m.medicine_id !== medicine_id));
  };

  const clearAuditLogs = () => {
    setLoginHistory([]);
  };


  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      activeTab,
      setActiveTab,
      users,
      symptoms,
      diseases,
      mappings,
      medicines,
      predictions,
      reports,
      loginHistory,
      loginUser,
      loginWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      logoutUser,
      switchRole,
      predictDisease,
      predictDiseaseWithAI,
      sendChatMessage,
      generateDiagnosisReport,
      deleteReport,
      addDisease,
      updateDisease,
      deleteDisease,
      addSymptom,
      deleteSymptom,
      addMedicine,
      addUser,
      updateUser,
      deleteUser,
      updateSymptom,
      updateMedicine,
      deleteMedicine,
      clearAuditLogs,
      updateUserProfile

    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
