# 🩺 Smart Disease Prediction System (SDPS.ai)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%2018-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org/)
[![Groq AI](https://img.shields.io/badge/AI%20Engine-Groq%20Llama--3.3--70b-orange.svg)](https://groq.com/)
[![Firebase](https://img.shields.io/badge/Auth-Google%20OAuth%20%26%20Phone%20OTP-FFCA28.svg)](https://firebase.google.com/)
[![Firestore](https://img.shields.io/badge/Database-Cloud%20Firestore%20Realtime-FF5722.svg)](https://firebase.google.com/docs/firestore)
[![Hosting](https://img.shields.io/badge/Deployment-Firebase%20Hosting-0288D1.svg)](https://sdps-health-app.web.app)

> 🌐 **Live Production Application:** [https://sdps-health-app.web.app](https://sdps-health-app.web.app)  
> 📁 **GitHub Repository:** [https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System](https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System)  
> 👨‍💻 **Designed, Architected & Developed by:** [Harsh Patel](https://github.com/Harsh-Patel-11)

---

## 📌 Executive Summary

The **Smart Disease Prediction System (SDPS.ai)** is a medical intelligence platform designed to assist patients, physicians, and health administrators with **AI-driven symptom analysis, disease prediction, digital prescriptions (Rx), automated diagnosis report generation, and real-time multi-device cloud synchronization**.

Powered by **Groq Llama-3.3-70B-Versatile AI** and **Cloud Firestore**, SDPS processes multi-symptom clinical inputs, calculates weighted confidence match scores, offers preventative guidance and specialist recommendations, and provides a continuous digital healthcare workflow across all devices.

---

## ✨ Key Features & Capabilities

### 🌌 1. 3D WebGL Story Landing Experience
- **Interactive 7-Step Visual Journey**: Explores patient diagnostics from initial symptom onset to report compilation and clinical consultation.
- **Dynamic 3D Canvas Animations**: Smooth visual lining and orbital particle effects powered by WebGL/Three.js.
- **Step-by-Step Scroll Travel**: Scroll-locked journey with right-side vertical progress tracking, bottom navigation bar, and instant skip options.
- **Crafted with Purpose**: Features dedicated branding and direct entrance into the clinical diagnostic portal.

### 🧠 2. AI Symptom Console & Multi-Symptom Diagnostics
- **Organized Anatomical Categories**: Respiratory, Cardiovascular, Neurological, Gastrointestinal, Dermatological, and Musculoskeletal symptom groups.
- **Severity-Weighted Matching Algorithm**: Combines clinical rule-based mappings with Groq AI inference fallback.
- **Confidence Scoring (0–97%)**: Quantifies prediction reliability based on symptom intensity and primary diagnostic markers.

### 📜 3. Digital Prescriptions (Rx) & Diagnosis Reports
- **Diagnosis Report Generator**: Compiles patient symptoms, matched conditions, confidence scores, and specialist referrals into structured, downloadable reports.
- **Dedicated Prescriptions Tab**: Digital Rx cards showing recommended medications, dosages, frequency, precautions, follow-up instructions, and red-flag emergency notices.
- **Cross-Device Persistence**: All past predictions and prescriptions persist to Cloud Firestore and sync immediately across phones, tablets, and desktop workstations.

### 🤖 4. Groq AI Medical & Wellness Assistant
- **Empathetic Health Chatbot**: Integrated `llama-3.3-70b-versatile` assistant accessible from any screen.
- **Live Real-Time Temporal Awareness**: Real-time awareness of the current date, local time, and day of the week.
- **Selective Clinical Keyword Highlighting**: Emphasizes genuine medical terms, condition names, medications, and warning flags in high-contrast styling while eliminating random bold words.
- **General Wellness Guidance**: Instant guidance on healthy weight loss routines, sleep hygiene, balanced nutrition, stress relief, and home remedies.

### 🔐 5. Passwordless Secure Authentication
- **100% Passwordless Architecture**: Eliminates legacy, vulnerable passwords in favor of modern, secure identity providers:
  - **Google OAuth Sign-In**: 1-click authentication with profile synchronization.
  - **Firebase Phone OTP (SMS)**: SMS OTP verification with automatic `+91` prefill and reCAPTCHA security.
- **Multi-Device Real-Time Sync**: Instant profile and prescription updates across all user sessions via Firestore listeners.

### 👤 6. Personal Health Profile & DOB Calculator
- **Cascading Date of Birth Picker**: Sequential Year → Month → Day selector with leap-year awareness and dynamic day calculation.
- **Auto-Calculated Age**: Computes and displays exact age automatically from birth date without manual input.
- **Profile Completeness Tracker**: Visual meter tracking personal, emergency contact, allergy, and blood group details.

### 👑 7. Role-Based Access Control (RBAC) & Admin Control
- **Patient Dashboard**: Symptom checking, personal diagnosis history, prescription records, and profile settings.
- **Doctor Portal**: Clinical patient queue, diagnosis validation, report reviews, and digital prescription issuance.
- **Administrator Console**:
  - **Real-Time Session Monitoring**: Live `🟢 Online Now` vs `⚪ Offline` indicators.
  - **Full Profile Editing**: Manage user parameters, roles, and emergency information.
  - **Master Medical Catalog**: CRUD controls for Diseases, Symptoms, and Pharmacy Inventory.
  - **Audit Logging**: Chronological login event history tracking IP, device type, and login timestamps.

---

## 🏗️ System Architecture & Tech Stack

```mermaid
graph TD
    User["📱 Web / Mobile Client (React + Vite)"] --> Auth["🔐 Firebase Auth (Google OAuth & Phone OTP)"]
    User --> State["⚡ React AppContext (Global State)"]
    State <--> Firestore["🔥 Cloud Firestore (Realtime Sync: Reports, Rx, Profiles)"]
    State --> Express["🚀 Node.js Express Backend (Port 5000)"]
    Express --> Groq["🧠 Groq AI API (llama-3.3-70b-versatile)"]
    Express --> DB["💾 Database (MySQL / SQLite Fallback)"]
    State -. Direct Client Fallback .-> Groq
```

### Technology Matrix

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 8, TailwindCSS v4 |
| **3D & Visual Graphics** | WebGL / Three.js Canvas, Custom CSS Keyframe Animations |
| **Icons & UI Components** | Lucide React, Framer Motion transitions |
| **Authentication** | Firebase Auth (Google OAuth, Phone OTP SMS) |
| **Cloud Database** | Cloud Firestore (Real-Time Synchronized Database) |
| **AI Inference Engine** | Groq Cloud Llama-3.3-70B-Versatile API |
| **Backend API Server** | Node.js, Express.js, CORS |
| **Relational Database** | MySQL (Primary) / Embedded SQLite (`sdps_database.sqlite`) |
| **Hosting & CDN** | Firebase Hosting (`https://sdps-health-app.web.app`) |

---

## 🚀 Local Installation & Setup Guide

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System.git
cd Smart-Disease-Prediction-System
```

### 3. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sdps_db
```

Start the backend server:
```bash
node server.js
```
*(Backend will run on `http://localhost:5000`)*

### 4. Frontend Setup
```bash
cd ../Frontend
npm install
```

Create a `.env` file in `Frontend/`:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=AIzaSyCWxEtaa5wq9PtkpVEEzSU7vtZDN4gtbV4
VITE_FIREBASE_AUTH_DOMAIN=sdps-health-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sdps-health-app
VITE_FIREBASE_STORAGE_BUCKET=sdps-health-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1096125543138
VITE_FIREBASE_APP_ID=1:1096125543138:web:85db490245c758737ce4bb
```

Start the development server:
```bash
npm run dev
```
*(Frontend will run on `http://localhost:5173`)*

### 5. Production Build & Deployment
```bash
# Build the production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📂 Project Directory Structure

```
Smart-Disease-Prediction-System/
├── Backend/
│   ├── db.js                      # MySQL & SQLite database connection & migrations
│   ├── package.json               # Backend dependencies
│   ├── sdps_database.sqlite       # Local embedded fallback database
│   └── server.js                  # Express API server & Groq AI endpoint
├── Frontend/
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatbot.jsx              # Groq AI Medical & Wellness Assistant
│   │   │   ├── AdminDashboard.jsx         # Administrative control portal
│   │   │   ├── Background3DCanvas.jsx     # WebGL 3D Canvas visual effects
│   │   │   ├── DiagnosisReportModal.jsx   # Clinical diagnosis report viewer
│   │   │   ├── DoctorDashboard.jsx        # Doctor queue & prescription portal
│   │   │   ├── HeaderBar.jsx              # Application navigation header
│   │   │   ├── LandingPage.jsx            # 7-Step 3D Story Landing experience
│   │   │   ├── LoginPage.jsx              # Google OAuth & Phone OTP authentication
│   │   │   ├── Navbar.jsx                 # Top navbar & role switcher
│   │   │   ├── PatientDashboard.jsx       # Patient portal with Symptom Checker
│   │   │   ├── PatientHistory.jsx         # Diagnosis & prescription history
│   │   │   ├── PrescriptionViewModal.jsx  # Digital Rx view & print modal
│   │   │   ├── Sidebar.jsx                # Collapsible sidebar navigation
│   │   │   ├── SymptomChecker.jsx         # Multi-symptom AI prediction console
│   │   │   └── UserProfile.jsx            # Profile manager & cascading DOB picker
│   │   ├── context/
│   │   │   └── AppContext.jsx             # Global state, Auth, Firestore & ML Engine
│   │   ├── data/
│   │   │   └── initialData.js             # Seed medical datasets (Diseases & Symptoms)
│   │   ├── firebase/
│   │   │   └── config.js                  # Firebase Auth & Firestore client configuration
│   │   ├── App.jsx                        # Root React application
│   │   ├── main.jsx                       # React DOM entry point
│   │   └── index.css                      # TailwindCSS styles & design tokens
│   ├── firestore.rules            # Firestore security rules
│   ├── firebase.json              # Firebase Hosting configuration
│   ├── package.json               # Frontend dependencies & scripts
│   └── vite.config.js             # Vite build configuration
├── README.md                      # Project documentation
└── .gitignore                     # Git ignore rules
```

---

## 👨‍💻 Author & Project Maintainer

- **Creator & Lead Architect:** **Harsh Patel**
- **GitHub:** [@Harsh-Patel-11](https://github.com/Harsh-Patel-11)
- **Repository:** [Smart-Disease-Prediction-System](https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
