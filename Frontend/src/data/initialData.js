export const INITIAL_USERS = [
  {
    user_id: 1,
    name: "Harsh Patel (System Administrator)",
    email: "hkpatel7874@gmail.com",
    contact_no: "+91 98765 43210",
    role: "Admin",
    created_at: "2026-01-15T09:00:00Z"
  },
  {
    user_id: 2,
    name: "Ananya Patel",
    email: "ananya.patient@example.com",
    contact_no: "+91 98123 45678",
    role: "Patient",
    created_at: "2026-02-10T14:30:00Z"
  },
  {
    user_id: 3,
    name: "Rohan Verma",
    email: "rohan.patient@example.com",
    contact_no: "+91 97654 32109",
    role: "Patient",
    created_at: "2026-03-01T11:20:00Z"
  },
  {
    user_id: 4,
    name: "Dr. Vikram Seth (Chief Cardiologist)",
    email: "doctor@sdps.health",
    contact_no: "+91 99887 76655",
    role: "Doctor",
    created_at: "2026-01-20T10:15:00Z"
  }
];

export const INITIAL_SYMPTOMS = [
  { symptom_id: 1, symptom_name: "Fever", category: "General", body_part: "Whole Body", description: "Elevated body temperature above normal" },
  { symptom_id: 2, symptom_name: "Headache", category: "Neurological", body_part: "Head", description: "Pain or throbbing sensation in head" },
  { symptom_id: 3, symptom_name: "Cough", category: "Respiratory", body_part: "Chest & Throat", description: "Dry or phlegm-producing cough" },
  { symptom_id: 4, symptom_name: "Shortness of Breath", category: "Respiratory", body_part: "Chest", description: "Difficulty catching breath or tight chest feeling" },
  { symptom_id: 5, symptom_name: "Chest Pain", category: "Cardiovascular", body_part: "Chest", description: "Pressure, tightness, or aching in chest" },
  { symptom_id: 6, symptom_name: "Fatigue", category: "General", body_part: "Whole Body", description: "Feeling tired, weak, or exhausted" },
  { symptom_id: 7, symptom_name: "Joint Pain", category: "Musculoskeletal", body_part: "Joints", description: "Pain or stiffness in joints" },
  { symptom_id: 8, symptom_name: "Nausea & Vomiting", category: "Gastrointestinal", body_part: "Stomach", description: "Feeling sick to stomach or vomiting" },
  { symptom_id: 9, symptom_name: "Abdominal Pain", category: "Gastrointestinal", body_part: "Stomach", description: "Pain or cramping in stomach area" },
  { symptom_id: 10, symptom_name: "Skin Rash", category: "Dermatological", body_part: "Skin", description: "Red spots, bumps, or skin irritation" },
  { symptom_id: 11, symptom_name: "Loss of Taste or Smell", category: "Neurological", body_part: "Nose & Mouth", description: "Reduced sense of taste or smell" },
  { symptom_id: 12, symptom_name: "Frequent Urination", category: "Endocrine/Renal", body_part: "Kidney & Urinary", description: "Urge to urinate more often than usual" },
  { symptom_id: 13, symptom_name: "Excessive Thirst", category: "Endocrine", body_part: "Whole Body", description: "Unquenchable thirst despite drinking fluids" },
  { symptom_id: 14, symptom_name: "Sore Throat", category: "Respiratory", body_part: "Throat", description: "Pain, scratchiness, or irritation in throat" },
  { symptom_id: 15, symptom_name: "Chills", category: "General", body_part: "Whole Body", description: "Feeling cold with involuntary shivering" },
  { symptom_id: 16, symptom_name: "Pain Behind Eyes", category: "Neurological", body_part: "Head & Eyes", description: "Aching pain behind or around eyes" },
  { symptom_id: 17, symptom_name: "Dizziness", category: "Neurological", body_part: "Head", description: "Feeling lightheaded, unsteady, or faint" },
  { symptom_id: 18, symptom_name: "Heartburn", category: "Gastrointestinal", body_part: "Stomach & Esophagus", description: "Burning sensation in chest after eating" },
  { symptom_id: 19, symptom_name: "Muscle Pain", category: "Musculoskeletal", body_part: "Whole Body", description: "General muscle soreness or body pain" },
  { symptom_id: 20, symptom_name: "Wheezing", category: "Respiratory", body_part: "Chest", description: "High-pitched whistling sound while breathing" }
];

