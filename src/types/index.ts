export type NavigationTab = 
  | 'overview'
  | 'factory-assessment'
  | 'machine-health'
  | 'roi-calculator'
  | 'architecture-designer'
  | 'procurement-advisor'
  | 'specification-builder'
  | 'alert-standards'
  | 'projects'
  | 'settings';

export type CriticalityLevel = 'High' | 'Medium' | 'Low'; // High = Critical, Medium = Important, Low = Standard
export type MachineCriticality = 'Critical' | 'Important' | 'Standard';
export type MachineStatus = 'Normal' | 'Warning' | 'Critical';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type MaintenanceStyle = 'Run-to-failure' | 'Time-based' | 'Condition-based' | 'Predictive';

export interface MachineRecord {
  id: string;
  tag: string; // Machine ID / Tag
  name: string; // Machine Name
  type: string; // Machine Type
  manufacturer?: string; // Manufacturer e.g., Gleason, Siemens, Krones
  installationYear?: number; // e.g., 2021
  ratedPowerKw?: number; // Rated Power (kW)
  criticality: CriticalityLevel; // High = Critical, Medium = Important, Low = Standard
  machineCriticality?: MachineCriticality; // Explicit Phase 2 criticality
  operatingHours?: number; // Total cumulative or monthly machine operating hours
  status: MachineStatus;
  vibrationMmS: number;
  tempC: number;
  currentA: number;
  monitoringLevel: 'None' | 'Basic SCADA' | 'Condition Monitored' | 'Predictive Ready';
  failureRiskCategory: 'Bearing Spalling' | 'Thermal Overload' | 'Gearbox Backlash' | 'Hydraulic Loss' | 'Motor Misalignment' | string;
  historicalDowntimeHrs: number;
  lastAnomaly?: string;
}

export interface CriticalAlert {
  id: string;
  machineId: string;
  machineName: string;
  tag: string;
  parameter: string;
  severity: AlertSeverity;
  timestamp: string;
  value: string;
  threshold: string;
  message: string;
  acknowledged: boolean;
  affectedProductionLossINR: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'spec_updated' | 'roi_calculated' | 'sensor_added' | 'alert_logged' | 'audit_completed';
  user: string;
  timestamp: string;
  detail: string;
}

// Phase 3: Machine Health Checklist Types
export type ChecklistCategory = 'vibration' | 'temperature' | 'electrical' | 'operational' | 'connectivity';
export type ChecklistItemStatus = 'available' | 'missing' | 'na';

export interface ChecklistItemDef {
  id: string;
  category: ChecklistCategory;
  categoryTitle: string;
  label: string;
  description: string;
  defaultApplicable: (machine: MachineRecord) => boolean;
  defaultStatus: (machine: MachineRecord) => ChecklistItemStatus;
}

export interface ChecklistItemState {
  status: ChecklistItemStatus;
  naReason?: string;
  remarks?: string;
}

export interface MachineChecklistData {
  machineId: string;
  updatedAt: string;
  items: Record<string, ChecklistItemState>;
  generalRemarks?: string;
}

export type VisibilityCategory = 'Poor Visibility' | 'Partial Visibility' | 'Good Visibility' | 'Strong Visibility';

export interface MachineVisibilityScore {
  totalItems: number;
  applicableItems: number;
  availableItems: number;
  missingItems: number;
  naItems: number;
  scorePct: number;
  category: VisibilityCategory;
  isFullyAssessed: boolean;
  hasCriticalGaps: boolean;
}

export type RecommendationPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ChecklistRecommendation {
  id: string;
  machineId: string;
  machineTag: string;
  machineName: string;
  category: ChecklistCategory;
  title: string;
  priority: RecommendationPriority;
  whyExplanation: string;
  actionRequired: string;
}

export interface FactoryProfile {
  id: string;
  name: string;
  plantCode: string;
  city: string;
  state: string;
  sector: string;
  lineName: string;
  lineId?: string;
  lineType: 'Machining & CNC Cell' | 'Automated Assembly' | 'High-Speed Packaging' | 'Continuous Process' | 'Textile Spinning' | string;
  targetGoLive: string;
  currentMaintenanceStyle: MaintenanceStyle;

  // Phase 2: Factory Information & Operations
  operatingHoursPerDay?: number;
  workingDaysPerWeek?: number;
  productionShifts?: number;
  shiftsDescription?: string;

  // Phase 2: Production Line Details
  productionCapacity?: string;
  processDescription?: string;
  monthlyProductionTarget?: string;

  // Phase 2: Assessment Progress
  assessmentSavedAt?: string;

  // Phase 3: Checklists Map (machineId -> MachineChecklistData)
  checklists?: Record<string, MachineChecklistData>;
  checklistSavedAt?: string;

  metrics: {
    totalMachines: number;
    criticalMachines: number;
    monthlyDowntimeHours: number;
    hourlyDowntimeCostINR: number;
    estimatedMonthlyDowntimeCostINR: number;
    annualDowntimeCostINR?: number;
    monitoringCoveragePct: number;
    pcmReadinessScore: number;
    pcmReadinessGrade: 'Foundational' | 'Emerging' | 'Operational' | 'Predictive Leader';
    potentialAnnualSavingsINR: number;
    estimatedPaybackMonths: number;
  };
  machines: MachineRecord[];
  downtimeTrends: Array<{
    month: string;
    actualHours: number;
    targetHours: number;
    lossINR_Lakhs: number;
  }>;
  riskDistribution: Array<{
    category: string;
    riskScore: number;
    machineCount: number;
    criticalCount: number;
  }>;
  alerts: CriticalAlert[];
  recentActivities: ActivityItem[];
}
