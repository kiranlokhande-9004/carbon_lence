import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { EmissionsDataPage } from './components/emissions/EmissionsDataPage';
import { Scope1Page, Scope2Page, Scope3Page } from './components/scopes/ScopePages';
import { EmissionFactorsPage } from './components/factors/EmissionFactorsPage';
import { AIRecommendationsPage } from './components/ai/AIRecommendationsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AuditTrailPage } from './components/audit/AuditTrailPage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { AddRecordModal } from './components/emissions/AddRecordModal';
import { CSVImportModal } from './components/emissions/CSVImportModal';
import { CalculationAuditModal } from './components/common/CalculationAuditModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  // If viewing the public landing page
  if (activeTab === 'landing') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-black text-slate-100 selection:bg-emerald-500 selection:text-white">
        <LandingPage />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  // If in onboarding flow
  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <OnboardingWizard />
        <ToastContainer />
      </div>
    );
  }

  // Active view router within the SaaS dashboard shell
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'emissions':
        return <EmissionsDataPage />;
      case 'scope1':
        return <Scope1Page />;
      case 'scope2':
        return <Scope2Page />;
      case 'scope3':
        return <Scope3Page />;
      case 'factors':
        return <EmissionFactorsPage />;
      case 'ai-insights':
        return <AIRecommendationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'audit':
        return <AuditTrailPage />;
      case 'profile':
      case 'settings':
        return <ProfileSettingsPage />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-150">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Application Modals */}
      <AddRecordModal />
      <CSVImportModal />
      <CalculationAuditModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