export const INITIAL_DISEASES = [
  {
    disease_id: 1,
    disease_name: "Dengue Fever",
    category: "Viral Infection",
    severity_level: "High",
    description: "Mosquito-borne viral disease causing sudden high fever, intense headache, retro-orbital pain, severe muscle/joint aches, and rash.",
    precautions: "Hydrate aggressively with ORS/fluids, monitor blood platelet counts, rest completely, avoid NSAIDs like Ibuprofen/Aspirin.",
    recommended_specialist: "General Physician / Infectious Disease Specialist"
  },
  {
    disease_id: 2,
    disease_name: "Typhoid Fever",
    category: "Bacterial Infection",
    severity_level: "High",
    description: "Systemic infection caused by Salmonella typhi bacteria, presenting step-ladder fever, abdominal pain, fatigue, and nausea.",
    precautions: "Consume boiled water, stick to easily digestible food, complete prescribed antibiotic course, practice strict hand hygiene.",
    recommended_specialist: "General Physician / Gastroenterologist"
  },
  {
    disease_id: 3,
    disease_name: "Acute Bronchitis / Pneumonia",
    category: "Respiratory",
    severity_level: "High",
    description: "Inflammatory lung/airway infection causing persistent productive cough, chest tightness, fever, and breathing difficulty.",
    precautions: "Use steam inhalation, maintain bed rest, elevate head during sleep, avoid dust/cold exposure, seek immediate emergency care if oxygen drops.",
    recommended_specialist: "Pulmonologist"
  },
  {
    disease_id: 4,
    disease_name: "COVID-19 / Severe Viral URI",
    category: "Respiratory Infection",
    severity_level: "Moderate",
    description: "Contagious respiratory illness caused by SARS-CoV-2 or seasonal viruses characterized by loss of smell/taste, cough, fever, and fatigue.",
    precautions: "Isolate in a well-ventilated room, monitor pulse oximeter SpO2, take warm fluids, wear N95 mask around others.",
    recommended_specialist: "Pulmonologist / General Physician"
  },
  {
    disease_id: 5,
    disease_name: "Type 2 Diabetes Mellitus",
    category: "Endocrine & Metabolic",
    severity_level: "Moderate",
    description: "Chronic metabolic condition characterized by high blood glucose due to insulin resistance, causing polydipsia, polyuria, and fatigue.",
    precautions: "Follow low-GI diet, maintain daily physical exercise, monitor fasting blood glucose daily, avoid refined sugars.",
    recommended_specialist: "Endocrinologist"
  },
  {
    disease_id: 6,
    disease_name: "Gastroesophageal Reflux Disease (GERD) / Gastritis",
    category: "Gastrointestinal",
    severity_level: "Low to Moderate",
    description: "Digestive disorder where stomach acid repeatedly flows back into the tube connecting mouth and stomach, causing heartburn, nausea, and abdominal cramps.",
    precautions: "Avoid spicy/fatty foods, do not lie down within 2 hours after meals, eat smaller frequent meals, limit caffeine.",
    recommended_specialist: "Gastroenterologist"
  },
  {
    disease_id: 7,
    disease_name: "Acute Coronary Syndrome / Angina (Critical Alert)",
    category: "Cardiovascular",
    severity_level: "Emergency",
    description: "Potential cardiovascular emergency involving reduced blood flow to heart muscle, causing severe central chest pain radiating to left arm/jaw, dyspnea, cold sweating.",
    precautions: "IMMEDIATE EMERGENCY ASSISTANCE REQUIRED. Call local ambulance (108/911), remain stationary in sitting position, avoid physical exertion.",
    recommended_specialist: "Cardiologist / Emergency Medicine"
  },
  {
    disease_id: 8,
    disease_name: "Migraine Headaches",
    category: "Neurological",
    severity_level: "Moderate",
    description: "Neurological headache disorder manifesting as severe pulsating head pain, often unilateral, accompanied by nausea, light/sound sensitivity.",
    precautions: "Rest in a quiet dark room, apply cold compress to forehead, avoid screen exposure, maintain sleep schedule.",
    recommended_specialist: "Neurologist"
  }
];

