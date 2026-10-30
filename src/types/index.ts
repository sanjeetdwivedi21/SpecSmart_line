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

export type CriticalityLevel = 'High' | 'Medium' | 'Low';
export type MachineStatus = 'Normal' | 'Warning' | 'Critical';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type MaintenanceStyle = 'Run-to-failure' | 'Time-based' | 'Condition-based' | 'Predictive';

export interface MachineRecord {
  id: string;
  tag: string;
  name: string;
  type: string;
  criticality: CriticalityLevel;
  status: MachineStatus;
  vibrationMmS: number;
  tempC: number;
  currentA: number;
  monitoringLevel: 'None' | 'Basic SCADA' | 'Condition Monitored' | 'Predictive Ready';
  failureRiskCategory: 'Bearing Spalling' | 'Thermal Overload' | 'Gearbox Backlash' | 'Hydraulic Loss' | 'Motor Misalignment';
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

export interface FactoryProfile {
  id: string;
  name: string;
  plantCode: string;
  city: string;
  state: string;
  sector: string;
  lineName: string;
  lineType: 'Machining & CNC Cell' | 'Automated Assembly' | 'High-Speed Packaging' | 'Continuous Process' | 'Textile Spinning';
  targetGoLive: string;
  currentMaintenanceStyle: MaintenanceStyle;
  metrics: {
    totalMachines: number;
    criticalMachines: number;
    monthlyDowntimeHours: number;
    hourlyDowntimeCostINR: number;
    estimatedMonthlyDowntimeCostINR: number;
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
