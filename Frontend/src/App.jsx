import React, { useState } from 'react';
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

const DashboardRouter = () => {
  const { currentUser } = useApp();
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [activeRxModal, setActiveRxModal] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Unauthenticated -> LoginPage Gateway
  if (!currentUser) {
    return <LoginPage />;
  }

  const role = currentUser.role || 'Patient';

  return (
    <div className="flex h-screen bg-[#0a0a1a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* Role-Scoped Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
