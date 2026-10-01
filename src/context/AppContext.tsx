import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  EmissionRecord,
  EmissionFactor,
  BusinessProfile,
  AuditLog,
  NotificationItem,
  ScopeType,
  TeamMember,
} from '../types';
import {
  initialBusinessProfile,
  initialEmissionRecords,
  initialFactors,
  initialAuditLogs,
  initialNotifications,
  initialTeamMembers,
} from '../data/initialData';
import { calculateEmissions } from '../utils/calculationEngine';
import { CompanyESGData, defaultMicrosoftESGData } from '../data/microsoftESGData';
import { generateCompanyESGStatusPDF } from '../utils/pdfGenerator';

export type NavigationTab =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'emissions'
  | 'scope1'
  | 'scope2'
  | 'scope3'
  | 'factors'
  | 'ai-insights'
  | 'reports'
  | 'audit'
  | 'profile'
  | 'settings';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  reportingPeriod: string;
  setReportingPeriod: (period: string) => void;
  business: BusinessProfile;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  records: EmissionRecord[];
  filteredRecords: EmissionRecord[];
  addEmissionRecord: (data: Omit<EmissionRecord, 'id' | 'createdAt' | 'co2eKg' | 'co2eTonne'>) => void;
  updateEmissionRecord: (id: string, updates: Partial<EmissionRecord>) => void;
  deleteEmissionRecord: (id: string) => void;
  batchImportRecords: (newRecords: Omit<EmissionRecord, 'id' | 'createdAt' | 'co2eKg' | 'co2eTonne'>[]) => void;
  factors: EmissionFactor[];
  addEmissionFactor: (factor: Omit<EmissionFactor, 'id'>) => void;
  updateEmissionFactor: (id: string, updates: Partial<EmissionFactor>) => void;
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'addedAt'>) => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Modals & Inspection
  isAddRecordModalOpen: boolean;
  setIsAddRecordModalOpen: (open: boolean) => void;
  isCSVImportModalOpen: boolean;
  setIsCSVImportModalOpen: (open: boolean) => void;
  isESGUploadModalOpen: boolean;
  setIsESGUploadModalOpen: (open: boolean) => void;
  selectedRecordForAudit: EmissionRecord | null;
  setSelectedRecordForAudit: (record: EmissionRecord | null) => void;
  authModal: { isOpen: boolean; mode: 'login' | 'signup' | 'forgot' };
  openAuthModal: (mode: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  // Real Company ESG Data & PDF Pipeline
  currentESGData: CompanyESGData;
  setCurrentESGData: (data: CompanyESGData) => void;
  applyESGData: (data: CompanyESGData) => void;
  downloadESGStatusPDF: (data?: CompanyESGData) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string } | null;
  login: (email: string, name?: string) => void;
  signup: (fullName: string, businessName: string, email: string) => void;
  logout: () => void;
  completeOnboarding: (wizardData: Partial<BusinessProfile>) => void;
  resetToDemo: () => void;

  // Computed metrics
  metrics: {
    totalEmissionsTonne: number;
    scope1Tonne: number;
    scope2Tonne: number;
    scope3Tonne: number;
    diffPreviousPeriodPct: number;
    targetProgressPct: number;
    dataQualityScore: number;
    recordCount: number;
  };
  monthlyTrendData: Array<{ month: string; currentYear: number; previousYear: number }>;
  scopeBreakdown: Array<{ name: string; value: number; color: string }>;
  hotspotsData: Array<{ category: string; emissions: number; scope: ScopeType }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BUSINESS: 'carbonlens_business_v1',
  RECORDS: 'carbonlens_records_v1',
  FACTORS: 'carbonlens_factors_v1',
  AUDIT: 'carbonlens_audit_v1',
  AUTH: 'carbonlens_auth_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [reportingPeriod, setReportingPeriod] = useState<string>(() => String(defaultMicrosoftESGData.reportingYear));

  // Real Company ESG Dataset State (defaults to verified Microsoft Corporation)
  const [currentESGData, setCurrentESGData] = useState<CompanyESGData>(() => {
    try {
      const saved = localStorage.getItem('carbonlens_esg_data_v1');
      return saved ? JSON.parse(saved) : defaultMicrosoftESGData;
    } catch {
      return defaultMicrosoftESGData;
    }
  });

  const [isESGUploadModalOpen, setIsESGUploadModalOpen] = useState(false);

  const applyESGData = (data: CompanyESGData) => {
    setCurrentESGData(data);
    try {
      localStorage.setItem('carbonlens_esg_data_v1', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }

    setBusiness((prev) => ({
      ...prev,
      name: data.companyName,
      industry: data.industry,
      employees: data.employees,
      reportingYear: data.reportingYear,
      baselineYear: data.baselineYear,
    }));
    setReportingPeriod(String(data.reportingYear));
  };

  const downloadESGStatusPDF = (data?: CompanyESGData) => {
    generateCompanyESGStatusPDF(data || currentESGData);
  };

  // Business Profile
  const [business, setBusiness] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      return saved ? JSON.parse(saved) : initialBusinessProfile;
    } catch {
      return initialBusinessProfile;
    }
  });

  // Emission Records
  const [records, setRecords] = useState<EmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : initialEmissionRecords;
    } catch {
      return initialEmissionRecords;
    }
  });

  // Emission Factors
  const [factors, setFactors] = useState<EmissionFactor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACTORS);
      return saved ? JSON.parse(saved) : initialFactors;
    } catch {
      return initialFactors;
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? Boolean(JSON.parse(saved)?.isAuthenticated) : false;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? JSON.parse(saved)?.user : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  const [selectedRecordForAudit, setSelectedRecordForAudit] = useState<EmissionRecord | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'forgot' }>({
    isOpen: false,
    mode: 'login',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
    } catch (e) {
      console.error(e);
    }
  }, [business]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FACTORS, JSON.stringify(factors));
    } catch (e) {
      console.error(e);
    }
  }, [factors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ isAuthenticated, user: currentUser })
      );
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated, currentUser]);

  // Record Filtering based on period
  const filteredRecords = useMemo(() => {
    if (reportingPeriod === 'all') return records;
    if (reportingPeriod === '2026') {
      return records.filter((r) => r.date.startsWith('2026'));
    }
    if (reportingPeriod === 'q1') {
      return records.filter((r) => {
        const month = parseInt(r.date.split('-')[1], 10);
        return r.date.startsWith('2026') && month >= 1 && month <= 3;
      });
    }
    if (reportingPeriod === 'q2') {
      return records.filter((r) => {
        const month = parseInt(r.date.split('-')[1], 10);
        return r.date.startsWith('2026') && month >= 4 && month <= 6;
      });
    }
    if (reportingPeriod === 'q3') {
      return records.filter((r) => {
        const month = parseInt(r.date.split('-')[1], 10);
        return r.date.startsWith('2026') && month >= 7 && month <= 9;
      });
    }
    if (reportingPeriod === 'q4') {
      return records.filter((r) => {
        const month = parseInt(r.date.split('-')[1], 10);
        return r.date.startsWith('2026') && month >= 10 && month <= 12;
      });
    }
    return records;
  }, [records, reportingPeriod]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let qualityPoints = 0;

    filteredRecords.forEach((r) => {
      const t = r.co2eTonne || 0;
      if (r.scope === 'Scope 1') s1 += t;
      else if (r.scope === 'Scope 2') s2 += t;
      else if (r.scope === 'Scope 3') s3 += t;

      if (r.dataQuality === 'High') qualityPoints += 100;
      else if (r.dataQuality === 'Medium') qualityPoints += 70;
      else qualityPoints += 40;
    });

    const total = s1 + s2 + s3;
    const avgQuality = filteredRecords.length > 0 ? Math.round(qualityPoints / filteredRecords.length) : 78;

    // Verified company ESG numbers if corporate profile is active
    const hasESG = Boolean(currentESGData?.metrics?.scope1?.currentValue);
    const esgTotal = hasESG ? (currentESGData.metrics.totalEmissionsMarket.currentValue || total) : total;
    const esgS1 = hasESG ? (currentESGData.metrics.scope1.currentValue || s1) : s1;
    const esgS2 = hasESG ? (currentESGData.metrics.scope2Market.currentValue || s2) : s2;
    const esgS3 = hasESG ? (currentESGData.metrics.scope3.currentValue || s3) : s3;
    const esgDiff = hasESG ? (currentESGData.metrics.totalEmissionsMarket.percentageChange || 19.05) : -8.4;

    return {
      totalEmissionsTonne: Math.round(esgTotal * 100) / 100,
      scope1Tonne: Math.round(esgS1 * 100) / 100,
      scope2Tonne: Math.round(esgS2 * 100) / 100,
      scope3Tonne: Math.round(esgS3 * 100) / 100,
      diffPreviousPeriodPct: esgDiff,
      targetProgressPct: 18.2, // 18.2% achieved toward 30% target
      dataQualityScore: avgQuality,
      recordCount: filteredRecords.length,
    };
  }, [filteredRecords, currentESGData]);

  // Monthly trend chart data (Jan - Dec) comparing 2026 vs 2025
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySum: { [key: number]: number } = {};

    records.forEach((r) => {
      if (r.date.startsWith('2026')) {
        const m = parseInt(r.date.split('-')[1], 10) - 1;
        monthlySum[m] = (monthlySum[m] || 0) + (r.co2eTonne || 0);
      }
    });

    // Realistic baseline pattern for 2025 with seasonal variation
    const baseline2025 = [14.8, 13.9, 15.2, 16.0, 15.5, 14.9, 14.2, 14.0, 13.8, 14.5, 15.0, 15.6];

    return months.map((month, idx) => {
      const cur = monthlySum[idx];
      // For future months in 2026 (Sep-Dec), show projected/modeled values or empty
      const currentVal = cur !== undefined ? Math.round(cur * 10) / 10 : (idx >= 8 ? Math.round(baseline2025[idx] * 0.91 * 10) / 10 : 0);
      return {
        month,
        currentYear: currentVal,
        previousYear: baseline2025[idx],
      };
    });
  }, [records]);

  // Donut chart scope breakdown
  const scopeBreakdown = useMemo(() => {
    return [
      { name: 'Scope 1 (Direct)', value: metrics.scope1Tonne || 31.4, color: '#f97316' }, // Orange
      { name: 'Scope 2 (Electricity/Heat)', value: metrics.scope2Tonne || 54.7, color: '#0284c7' }, // Blue
      { name: 'Scope 3 (Value Chain)', value: metrics.scope3Tonne || 42.5, color: '#059669' }, // Emerald
    ];
  }, [metrics]);

  // Hotspots horizontal bar data
  const hotspotsData = useMemo(() => {
    const catMap: { [cat: string]: { sum: number; scope: ScopeType } } = {};
    filteredRecords.forEach((r) => {
      if (!catMap[r.category]) {
        catMap[r.category] = { sum: 0, scope: r.scope };
      }
      catMap[r.category].sum += r.co2eTonne || 0;
    });

    const list = Object.entries(catMap).map(([category, val]) => ({
      category,
      emissions: Math.round(val.sum * 10) / 10,
      scope: val.scope,
    }));

    return list.sort((a, b) => b.emissions - a.emissions).slice(0, 6);
  }, [filteredRecords]);

  // Helper to append audit log
  const logAudit = (
    action: AuditLog['action'],
    recordName: string,
    newValue: string,
    category: string,
    prevValue?: string
  ) => {
    const userDisplay = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Sustainability Lead';
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: userDisplay,
      action,
      record: recordName,
      prevValue,
      newValue,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Actions
  const addEmissionRecord = (data: Omit<EmissionRecord, 'id' | 'createdAt' | 'co2eKg' | 'co2eTonne'>) => {
    const calc = calculateEmissions(data.quantity, data.factorValue, data.unit, data.factorUnit);
    const newRecord: EmissionRecord = {
      ...data,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      co2eKg: calc.co2eKg,
      co2eTonne: calc.co2eTonne,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRecords((prev) => [newRecord, ...prev]);
    logAudit(
      'Created',
      `${newRecord.activityName} (${newRecord.category})`,
      `${newRecord.quantity.toLocaleString()} ${newRecord.unit} → ${newRecord.co2eTonne.toFixed(3)} tCO₂e`,
      newRecord.scope
    );
    showToast(`Emission record added: ${newRecord.co2eTonne.toFixed(3)} tCO₂e`, 'success');
  };

  const updateEmissionRecord = (id: string, updates: Partial<EmissionRecord>) => {
    setRecords((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = updates.quantity !== undefined ? updates.quantity : item.quantity;
          const fVal = updates.factorValue !== undefined ? updates.factorValue : item.factorValue;
          const u = updates.unit !== undefined ? updates.unit : item.unit;
          const fU = updates.factorUnit !== undefined ? updates.factorUnit : item.factorUnit;
          const calc = calculateEmissions(qty, fVal, u, fU);

          const updated: EmissionRecord = {
            ...item,
            ...updates,
            co2eKg: calc.co2eKg,
            co2eTonne: calc.co2eTonne,
            updatedAt: new Date().toISOString().split('T')[0],
          };

          logAudit(
            'Updated',
            item.activityName,
            `${updated.co2eTonne.toFixed(3)} tCO₂e`,
            item.scope,
            `${item.co2eTonne.toFixed(3)} tCO₂e`
          );
          return updated;
        }
        return item;
      })
    );
    showToast('Emission record updated successfully', 'success');
  };

  const deleteEmissionRecord = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (target) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      logAudit('Deleted', target.activityName, 'Record removed from workspace', target.scope);
      showToast(`Record "${target.activityName}" deleted`, 'info');
    }
  };

  const batchImportRecords = (newRecords: Omit<EmissionRecord, 'id' | 'createdAt' | 'co2eKg' | 'co2eTonne'>[]) => {
    let totalAddedTonne = 0;
    const now = new Date().toISOString().split('T')[0];

    const processed = newRecords.map((r, i) => {
      const calc = calculateEmissions(r.quantity, r.factorValue, r.unit, r.factorUnit);
      totalAddedTonne += calc.co2eTonne;
      return {
        ...r,
        id: `rec-csv-${Date.now()}-${i}`,
        co2eKg: calc.co2eKg,
        co2eTonne: calc.co2eTonne,
        createdAt: now,
      } as EmissionRecord;
    });

    setRecords((prev) => [...processed, ...prev]);
    logAudit(
      'CSV Imported',
      `Batch Import (${newRecords.length} records)`,
      `Added ${totalAddedTonne.toFixed(3)} tCO₂e across scopes`,
      'Data Import'
    );
    showToast(`Successfully imported ${newRecords.length} records (${totalAddedTonne.toFixed(2)} tCO₂e)`, 'success');
  };

  const addEmissionFactor = (factor: Omit<EmissionFactor, 'id'>) => {
    const newFactor: EmissionFactor = {
      ...factor,
      id: `ef-cust-${Date.now()}`,
    };
    setFactors((prev) => [newFactor, ...prev]);
    logAudit(
      'Factor Changed',
      `Added factor: ${newFactor.name}`,
      `${newFactor.value} kgCO₂e/${newFactor.unit} (${newFactor.source})`,
      'Emission Factors'
    );
    showToast(`Factor "${newFactor.name}" added to library`, 'success');
  };

  const updateEmissionFactor = (id: string, updates: Partial<EmissionFactor>) => {
    setFactors((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          logAudit(
            'Factor Changed',
            f.name,
            `${updated.value} kgCO₂e/${updated.unit}`,
            'Emission Factors',
            `${f.value} kgCO₂e/${f.unit}`
          );
          return updated;
        }
        return f;
      })
    );
    showToast('Emission factor updated', 'success');
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => {
    setBusiness((prev) => {
      const updated = { ...prev, ...updates };
      logAudit('Updated', 'Business Profile details', updated.name, 'Business Profile');
      return updated;
    });
    showToast('Business details updated', 'success');
  };

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'addedAt'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `usr-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setTeamMembers((prev) => [...prev, newMember]);
    logAudit('Created', `Added team member: ${newMember.name}`, newMember.role, 'Team Access');
    showToast(`Invitation sent to ${newMember.email}`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const login = (email: string, name = 'Ananya Sharma') => {
    const user = { name, email, role: 'Admin' };
    setIsAuthenticated(true);
    setCurrentUser(user);
    closeAuthModal();
    showToast(`Welcome back, ${name}!`, 'success');
    setActiveTab('dashboard');
  };

  const signup = (fullName: string, businessName: string, email: string) => {
    const user = { name: fullName, email, role: 'Admin' };
    setIsAuthenticated(true);
    setCurrentUser(user);
    setBusiness((prev) => ({ ...prev, name: businessName }));
    closeAuthModal();
    showToast(`Account created for ${businessName}!`, 'success');
    setActiveTab('onboarding');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('landing');
    showToast('Logged out of CarbonLens', 'info');
  };

  const completeOnboarding = (wizardData: Partial<BusinessProfile>) => {
    setBusiness((prev) => ({ ...prev, ...wizardData }));
    logAudit('Created', 'Onboarding completed', `Workspace configured for ${wizardData.name || business.name}`, 'Workspace');
    showToast('Your CarbonLens workspace is ready!', 'success');
    setActiveTab('dashboard');
  };

  const resetToDemo = () => {
    setBusiness(initialBusinessProfile);
    setCurrentESGData(defaultMicrosoftESGData);
    setReportingPeriod(String(defaultMicrosoftESGData.reportingYear));
    try {
      localStorage.setItem('carbonlens_esg_data_v1', JSON.stringify(defaultMicrosoftESGData));
    } catch {}
    setRecords(initialEmissionRecords);
    setFactors(initialFactors);
    setAuditLogs(initialAuditLogs);
    setIsAuthenticated(true);
    setCurrentUser({
      name: 'ESG Director',
      email: 'sustainability@microsoft.com',
      role: 'Corporate Sustainability Officer',
    });
    setActiveTab('dashboard');
    showToast('Loaded verified demo workspace: Microsoft Corporation (MSFT)', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        reportingPeriod,
        setReportingPeriod,
        business,
        updateBusinessProfile,
        records,
        filteredRecords,
        addEmissionRecord,
        updateEmissionRecord,
        deleteEmissionRecord,
        batchImportRecords,
        factors,
        addEmissionFactor,
        updateEmissionFactor,
        auditLogs,
        notifications,
        markNotificationRead,
        teamMembers,
        addTeamMember,
        toasts,
        showToast,
        removeToast,

        isAddRecordModalOpen,
        setIsAddRecordModalOpen,
        isCSVImportModalOpen,
        setIsCSVImportModalOpen,
        isESGUploadModalOpen,
        setIsESGUploadModalOpen,
        selectedRecordForAudit,
        setSelectedRecordForAudit,
        authModal,
        openAuthModal,
        closeAuthModal,

        currentESGData,
        setCurrentESGData,
        applyESGData,
        downloadESGStatusPDF,

        isAuthenticated,
        currentUser,
        login,
        signup,
        logout,
        completeOnboarding,
        resetToDemo,

        metrics,
        monthlyTrendData,
        scopeBreakdown,
        hotspotsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
