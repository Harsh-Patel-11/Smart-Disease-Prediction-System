# 🩺 Smart Disease Prediction System (SDPS) with Groq AI & Firebase

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%2018-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org/)
[![Groq AI](https://img.shields.io/badge/AI%20Engine-Groq%20Llama--3.3--70b-orange.svg)](https://groq.com/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase%20Google%20%26%20Phone%20OTP-FFCA28.svg)](https://firebase.google.com/)
[![IEEE SRS](https://img.shields.io/badge/Compliance-IEEE%20SRS%20Std%20830-emerald.svg)](./Frontend/src/components/SrsArchitectureViewer.jsx)

> **Live Production URL:** [https://sdps-health-app.web.app](https://sdps-health-app.web.app)  
> **GitHub Repository:** [https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System](https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System)

---

## 📌 Executive Summary

The **Smart Disease Prediction System (SDPS)** is an end-to-end medical diagnostic web platform designed to assist patients, doctors, and system administrators with **AI-driven symptom analysis, disease prediction, digital prescriptions (Rx), automated diagnosis report generation, and real-time user session tracking**.

Powered by **Groq Llama-3.3-70B-Versatile AI**, SDPS evaluates multi-symptom inputs, computes dynamic confidence match scores, suggests precautions and specialist recommendations, and generates standardized medical reports.

---

## ✨ Key Features & Capabilities

### 🧠 1. AI Symptom Console & Multi-Symptom Diagnostics
- Interactive body-part & category selector (Respiratory, Cardiovascular, Neurological, Gastrointestinal, etc.).
- Weighted symptom match algorithm + Groq AI fallback for accurate diagnosis.
- Dynamic confidence score calculation (0–97%) based on symptom severity and specificity.

### 📜 2. Diagnosis Reports & Digital Prescriptions (Rx)
- **Separated Navigation Views**:
  - **Diagnosis Tab**: Clean layout showing diagnosis name, severity level, confidence bar, and full report viewer.
  - **Prescriptions Tab**: Dedicated digital prescription card highlighting recommended medicines, default dosages, duration, precautions, follow-up advice, and emergency warnings.
- Printable & downloadable digital Rx reports.

### 🤖 3. Floating Groq AI Medical Assistant
- Context-aware chatbot powered by `llama-3.3-70b-versatile` via Groq API.
- Answers health queries, explains medical terminology, and provides wellness advice.

### 🛡️ 4. Role-Based Access Control (RBAC) & Authentication
- **Firebase Authentication**:
  - **Google OAuth Sign-In** with automatic account creation.
  - **Phone OTP SMS Verification** compliant with Firebase Auth `signInWithPhoneNumber` and `RecaptchaVerifier` (default prefilled with `+91`).
  - **Email & Password Authentication**.
- **Role Isolation**:
  - **Patient**: Access Symptom Checker, Personal Medical History, Profile Settings.
  - **Doctor**: View Clinical Patient Queue, Review AI Reports, Issue Prescriptions.
  - **Admin**: Full System Root Access (`hkpatel7874@gmail.com`).

### 👑 5. Administrative Portal (Root Access)
- **Real-Time User Session Tracking**: Blinking `🟢 Online Now` vs `⚪ Offline` badges.
- **Full User Profile Control**: Edit user name, email, contact phone, age, gender, blood group, address, allergies, emergency contact, and RBAC role.
- **Master CRUD Management**: Add, edit, or delete Diseases, Symptoms, and Medicines Inventory.
- **Past & Live Audit Logs**: Complete chronological history of login events with IP addresses, timestamps, and device metrics.

---

## 🏗️ System Architecture & Tech Stack

```mermaid
graph TD
    User["📱 Web / Mobile Client (React + Vite)"] --> Auth["🔐 Firebase Auth (Google & Phone OTP)"]
    User --> Context["⚡ React AppContext (Global State & LocalStorage)"]
    Context --> Express["🚀 Node.js Express Backend (Port 5000)"]
    Express --> Groq["🧠 Groq AI API (llama-3.3-70b-versatile)"]
    Express --> DB["💾 Database (MySQL / SQLite Fallback)"]
    Context -. Direct Client Fallback .-> Groq
```

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 8, TailwindCSS v4 |
| **Icons & UI** | Lucide React, Framer Motion transitions |
| **Authentication** | Firebase Authentication API (Google OAuth, Phone OTP, Email/Password) |
| **AI Inference** | Groq Llama-3.3-70B-Versatile API |
| **Backend Server** | Node.js, Express.js, CORS |
| **Database** | MySQL (Primary) / Embedded SQLite (`sdps_database.sqlite`) |
| **Hosting & Deployment** | Firebase Hosting (`https://sdps-health-app.web.app`) |

---

## 🚀 Local Installation & Setup Guide

### 1. Prerequisites
- **Node.js** v18+ installed
- **Git** installed

### 2. Clone the Repository
```bash
git clone https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System.git
cd Smart-Disease-Prediction-System
```

### 3. Setup Backend
```bash
cd Backend
npm install
```
Create a `.env` file inside `Backend/`:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sdps_db
```
Start Backend server:
```bash
node server.js
```
*(Backend runs on `http://localhost:5000`)*

### 4. Setup Frontend
```bash
cd ../Frontend
npm install
```
Create a `.env` file inside `Frontend/`:
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
Start Frontend development server:
```bash
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 📄 IEEE SRS Standard Compliance

This project is built according to **IEEE Std 830-1998 Software Requirements Specification (SRS)** guidelines:
- **Functional Requirements (FR-01 to FR-15)**: Multi-symptom selection, ML scoring, report generation, prescription dispatch, RBAC user authentication.
- **Non-Functional Requirements (NFR-01 to NFR-08)**: Sub-second response time via Groq AI, 256-bit encryption, responsive mobile layouts, 99.9% availability.
- Accessible via the **IEEE SRS Architecture** viewer in the app sidebar.

---

## 👨‍💻 Author & Project Maintainer

- **Developer:** Harsh Patel
- **GitHub:** [@Harsh-Patel-11](https://github.com/Harsh-Patel-11)
- **Project Repo:** [Smart-Disease-Prediction-System](https://github.com/Harsh-Patel-11/Smart-Disease-Prediction-System)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
