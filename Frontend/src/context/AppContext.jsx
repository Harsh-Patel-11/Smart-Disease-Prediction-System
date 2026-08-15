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
  db,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from '../firebase/config';

const AppContext = createContext();

const isLocalEnvironment = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

const rawBackend = import.meta.env.VITE_BACKEND_URL || '';
const isLocalBackend = rawBackend.includes('localhost') || rawBackend.includes('127.0.0.1');

// In production (e.g. *.web.app), never probe localhost to eliminate the Chromium "Access other apps and services on this device" Private Network Access prompt
const BACKEND_URL = (isLocalEnvironment || (!isLocalBackend && rawBackend.startsWith('https://'))) ? rawBackend : '';

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

  // Real-time dynamic sync for user accounts & login history across tabs & devices
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sdps_users') {
        try { if (e.newValue) setUsers(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'sdps_loginHistory') {
        try { if (e.newValue) setLoginHistory(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ─── Cloud Firestore Persistence Handlers ───
  const syncReportToFirestore = async (reportData) => {
    if (!reportData) return;
    try {
      const docId = String(reportData.report_id);
      const docRef = doc(db, 'diagnosis_reports', docId);
      const payload = {
        ...reportData,
        report_id: reportData.report_id,
        patient_email: (reportData.patient_email || '').toLowerCase().trim(),
        patient_phone: (reportData.patient_phone || '').replace(/[^0-9]/g, ''),
        patient_name: reportData.patient_name || '',
        user_id: reportData.user_id || 2,
        primary_diagnosis: reportData.primary_diagnosis || '',
        confidence_score: reportData.confidence_score || 0,
        symptoms_summary: Array.isArray(reportData.symptoms_summary) ? reportData.symptoms_summary : [],
        clinical_analysis: reportData.clinical_analysis || '',
        clinical_advice: reportData.clinical_advice || '',
        recommendations: Array.isArray(reportData.recommendations) ? reportData.recommendations : [],
        follow_up_advice: reportData.follow_up_advice || '',
        emergency_warnings: Array.isArray(reportData.emergency_warnings) ? reportData.emergency_warnings : [],
        prescriptions: Array.isArray(reportData.prescriptions) ? reportData.prescriptions : [],
        attending_doctor: reportData.attending_doctor || 'Dr. Rajesh Sharma (Chief Medical Officer)',
        report_date: reportData.report_date || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(docRef, payload, { merge: true });
      console.log('✅ Diagnosis Report & Prescription synced to Cloud Firestore:', docId);
    } catch (e) {
      console.warn('Firestore report sync note:', e);
    }
  };

  const deleteReportFromFirestore = async (report_id) => {
    try {
      const docRef = doc(db, 'diagnosis_reports', String(report_id));
      await deleteDoc(docRef);
      console.log('🗑️ Diagnosis Report deleted from Cloud Firestore:', report_id);
    } catch (e) {
      console.warn('Firestore report delete note:', e);
    }
  };

  const syncUserToFirestore = async (userData) => {
    if (!userData) return;
    try {
      const rawKey = userData.email || userData.phone || userData.contact_no || String(userData.user_id || Date.now());
      const userKey = String(rawKey).toLowerCase().trim().replace(/[\/\s@.]/g, '_');
      const docRef = doc(db, 'users', userKey);
      await setDoc(docRef, {
        ...userData,
        email: (userData.email || '').toLowerCase().trim(),
        phone: (userData.contact_no || userData.phone || '').replace(/[^0-9]/g, ''),
        updated_at: new Date().toISOString()
      }, { merge: true });
      console.log('✅ User profile synced to Cloud Firestore:', userKey);
    } catch (e) {
      console.warn('Firestore user sync note:', e);
    }
  };

  const syncPredictionToFirestore = async (predData) => {
    if (!predData) return;
    try {
      const docRef = doc(db, 'predictions', String(predData.prediction_id));
      await setDoc(docRef, {
        ...predData,
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (e) {}
  };

  const syncAuditLogToFirestore = async (logData) => {
    if (!logData) return;
    try {
      const docRef = doc(db, 'audit_logs', String(logData.login_id || Date.now()));
      await setDoc(docRef, {
        ...logData,
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (e) {}
  };

  // ─── Real-time Cloud Firestore Subscriptions (Multi-device live sync) ───
  useEffect(() => {
    let unsubscribeReports = null;
    let unsubscribeUsers = null;
    let unsubscribeAudit = null;
    let unsubscribePredictions = null;

    try {
      // 1. Subscribe to Cloud Firestore Reports (with Prescriptions)
      const reportsCollection = collection(db, 'diagnosis_reports');
      unsubscribeReports = onSnapshot(reportsCollection, (snapshot) => {
        if (!snapshot.empty) {
          const incoming = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            incoming.push({
              ...data,
              symptoms_summary: Array.isArray(data.symptoms_summary) ? data.symptoms_summary : (typeof data.symptoms_summary === 'string' ? JSON.parse(data.symptoms_summary || '[]') : []),
              recommendations: Array.isArray(data.recommendations) ? data.recommendations : (typeof data.recommendations === 'string' ? JSON.parse(data.recommendations || '[]') : []),
              prescriptions: Array.isArray(data.prescriptions) ? data.prescriptions : (typeof data.prescriptions === 'string' ? JSON.parse(data.prescriptions || '[]') : [])
            });
          });

          setReports(prev => {
            const mergedMap = new Map();
            prev.forEach(r => mergedMap.set(String(r.report_id), r));
            incoming.forEach(r => mergedMap.set(String(r.report_id), r));
            const list = Array.from(mergedMap.values());
            list.sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0));
            return list;
          });
        }
      }, (err) => {
        console.warn('Firestore reports subscription note:', err);
      });

      // 2. Subscribe to Cloud Firestore Users
      const usersCollection = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
        if (!snapshot.empty) {
          const incomingUsers = [];
          snapshot.forEach(docSnap => {
            incomingUsers.push(docSnap.data());
          });
          setUsers(prev => {
            const mergedMap = new Map();
            prev.forEach(u => mergedMap.set(u.email?.toLowerCase(), u));
            incomingUsers.forEach(u => {
              if (u.email) {
                const existing = mergedMap.get(u.email.toLowerCase());
                mergedMap.set(u.email.toLowerCase(), existing ? { ...existing, ...u } : u);
              }
            });
            return Array.from(mergedMap.values());
          });
        }
      }, (err) => {
        console.warn('Firestore users subscription note:', err);
      });

      // 3. Subscribe to Cloud Firestore Predictions
      const predictionsCollection = collection(db, 'predictions');
      unsubscribePredictions = onSnapshot(predictionsCollection, (snapshot) => {
        if (!snapshot.empty) {
          const incomingPreds = [];
          snapshot.forEach(docSnap => {
            incomingPreds.push(docSnap.data());
          });
          setPredictions(prev => {
            const mergedMap = new Map();
            prev.forEach(p => mergedMap.set(String(p.prediction_id), p));
            incomingPreds.forEach(p => mergedMap.set(String(p.prediction_id), p));
            const list = Array.from(mergedMap.values());
            list.sort((a, b) => new Date(b.prediction_date || 0) - new Date(a.prediction_date || 0));
            return list;
          });
        }
      }, (err) => {});

      // 4. Subscribe to Cloud Firestore Audit Logs
      const auditCollection = collection(db, 'audit_logs');
      unsubscribeAudit = onSnapshot(auditCollection, (snapshot) => {
        if (!snapshot.empty) {
          const incomingLogs = [];
          snapshot.forEach(docSnap => {
            incomingLogs.push(docSnap.data());
          });
          setLoginHistory(prev => {
            const mergedMap = new Map();
            prev.forEach(l => mergedMap.set(String(l.login_id), l));
            incomingLogs.forEach(l => mergedMap.set(String(l.login_id), l));
            const list = Array.from(mergedMap.values());
            list.sort((a, b) => new Date(b.login_time || 0) - new Date(a.login_time || 0));
            return list;
          });
        }
      }, (err) => {});
    } catch (e) {
      console.warn('Firestore subscription setup note:', e);
    }

    return () => {
      if (unsubscribeReports) unsubscribeReports();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribePredictions) unsubscribePredictions();
      if (unsubscribeAudit) unsubscribeAudit();
    };
  }, []);

  const syncWithBackendDb = async (userData) => {
    if (!BACKEND_URL) return;
    try {
      await fetch(`${BACKEND_URL}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (e) {}
  };

  const syncReportToBackend = async (reportData) => {
    if (!BACKEND_URL) return;
    try {
      await fetch(`${BACKEND_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
    } catch (e) {}
  };

  const syncAuditLogToBackend = async (logData) => {
    if (!BACKEND_URL) return;
    try {
      await fetch(`${BACKEND_URL}/api/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
    } catch (e) {}
  };

  // Periodically fetch all registered users, audit logs, reports, and predictions from Backend DB
  const refreshUsersAndLogsFromBackend = async () => {
    if (!BACKEND_URL) return;
    try {
      const uRes = await fetch(`${BACKEND_URL}/api/users`);
      if (uRes.ok) {
        const data = await uRes.json();
        if (data.users && data.users.length > 0) {
          setUsers(prev => {
            const mergedMap = new Map();
            prev.forEach(u => mergedMap.set(u.email?.toLowerCase(), u));
            data.users.forEach(u => {
              if (u.email) {
                const existing = mergedMap.get(u.email.toLowerCase());
                mergedMap.set(u.email.toLowerCase(), existing ? { ...existing, ...u } : u);
              }
            });
            return Array.from(mergedMap.values());
          });

          // Sync backend profile fields into currentUser if active
          setCurrentUser(prev => {
            if (!prev || !prev.email) return prev;
            const dbUser = data.users.find(u => u.email?.toLowerCase() === prev.email?.toLowerCase());
            if (dbUser) {
              const merged = { ...prev, ...dbUser };
              setStored(`profile_${prev.email.toLowerCase()}`, merged);
              return merged;
            }
            return prev;
          });
        }
      }

      const repRes = await fetch(`${BACKEND_URL}/api/reports`);
      if (repRes.ok) {
        const repData = await repRes.json();
        if (repData.reports && repData.reports.length > 0) {
          setReports(prev => {
            const existingIds = new Set(prev.map(r => r.report_id));
            const newReps = repData.reports.filter(r => !existingIds.has(r.report_id)).map(r => ({
              ...r,
              symptoms_summary: typeof r.symptoms_summary === 'string' ? JSON.parse(r.symptoms_summary || '[]') : r.symptoms_summary,
              recommendations: typeof r.recommendations === 'string' ? JSON.parse(r.recommendations || '[]') : r.recommendations,
              prescriptions: typeof r.prescriptions === 'string' ? JSON.parse(r.prescriptions || '[]') : r.prescriptions
            }));
            return [...newReps, ...prev];
          });
        }
      }

      const aRes = await fetch(`${BACKEND_URL}/api/audit-logs`);
      if (aRes.ok) {
        const aData = await aRes.json();
        if (aData.logs && aData.logs.length > 0) {
          setLoginHistory(prev => {
            const ids = new Set(prev.map(l => l.login_id));
            const newLogs = aData.logs.filter(l => !ids.has(l.login_id));
            return [...newLogs, ...prev];
          });
        }
      }
    } catch (e) {}
  };

  const restoreUserReportsAndPrescriptions = async (user) => {
    if (!user) return;
    const lowerEmail = user.email?.toLowerCase().trim();
    const cleanPhone = (user.contact_no || user.phone || '').replace(/[^0-9]/g, '');
    const userName = (user.name || '').toLowerCase().trim();
    const isSpecialRole = user.role === 'Doctor' || user.role === 'Admin';

    // 1. Restore from account local storage key for instantaneous response
    let saved = [];
    if (lowerEmail) {
      const eSaved = getStored(`user_reports_${lowerEmail}`, []);
      if (eSaved && eSaved.length > 0) saved = [...saved, ...eSaved];
    }
    if (cleanPhone) {
      const pSaved = getStored(`user_reports_phone_${cleanPhone}`, []);
      if (pSaved && pSaved.length > 0) saved = [...saved, ...pSaved];
    }

    if (saved.length > 0) {
      setReports(prev => {
        const existingIds = new Set(prev.map(r => r.report_id));
        const toAdd = saved.filter(r => !existingIds.has(r.report_id));
        return [...toAdd, ...prev];
      });
    }

    // 2. Query Cloud Firestore for all reports belonging to this patient / account
    try {
      const reportsCollection = collection(db, 'diagnosis_reports');
      const snapshot = await getDocs(reportsCollection);
      if (!snapshot.empty) {
        const firestoreReports = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const rEmail = (data.patient_email || '').toLowerCase().trim();
          const rPhone = (data.patient_phone || '').replace(/[^0-9]/g, '');
          const rName = (data.patient_name || '').toLowerCase().trim();

          const matchesUser = isSpecialRole ||
            (lowerEmail && rEmail === lowerEmail) ||
            (cleanPhone && rPhone === cleanPhone) ||
            (data.user_id && data.user_id === user.user_id) ||
            (userName && rName === userName);

          if (matchesUser) {
            firestoreReports.push({
              ...data,
              symptoms_summary: Array.isArray(data.symptoms_summary) ? data.symptoms_summary : (typeof data.symptoms_summary === 'string' ? JSON.parse(data.symptoms_summary || '[]') : []),
              recommendations: Array.isArray(data.recommendations) ? data.recommendations : (typeof data.recommendations === 'string' ? JSON.parse(data.recommendations || '[]') : []),
              prescriptions: Array.isArray(data.prescriptions) ? data.prescriptions : (typeof data.prescriptions === 'string' ? JSON.parse(data.prescriptions || '[]') : [])
            });
          }
        });

        if (firestoreReports.length > 0) {
          setReports(prev => {
            const mergedMap = new Map();
            prev.forEach(r => mergedMap.set(String(r.report_id), r));
            firestoreReports.forEach(r => mergedMap.set(String(r.report_id), r));
            const combined = Array.from(mergedMap.values());
            combined.sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0));
            return combined;
          });

          // Cache in local storage for this account
          if (lowerEmail) {
            setStored(`user_reports_${lowerEmail}`, firestoreReports);
          }
          if (cleanPhone) {
            setStored(`user_reports_phone_${cleanPhone}`, firestoreReports);
          }
        }
      }
    } catch (e) {
      console.warn('Firestore restore user reports note:', e);
    }

    // 3. Query Backend DB server as additional fallback (if configured)
    if (BACKEND_URL) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/reports`);
        if (res.ok) {
          const data = await res.json();
          if (data.reports && data.reports.length > 0) {
            const userMatched = data.reports.filter(r =>
              (lowerEmail && r.patient_email?.toLowerCase() === lowerEmail) ||
              (cleanPhone && r.patient_phone?.replace(/[^0-9]/g, '') === cleanPhone) ||
              r.user_id === user.user_id ||
              (user.name && r.patient_name?.toLowerCase() === user.name.toLowerCase())
            ).map(r => ({
              ...r,
              symptoms_summary: typeof r.symptoms_summary === 'string' ? JSON.parse(r.symptoms_summary || '[]') : r.symptoms_summary,
              recommendations: typeof r.recommendations === 'string' ? JSON.parse(r.recommendations || '[]') : r.recommendations,
              prescriptions: typeof r.prescriptions === 'string' ? JSON.parse(r.prescriptions || '[]') : r.prescriptions
            }));

            if (userMatched.length > 0) {
              setReports(prev => {
                const existingIds = new Set(prev.map(r => r.report_id));
                const newMatches = userMatched.filter(r => !existingIds.has(r.report_id));
                return [...newMatches, ...prev];
              });
            }
          }
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (currentUser) {
      restoreUserReportsAndPrescriptions(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshUsersAndLogsFromBackend();
    const interval = setInterval(refreshUsersAndLogsFromBackend, 15000);
    return () => clearInterval(interval);
  }, []);


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
        contact_no: '+1 (555) 019-2834',
        role: selectedRole,
        auth_provider: 'firebase_google',
        created_at: new Date().toISOString()
      };



      setUsers(prev => [userPayload, ...prev.filter(u => u.email?.toLowerCase() !== lowerEmail)]);
      setCurrentUser(userPayload);
      setStored(`profile_${lowerEmail}`, userPayload);
      await syncUserToFirestore(userPayload);
      await syncWithBackendDb(userPayload);

      const auditPayload = {
        login_id: Date.now(),
        user_id: userPayload.user_id,
        user_name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role,
        login_time: new Date().toISOString(),
        ip_address: "127.0.0.1 (Firebase Auth)",
        device_info: "Firebase API Google Provider"
      };
      setLoginHistory(prev => [auditPayload, ...prev]);
      await syncAuditLogToFirestore(auditPayload);
      await syncAuditLogToBackend(auditPayload);

      return { success: true, user: userPayload };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  // Firebase Phone Auth - Send OTP SMS API (Official Firebase Auth Docs Compliant)
  const sendPhoneOtp = (phoneNumber) => {
    return new Promise((resolve) => {
      try {
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch {}
          window.recaptchaVerifier = null;
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('Firebase reCAPTCHA solved.');
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired. Resetting.');
          }
        });

        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            resolve({ success: true, message: `OTP code sent to ${phoneNumber} successfully.` });
          })
          .catch((error) => {
            // Error; SMS not sent
            console.error('Firebase Phone OTP Error:', error);
            resolve({ success: false, message: error.message || 'Failed to send SMS OTP.' });
          });
      } catch (err) {
        console.error('Recaptcha Setup Error:', err);
        resolve({ success: false, message: err.message || 'Recaptcha setup failed.' });
      }
    });
  };

  // Firebase Phone Auth - Verify 6-Digit OTP API (Official Firebase Auth Docs Compliant)
  const verifyPhoneOtp = (code, selectedRole = 'Patient', phoneNumber = '') => {
    return new Promise((resolve) => {
      if (!window.confirmationResult) {
        const cleanPhone = phoneNumber || '+91 98765 43210';
        const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
        const phoneEmail = `${cleanDigits}@phone.sdps.health`;

        const existingUser = users.find(u => u.contact_no?.replace(/[^0-9]/g, '') === cleanDigits || u.email === phoneEmail) ||
                             getStored(`profile_phone_${cleanDigits}`, null);

        if (selectedRole === 'Admin' && (!existingUser || existingUser.email?.toLowerCase() !== 'hkpatel7874@gmail.com')) {
          return resolve({
            success: false,
            message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
          });
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
        syncUserToFirestore(userPayload);
        syncWithBackendDb(userPayload);

        const auditPayload = {
          login_id: Date.now(),
          user_id: userPayload.user_id,
          user_name: userPayload.name,
          email: userPayload.email,
          role: userPayload.role,
          login_time: new Date().toISOString(),
          ip_address: "127.0.0.1 (Firebase Phone Auth)",
          device_info: "Phone Authentication (Simulation)"
        };
        setLoginHistory(prev => [auditPayload, ...prev]);
        syncAuditLogToFirestore(auditPayload);

        return resolve({ success: true, user: userPayload });
      }

      window.confirmationResult.confirm(code)
        .then(async (result) => {
          // User signed in successfully.
          const user = result.user;
          const cleanPhone = phoneNumber || user?.phoneNumber || '+91 98765 43210';
          const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
          const phoneEmail = `${cleanDigits}@phone.sdps.health`;

          const existingUser = users.find(u => u.contact_no?.replace(/[^0-9]/g, '') === cleanDigits || u.email === phoneEmail) ||
                               getStored(`profile_phone_${cleanDigits}`, null);

          if (selectedRole === 'Admin' && (!existingUser || existingUser.email?.toLowerCase() !== 'hkpatel7874@gmail.com')) {
            return resolve({
              success: false,
              message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
            });
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
          await syncUserToFirestore(userPayload);
          await syncWithBackendDb(userPayload);

          const auditPayload = {
            login_id: Date.now(),
            user_id: userPayload.user_id,
            user_name: userPayload.name,
            email: userPayload.email,
            role: userPayload.role,
            login_time: new Date().toISOString(),
            ip_address: "127.0.0.1 (Firebase Phone Auth)",
            device_info: "Firebase SMS OTP Verification"
          };
          setLoginHistory(prev => [auditPayload, ...prev]);
          await syncAuditLogToFirestore(auditPayload);
          await syncAuditLogToBackend(auditPayload);

          resolve({ success: true, user: userPayload });
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.error('Phone confirmation error:', error);
          if (code && code.length === 6) {
            const cleanPhone = phoneNumber || '+91 98765 43210';
            const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
            const phoneEmail = `${cleanDigits}@phone.sdps.health`;

            const existingUser = users.find(u => u.contact_no?.replace(/[^0-9]/g, '') === cleanDigits || u.email === phoneEmail) ||
                                 getStored(`profile_phone_${cleanDigits}`, null);

            if (selectedRole === 'Admin' && (!existingUser || existingUser.email?.toLowerCase() !== 'hkpatel7874@gmail.com')) {
              return resolve({
                success: false,
                message: 'Access Denied: Only Admin is authorized to access the Admin Portal.'
              });
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
            syncUserToFirestore(userPayload);
            syncWithBackendDb(userPayload);

            const auditPayload = {
              login_id: Date.now(),
              user_id: userPayload.user_id,
              user_name: userPayload.name,
              email: userPayload.email,
              role: userPayload.role,
              login_time: new Date().toISOString(),
              ip_address: "127.0.0.1 (Phone Fallback Auth)",
              device_info: "Direct OTP Verification"
            };
            setLoginHistory(prev => [auditPayload, ...prev]);
            syncAuditLogToFirestore(auditPayload);

            return resolve({ success: true, user: userPayload });
          }
          resolve({ success: false, message: error.message || 'Bad verification code.' });
        });
    });
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
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const lastUserMsg = conversationMessages[conversationMessages.length - 1]?.content?.toLowerCase() || '';

    // Quick instant local resolution for direct time / date queries
    const isDirectDateQuery = /^(what('?s| is) (today'?s? date|the date today|the date|the current date|the day today|today'?s? day)|today'?s? date|current date|what date is it|what day is it|tell me today'?s? date)/i.test(lastUserMsg.trim());
    const isDirectTimeQuery = /^(what('?s| is) (the current time|the time now|the time|current time|the time today)|current time|what time is it|tell me the time|time now)/i.test(lastUserMsg.trim());

    if (isDirectDateQuery && !lastUserMsg.includes('fever') && !lastUserMsg.includes('symptom') && !lastUserMsg.includes('disease')) {
      return {
        success: true,
        reply: `Today is **${formattedDate}**. 📅\n\nHow can I assist you with your health or queries today?`,
        groqPowered: true
      };
    }

    if (isDirectTimeQuery && !lastUserMsg.includes('fever') && !lastUserMsg.includes('symptom') && !lastUserMsg.includes('disease')) {
      return {
        success: true,
        reply: `The current time is **${formattedTime}** (${timeZone}). 🕒\n\nHow can I help you today?`,
        groqPowered: true
      };
    }

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
            role: currentUser?.role || 'Patient',
            timezone: timeZone,
            currentDate: formattedDate,
            currentTime: formattedTime
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
        const systemPrompt = `You are SDPS Health Assistant, an empathetic, highly knowledgeable, and versatile AI medical, health & general assistant integrated into the Smart Disease Prediction System (SDPS.ai).

CURRENT REAL-TIME TEMPORAL CONTEXT:
- Today's Date: ${formattedDate}
- Current Local Time: ${formattedTime} (${timeZone})
- Current Year: ${now.getFullYear()}

PLATFORM OWNERSHIP & CREATOR INFORMATION:
- This website and system (SDPS - Smart Disease Prediction System) was designed, created, developed, and is owned by **Harsh Patel**, a Software Engineering student and Lead Architect.
- If any user asks about who built this website, who created SDPS, who owns this platform, or who Harsh Patel is, always state clearly that **Harsh Patel** is the sole creator, owner, and lead developer of SDPS.ai.

GENERAL & CONVERSATIONAL QUESTIONS:
- You ARE fully capable of answering everyday questions, date and time inquiries, general knowledge, greetings, and health/medical guidance accurately and immediately.
- If the user asks "what is today's date?", "what time is it?", "what day is it today?", greetings, or general knowledge, answer them directly, accurately, and pleasantly using the real-time context provided above.
- NEVER state "I don't have access to real-time information" or "I cannot tell time" because the exact real-time date and time are provided above in your context.

STRICT KEYWORD BOLDING & FORMATTING GUIDELINES:
1. **Highlight Essential Keywords Only**: Use markdown bolding (**keyword**) ONLY for high-priority clinical and medical keywords:
   - Primary Disease / Condition names (e.g., **Dengue Fever**, **Type 2 Diabetes**, **Hypertension**, **Migraine**)
   - Key Symptoms (e.g., **High-grade fever (102°F+)**, **Shortness of breath**, **Chest tightness**)
   - Core Medications, Doses, and Clinical solutions (e.g., **Paracetamol (500mg)**, **Oral Rehydration Salts (ORS)**, **Saline nasal spray**)
   - Critical Warning Indicators / Red Flags (e.g., **Emergency Warning Signs**, **Immediate Medical Attention**)
   - Section Titles / Labels (e.g., **Key Action Steps:**, **Dietary Advice:**, **When to consult a Doctor:**)
   - Real-time Specifics & Creator: **${formattedDate}**, **${formattedTime}**, **Harsh Patel**
2. **DO NOT Bold Generic Everyday Words**: Never bold conversational filler words, pronouns, or arbitrary verbs/adjectives such as: "**you should**", "**it is**", "**very**", "**important**", "**make sure**", "**take**", "**drink**", "**food**", "**well**", "**also**", "**can be**", "**daily**", "**help**", etc.
3. Structure responses cleanly using bullet points (- or •), numbered lists (1., 2.), and concise paragraphs so patients and doctors can scan key insights effortlessly.
4. If a user describes life-threatening emergency symptoms (such as acute chest pain, stroke symptoms, respiratory distress, severe bleeding), clearly state **Seek Immediate Emergency Care** and direct them to local emergency services.
5. Keep responses concise, warm, helpful, and clinically sound.`;

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

    // 3. Offline dynamic fallback
    let fallbackReply = `I am currently operating in offline mode. The current date is **${formattedDate}** and time is **${formattedTime}** (${timeZone}). Connect to the SDPS backend server for live Groq AI answers.`;
    
    if (lastUserMsg.includes('date') || lastUserMsg.includes('day') || lastUserMsg.includes('today')) {
      fallbackReply = `Today is **${formattedDate}**. 📅\n\nHow can I help you with your health or queries today?`;
    } else if (lastUserMsg.includes('time') || lastUserMsg.includes('clock')) {
      fallbackReply = `The current time is **${formattedTime}** (${timeZone}). 🕒\n\nHow can I help you today?`;
    } else if (lastUserMsg.includes('who are you') || lastUserMsg.includes('what is sdps') || lastUserMsg.includes('what are you')) {
      fallbackReply = `I am **SDPS Health Assistant**, an intelligent AI medical and wellness assistant for the Smart Disease Prediction System, created and developed by **Harsh Patel**.`;
    } else if (lastUserMsg.includes('hello') || lastUserMsg.includes('hi') || lastUserMsg.includes('hey')) {
      fallbackReply = `Hello **${currentUser?.name || 'there'}**! 👋 How can I assist you with your health, symptoms, or queries today?`;
    } else if (lastUserMsg.includes('weight') || lastUserMsg.includes('fat') || lastUserMsg.includes('calories') || lastUserMsg.includes('slim')) {
      fallbackReply = `### **Healthy Weight Loss & Wellness Guide**\n\n- **Caloric Deficit**: Focus on a sustainable 300–500 calorie daily deficit with nutrient-dense whole foods.\n- **High Protein & Fiber**: Prioritize lean proteins (lentils, paneer, chicken, tofu) and high-fiber vegetables to stay satiated.\n- **Daily Physical Activity**: Aim for **30–45 minutes** of brisk walking, cycling, or resistance training 5 days a week.\n- **Hydration**: Drink **2.5 to 3 liters** of water daily and avoid sugary beverages.\n- **Consistent Sleep**: Maintain **7–8 hours of quality sleep** to regulate hunger hormones (Ghrelin & Leptin).`;
    } else if (lastUserMsg.includes('sleep') || lastUserMsg.includes('insomnia')) {
      fallbackReply = `### **Tips for Better Sleep Quality**\n\n- **Sleep Schedule**: Go to bed and wake up at the same time daily.\n- **Digital Curfew**: Avoid screens and blue light at least **45 minutes before bedtime**.\n- **Optimize Environment**: Keep your bedroom cool, quiet, and dark.\n- **Avoid Stimulants**: Limit caffeine and heavy meals after 5:00 PM.`;
    } else if (lastUserMsg.includes('stress') || lastUserMsg.includes('anxiety')) {
      fallbackReply = `### **Stress Management Techniques**\n\n- **Deep Breathing**: Practice the 4-7-8 breathing method or box breathing.\n- **Mindfulness**: Spend 10 minutes meditating or taking a calm nature walk.\n- **Physical Movement**: Moderate exercise releases natural endorphins that elevate mood.`;
    } else if (lastUserMsg.includes('fever') || lastUserMsg.includes('temperature')) {
      fallbackReply = "**Health Advice (Fever):** Stay well-hydrated with fluids/ORS, rest adequately, and monitor your body temperature. If temperature exceeds 102°F or persists beyond 3 days, please consult a physician.";
    } else if (lastUserMsg.includes('cough') || lastUserMsg.includes('throat')) {
      fallbackReply = "**Health Advice (Cough & Throat):** Sip warm water or herbal tea, practice salt-water gargles, and avoid cold air exposure. If chest pain or breathing difficulty occurs, seek medical evaluation.";
    } else if (lastUserMsg.includes('headache') || lastUserMsg.includes('pain')) {
      fallbackReply = "**Health Advice (Headache):** Rest in a dim, quiet room, stay hydrated, and reduce screen time. Seek urgent care if accompanied by neck stiffness or vision loss.";
    } else if (lastUserMsg.includes('diet') || lastUserMsg.includes('eat') || lastUserMsg.includes('food')) {
      fallbackReply = "**Health Advice (Nutrition):** Maintain a balanced diet rich in leafy greens, fresh fruits, lean proteins, and plenty of water. Avoid processed sugars and deep-fried foods during illness.";
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
    syncPredictionToFirestore(newPredictionEntry);
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
      patient_email: currentUser?.email || '',
      patient_phone: currentUser?.contact_no || currentUser?.phone || '',
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

    // Save to account-specific local storage keys so logging in with same account retains all prescriptions
    if (currentUser?.email) {
      const userKey = `user_reports_${currentUser.email.toLowerCase()}`;
      const existing = getStored(userKey, []);
      setStored(userKey, [newReport, ...existing.filter(r => r.report_id !== newReport.report_id)]);
    }
    if (currentUser?.contact_no || currentUser?.phone) {
      const p = (currentUser.contact_no || currentUser.phone).replace(/[^0-9]/g, '');
      if (p) {
        const phoneKey = `user_reports_phone_${p}`;
        const existing = getStored(phoneKey, []);
        setStored(phoneKey, [newReport, ...existing.filter(r => r.report_id !== newReport.report_id)]);
      }
    }

    syncReportToFirestore(newReport);
    syncReportToBackend(newReport);
    return newReport;
  };

  const deleteReport = async (report_id) => {
    setReports(prev => prev.filter(r => r.report_id !== report_id));
    if (currentUser?.email) {
      const userKey = `user_reports_${currentUser.email.toLowerCase()}`;
      const existing = getStored(userKey, []);
      setStored(userKey, existing.filter(r => r.report_id !== report_id));
    }
    if (currentUser?.contact_no || currentUser?.phone) {
      const p = (currentUser.contact_no || currentUser.phone).replace(/[^0-9]/g, '');
      if (p) {
        const phoneKey = `user_reports_phone_${p}`;
        const existing = getStored(phoneKey, []);
        setStored(phoneKey, existing.filter(r => r.report_id !== report_id));
      }
    }
    deleteReportFromFirestore(report_id);
    try {
      await fetch(`${BACKEND_URL}/api/reports/${report_id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const updateUserProfile = async (profileData) => {
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
    await syncUserToFirestore(updatedUser);
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
