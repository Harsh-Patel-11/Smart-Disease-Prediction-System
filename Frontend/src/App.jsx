import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DiagnosisReportModal } from './components/DiagnosisReportModal';
import { PrescriptionViewModal } from './components/PrescriptionViewModal';
import { AIChatbot } from './components/AIChatbot';
import LandingPage from './components/LandingPage';

const DashboardRouter = () => {
  const { currentUser } = useApp();
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [activeRxModal, setActiveRxModal] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // Landing page gate — skip if user is already authenticated (came from a reload)
  const [landingDone, setLandingDone] = useState(
    () => !!sessionStorage.getItem('sdps_landing_done') || !!currentUser
  );

  // ── Browser Back-button: if user presses Back from Login/App to landing page ──
  useEffect(() => {
    const showLandingIfNeeded = () => {
      // If the current hash is #step-N, show the landing page
      if (/^#step-\d+/.test(window.location.hash)) {
        sessionStorage.removeItem('sdps_landing_done');
        setLandingDone(false);
      }
    };
    // Both hashchange and popstate can fire when pressing Back
    window.addEventListener('hashchange', showLandingIfNeeded);
    window.addEventListener('popstate', showLandingIfNeeded);
    return () => {
      window.removeEventListener('hashchange', showLandingIfNeeded);
      window.removeEventListener('popstate', showLandingIfNeeded);
    };
  }, []);

  // Show landing page for first-time visitors
  if (!landingDone) {
    return <LandingPage onEnter={() => setLandingDone(true)} />;
  }

  // Unauthenticated -> LoginPage Gateway
  if (!currentUser) {
    return (
      <LoginPage
        onBackToLanding={() => {
          sessionStorage.removeItem('sdps_landing_done');
          window.location.hash = '#step-7';
          setLandingDone(false);
        }}
      />
    );
  }

  const role = currentUser.role || 'Patient';

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white overflow-hidden">

      
      {/* Role-Scoped Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div ref={scrollContainerRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <HeaderBar
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 pb-12">
          {role === 'Admin' ? (
            <AdminDashboard />
          ) : role === 'Doctor' ? (
            <DoctorDashboard
              onOpenReport={(report) => setActiveReportModal(report)}
              onOpenPrescription={(report) => setActiveRxModal(report)}
            />
          ) : (
            <PatientDashboard
              onOpenReport={(report) => setActiveReportModal(report)}
              onOpenPrescription={(report) => setActiveRxModal(report)}
              scrollContainerRef={scrollContainerRef}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <DiagnosisReportModal
        report={activeReportModal}
        onClose={() => setActiveReportModal(null)}
        onOpenPrescription={(report) => setActiveRxModal(report)}
      />

      <PrescriptionViewModal
        report={activeRxModal}
        onClose={() => setActiveRxModal(null)}
      />

      {/* Global Groq AI Chatbot */}
      <AIChatbot />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardRouter />
    </AppProvider>
  );
}