export const INITIAL_DISEASE_SYMPTOMS = [
  // Dengue (disease_id: 1)
  { id: 1, disease_id: 1, symptom_id: 1, weight: 0.9, is_primary: true }, // High Fever
  { id: 2, disease_id: 1, symptom_id: 2, weight: 0.8, is_primary: true }, // Severe Headache
  { id: 3, disease_id: 1, symptom_id: 7, weight: 0.85, is_primary: true }, // Joint Pain
  { id: 4, disease_id: 1, symptom_id: 10, weight: 0.75, is_primary: false }, // Skin Rash
  { id: 5, disease_id: 1, symptom_id: 16, weight: 0.95, is_primary: true }, // Pain Behind Eyes
  { id: 6, disease_id: 1, symptom_id: 6, weight: 0.7, is_primary: false }, // Fatigue

  // Typhoid (disease_id: 2)
  { id: 7, disease_id: 2, symptom_id: 1, weight: 0.9, is_primary: true }, // High Fever
  { id: 8, disease_id: 2, symptom_id: 9, weight: 0.85, is_primary: true }, // Abdominal Pain
  { id: 9, disease_id: 2, symptom_id: 8, weight: 0.75, is_primary: false }, // Nausea
  { id: 10, disease_id: 2, symptom_id: 6, weight: 0.8, is_primary: true }, // Fatigue
  { id: 11, disease_id: 2, symptom_id: 15, weight: 0.7, is_primary: false }, // Chills

  // Bronchitis / Pneumonia (disease_id: 3)
  { id: 12, disease_id: 3, symptom_id: 3, weight: 0.95, is_primary: true }, // Persistent Cough
  { id: 13, disease_id: 3, symptom_id: 4, weight: 0.9, is_primary: true }, // Shortness of Breath
  { id: 14, disease_id: 3, symptom_id: 1, weight: 0.7, is_primary: false }, // High Fever
  { id: 15, disease_id: 3, symptom_id: 5, weight: 0.65, is_primary: false }, // Chest Pain
  { id: 16, disease_id: 3, symptom_id: 20, weight: 0.85, is_primary: true }, // Wheezing

  // COVID-19 (disease_id: 4)
  { id: 17, disease_id: 4, symptom_id: 11, weight: 0.98, is_primary: true }, // Loss of Taste/Smell
  { id: 18, disease_id: 4, symptom_id: 3, weight: 0.85, is_primary: true }, // Cough
  { id: 19, disease_id: 4, symptom_id: 1, weight: 0.8, is_primary: true }, // Fever
  { id: 20, disease_id: 4, symptom_id: 14, weight: 0.7, is_primary: false }, // Sore Throat
  { id: 21, disease_id: 4, symptom_id: 6, weight: 0.75, is_primary: false }, // Fatigue

  // Type 2 Diabetes (disease_id: 5)
  { id: 22, disease_id: 5, symptom_id: 12, weight: 0.95, is_primary: true }, // Frequent Urination
  { id: 23, disease_id: 5, symptom_id: 13, weight: 0.95, is_primary: true }, // Excessive Thirst
  { id: 24, disease_id: 5, symptom_id: 6, weight: 0.75, is_primary: false }, // Fatigue

  // GERD / Gastritis (disease_id: 6)
  { id: 25, disease_id: 6, symptom_id: 18, weight: 0.95, is_primary: true }, // Heartburn
  { id: 26, disease_id: 6, symptom_id: 9, weight: 0.8, is_primary: true }, // Abdominal Pain
  { id: 27, disease_id: 6, symptom_id: 8, weight: 0.7, is_primary: false }, // Nausea

  // Cardiac Alert (disease_id: 7)
  { id: 28, disease_id: 7, symptom_id: 5, weight: 0.99, is_primary: true }, // Chest Pain
  { id: 29, disease_id: 7, symptom_id: 4, weight: 0.9, is_primary: true }, // Dyspnea
  { id: 30, disease_id: 7, symptom_id: 17, weight: 0.8, is_primary: false }, // Dizziness
  { id: 31, disease_id: 7, symptom_id: 8, weight: 0.6, is_primary: false }, // Nausea

  // Migraine (disease_id: 8)
  { id: 32, disease_id: 8, symptom_id: 2, weight: 0.95, is_primary: true }, // Severe Headache
  { id: 33, disease_id: 8, symptom_id: 8, weight: 0.8, is_primary: true }, // Nausea
  { id: 34, disease_id: 8, symptom_id: 17, weight: 0.65, is_primary: false } // Dizziness
];

