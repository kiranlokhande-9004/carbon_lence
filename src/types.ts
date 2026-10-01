export type ScopeType = 'Scope 1' | 'Scope 2' | 'Scope 3';

export type DataQuality = 'High' | 'Medium' | 'Low';

export type RecordStatus = 'Verified' | 'Estimated' | 'Pending Review';

export interface EmissionRecord {
  id: string;
  businessId: string;
  date: string; // YYYY-MM-DD
  scope: ScopeType;
  category: string;
  activityName: string;
  quantity: number;
  unit: string;
  factorId: string;
  factorName: string;
  factorValue: number; // in kgCO2e per unit
  factorUnit: string;
  factorSource: string;
  factorYear: number;
  factorVersion: string;
  co2eKg: number;
  co2eTonne: number;
  dataQuality: DataQuality;
  source: string; // e.g. "Utility bill", "Fuel receipt", "Fleet telematics"
  notes?: string;
  status: RecordStatus;
  location?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  scope: ScopeType;
  region: string;
  unit: string;
  value: number; // kgCO2e per unit
  source: string;
  year: number;
  version: string;
  isDemo: boolean;
  notes?: string;
  uncertainty?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  employees: number;
  country: string;
  city: string;
  reportingYear: number;
  baselineYear: number;
  targetReductionPct: number;
  targetYear: number;
  currency: string;
  carbonGoal: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Factor Changed' | 'Report Generated' | 'CSV Imported' | 'ESG Data Ingested' | 'Recalculation';
  record: string;
  fieldChanged: string;
  prevValue?: string;
  newValue: string;
  category: string;
  source: string;
  calculationMethod: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  scope: string;
  category: string;
  impact: 'High' | 'Medium' | 'Potentially meaningful';
  effort: 'Low' | 'Medium' | 'High';
  priority: 'High' | 'Medium' | 'Quick Win';
  timeframe: string;
  description: string;
  suggestedActions?: string[];
  estimatedPayback?: string;
  status?: string;
  potentialReduction?: string;
  paybackPeriod?: string;
  estimatedCost?: string;
  steps?: string[];
}

export type UserRole = 'Admin' | 'Member' | 'Viewer' | 'Auditor' | 'Contributor';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'Active' | 'Invited';
  addedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  desc?: string;
  time: string;
  type: 'info' | 'success' | 'alert';
  read: boolean;
  linkTab?: string;
}

export interface ScopeCategorySummary {
  category: string;
  scope: ScopeType;
  totalTonne: number;
  recordCount: number;
  percentage: number;
  dataQualityScore: number;
  completenessPct: number;
}