export const INITIAL_MEDICINES = [
  { medicine_id: 1, medicine_name: "Paracetamol 650mg", type: "Antipyretic / Analgesic", description: "Reduces fever and relieves mild to moderate pain", default_dosage: "1 Tablet after meals", default_duration: "3 - 5 Days" },
  { medicine_id: 2, medicine_name: "Azithromycin 500mg", type: "Antibiotic", description: "Broad-spectrum macrolide antibiotic for respiratory & bacterial infections", default_dosage: "1 Tablet daily once", default_duration: "5 Days" },
  { medicine_id: 3, medicine_name: "Oral Rehydration Salts (ORS)", type: "Electrolyte Solution", description: "Restores vital body fluids and electrolytes lost during fever/vomiting", default_dosage: "1 sachet in 1 Litre water daily", default_duration: "As needed" },
  { medicine_id: 4, medicine_name: "Pantoprazole 40mg", type: "Proton Pump Inhibitor (PPI)", description: "Reduces stomach acid production for GERD & acidity relief", default_dosage: "1 Tablet before breakfast", default_duration: "7 - 14 Days" },
  { medicine_id: 5, medicine_name: "Metformin 500mg ER", type: "Antidiabetic", description: "First-line medication for glucose control in type 2 diabetes", default_dosage: "1 Tablet twice daily with meals", default_duration: "Ongoing as prescribed" },
  { medicine_id: 6, medicine_name: "Levosalbutamol Inhaler (100mcg)", type: "Bronchodilator", description: "Quick relief inhaler for airway constriction and dyspnea", default_dosage: "2 Puffs as needed for shortness of breath", default_duration: "As required" },
  { medicine_id: 7, medicine_name: "Aspirin 75mg / Clopidogrel", type: "Antiplatelet", description: "Emergency cardiovascular medication (administer under ER direction)", default_dosage: "As directed by ER physician", default_duration: "Emergency use" }
];

export const DISEASE_MEDICINE_MAP = {
  1: [1, 3], // Dengue -> Paracetamol, ORS
  2: [1, 2, 3], // Typhoid -> Paracetamol, Azithromycin, ORS
  3: [2, 6, 1], // Bronchitis -> Azithromycin, Levosalbutamol, Paracetamol
  4: [1, 3, 2], // COVID-19 -> Paracetamol, ORS, Azithromycin
  5: [5], // Diabetes -> Metformin
  6: [4], // GERD -> Pantoprazole
  7: [7], // Cardiac -> Aspirin
  8: [1]  // Migraine -> Paracetamol
};

export const INITIAL_PREDICTIONS = [
  {
    prediction_id: 101,
    user_id: 2,
    user_name: "Ananya Patel",
    symptoms_selected: [1, 2, 16, 7], // Fever, Headache, Eye pain, Joint pain
    disease_id: 1,
    predicted_disease: "Dengue Fever",
    confidence_score: 92.5,
    prediction_date: "2026-08-08T10:14:00Z",
    status: "Completed",
    notes: "High correlation with viral mosquito infection parameters."
  },
  {
    prediction_id: 102,
    user_id: 3,
    user_name: "Rohan Verma",
    symptoms_selected: [3, 4, 20], // Cough, Dyspnea, Wheezing
    disease_id: 3,
    predicted_disease: "Acute Bronchitis / Pneumonia",
    confidence_score: 88.0,
    prediction_date: "2026-08-09T16:45:00Z",
    status: "Completed",
    notes: "Significant lower respiratory tract symptom presentation."
  }
];

export const INITIAL_DIAGNOSIS_REPORTS = [
  {
    report_id: 501,
    prediction_id: 101,
    user_id: 2,
    patient_name: "Ananya Patel",
    patient_age: 26,
    patient_gender: "Female",
    report_date: "2026-08-08T10:15:00Z",
    primary_diagnosis: "Dengue Fever",
    confidence_score: 92.5,
    symptoms_summary: ["High Fever (102°F)", "Severe Headache", "Pain Behind Eyes", "Joint Pain"],
    clinical_advice: "Rest completely. Drink plenty of water and ORS. Avoid heavy exercise. Monitor platelet counts via Complete Blood Count (CBC) test.",
    prescriptions: [
      { medicine_name: "Paracetamol 650mg", dosage: "1 Tablet thrice daily after food", duration: "5 Days" },
      { medicine_name: "Oral Rehydration Salts (ORS)", dosage: "1 sachet dissolved in 1L water daily", duration: "5 Days" }
    ],
    attending_doctor: "Dr. Rajesh Sharma (MD, Internal Medicine)"
  }
];

export const INITIAL_LOGIN_HISTORY = [
  { login_id: 1008, user_id: 1, user_name: "Harsh Patel (System Administrator)", email: "hkpatel7874@gmail.com", role: "Admin", login_time: "2026-08-11T19:10:00Z", ip_address: "127.0.0.1 (LocalHost)", device_info: "Chrome 128.0 (Windows 11) - Admin Session" },
  { login_id: 1007, user_id: 1, user_name: "Harsh Patel", email: "hkpatel7874@gmail.com", role: "Patient", login_time: "2026-08-11T18:45:00Z", ip_address: "127.0.0.1 (LocalHost)", device_info: "Firebase API Google Provider" },
  { login_id: 1006, user_id: 2, user_name: "Ananya Patel", email: "ananya.patient@example.com", role: "Patient", login_time: "2026-08-11T14:30:00Z", ip_address: "192.168.1.88", device_info: "Safari Mobile (iOS 17.5)" },
  { login_id: 1005, user_id: 4, user_name: "Dr. Vikram Seth", email: "doctor@sdps.health", role: "Doctor", login_time: "2026-08-11T09:15:00Z", ip_address: "192.168.1.12", device_info: "Chrome 127.0 (Windows 11)" },
  { login_id: 1004, user_id: 3, user_name: "Rohan Verma", email: "rohan.patient@example.com", role: "Patient", login_time: "2026-08-10T16:50:00Z", ip_address: "192.168.1.102", device_info: "Chrome Mobile (Android 14)" },
  { login_id: 1003, user_id: 1, user_name: "Harsh Patel (System Administrator)", email: "hkpatel7874@gmail.com", role: "Admin", login_time: "2026-08-10T14:20:00Z", ip_address: "127.0.0.1", device_info: "Firebase Auth Google OAuth" },
  { login_id: 1002, user_id: 2, user_name: "Ananya Patel", email: "ananya.patient@example.com", role: "Patient", login_time: "2026-08-10T11:05:00Z", ip_address: "192.168.1.88", device_info: "Edge 126.0 (Windows 11)" },
  { login_id: 1001, user_id: 4, user_name: "Dr. Vikram Seth", email: "doctor@sdps.health", role: "Doctor", login_time: "2026-08-09T08:12:00Z", ip_address: "192.168.1.45", device_info: "Firefox 128.0 (Windows 11)" }
];

