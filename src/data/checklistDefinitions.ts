import { 
  ChecklistItemDef, 
  MachineRecord, 
  MachineChecklistData, 
  MachineVisibilityScore, 
  ChecklistRecommendation, 
  VisibilityCategory 
} from '../types';

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  // A. Vibration Monitoring
  {
    id: 'vibe_required',
    category: 'vibration',
    categoryTitle: 'A. Vibration Monitoring',
    label: 'Is vibration monitoring required for this asset?',
    description: 'Critical rotating components, high-speed spindles, or reciprocating drive elements.',
    defaultApplicable: (m) => !m.type.toLowerCase().includes('furnace') && !m.type.toLowerCase().includes('degreasing'),
    defaultStatus: (m) => {
      if (m.type.toLowerCase().includes('furnace') || m.type.toLowerCase().includes('degreasing')) return 'na';
      return 'available';
    },
  },
  {
    id: 'vibe_sensor_installed',
    category: 'vibration',
    categoryTitle: 'A. Vibration Monitoring',
    label: 'Vibration sensor physically installed?',
    description: 'IEPE/piezoelectric accelerometer or velocity transducer mounted on bearing housing.',
    defaultApplicable: (m) => !m.type.toLowerCase().includes('furnace'),
    defaultStatus: (m) => {
      if (m.type.toLowerCase().includes('furnace')) return 'na';
      if (m.monitoringLevel === 'None') return 'missing';
      return m.monitoringLevel === 'Basic SCADA' ? 'missing' : 'available';
    },
  },
  {
    id: 'vibe_rms_available',
    category: 'vibration',
    categoryTitle: 'A. Vibration Monitoring',
    label: 'RMS vibration measurement available?',
    description: 'Continuous velocity/acceleration RMS calculated and accessible in ISO 10816 format.',
    defaultApplicable: (m) => !m.type.toLowerCase().includes('furnace'),
    defaultStatus: (m) => {
      if (m.type.toLowerCase().includes('furnace')) return 'na';
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'vibe_bearing_condition',
    category: 'vibration',
    categoryTitle: 'A. Vibration Monitoring',
    label: 'Bearing condition monitoring available?',
    description: 'High-frequency demodulation, crest factor, or peak-to-peak shock pulse detection.',
    defaultApplicable: (m) => !m.type.toLowerCase().includes('furnace'),
    defaultStatus: (m) => {
      if (m.type.toLowerCase().includes('furnace')) return 'na';
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },
  {
    id: 'vibe_gearbox_required',
    category: 'vibration',
    categoryTitle: 'A. Vibration Monitoring',
    label: 'Gearbox vibration monitoring required where applicable?',
    description: 'Tooth meshing frequencies and backlash harmonics monitoring on reduction gearboxes.',
    defaultApplicable: (m) => m.type.toLowerCase().includes('gear') || m.type.toLowerCase().includes('hob') || m.type.toLowerCase().includes('press') || m.type.toLowerCase().includes('filler'),
    defaultStatus: (m) => {
      const hasGearbox = m.type.toLowerCase().includes('gear') || m.type.toLowerCase().includes('hob') || m.type.toLowerCase().includes('press') || m.type.toLowerCase().includes('filler');
      if (!hasGearbox) return 'na';
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },

  // B. Temperature Monitoring
  {
    id: 'temp_bearing',
    category: 'temperature',
    categoryTitle: 'B. Temperature Monitoring',
    label: 'Bearing temperature monitoring',
    description: 'Embedded PT100 RTD or contact thermocouple mounted on main bearing housings.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'temp_motor',
    category: 'temperature',
    categoryTitle: 'B. Temperature Monitoring',
    label: 'Motor stator / frame temperature monitoring',
    description: 'PTC thermistors or surface sensors detecting motor winding overheating.',
    defaultApplicable: (m) => m.ratedPowerKw ? m.ratedPowerKw >= 10 : true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'temp_gearbox',
    category: 'temperature',
    categoryTitle: 'B. Temperature Monitoring',
    label: 'Gearbox oil / sump temperature monitoring',
    description: 'Continuous lube oil sump immersion probe monitoring friction heat dissipation.',
    defaultApplicable: (m) => m.type.toLowerCase().includes('gear') || m.type.toLowerCase().includes('hob') || m.type.toLowerCase().includes('press') || m.type.toLowerCase().includes('compressor'),
    defaultStatus: (m) => {
      const hasGear = m.type.toLowerCase().includes('gear') || m.type.toLowerCase().includes('hob') || m.type.toLowerCase().includes('press') || m.type.toLowerCase().includes('compressor');
      if (!hasGear) return 'na';
      return m.monitoringLevel === 'Condition Monitored' ? 'available' : 'missing';
    },
  },
  {
    id: 'temp_thermal_anomaly',
    category: 'temperature',
    categoryTitle: 'B. Temperature Monitoring',
    label: 'Thermal anomaly detection availability',
    description: 'Rate-of-rise alarms and delta-T comparison against ambient baseline temperature.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },

  // C. Electrical Monitoring
  {
    id: 'elec_motor_current',
    category: 'electrical',
    categoryTitle: 'C. Electrical Monitoring',
    label: 'Motor phase current monitoring',
    description: 'True RMS phase current telemetry via current transformers (CTs) or VFD bus.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel !== 'None' ? 'available' : 'missing';
    },
  },
  {
    id: 'elec_voltage',
    category: 'electrical',
    categoryTitle: 'C. Electrical Monitoring',
    label: 'Supply voltage monitoring',
    description: 'Line-to-line 3-phase supply voltage detection for unbalance and sags.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Basic SCADA' || m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'elec_power_consumption',
    category: 'electrical',
    categoryTitle: 'C. Electrical Monitoring',
    label: 'Power consumption (kW/kWh) monitoring',
    description: 'Real-time active load calculation and energy consumption indexing per workpiece.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },
  {
    id: 'elec_anomaly_visibility',
    category: 'electrical',
    categoryTitle: 'C. Electrical Monitoring',
    label: 'Electrical anomaly visibility (overload/unbalance)',
    description: 'Automated warnings for phase unbalance (>5%), torque ripple, and drive fault codes.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },

  // D. Operational Monitoring
  {
    id: 'ops_run_stop_status',
    category: 'operational',
    categoryTitle: 'D. Operational Monitoring',
    label: 'Machine running / stopped status',
    description: 'Real-time digital execution signal from PLC or auxiliary motor contactor.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel !== 'None' ? 'available' : 'missing';
    },
  },
  {
    id: 'ops_operating_hours',
    category: 'operational',
    categoryTitle: 'D. Operational Monitoring',
    label: 'Cumulative operating hours tracking',
    description: 'Running hours accumulator for scheduling PM lubrication and seal replacement.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel !== 'None' ? 'available' : 'missing';
    },
  },
  {
    id: 'ops_cycle_monitoring',
    category: 'operational',
    categoryTitle: 'D. Operational Monitoring',
    label: 'Production cycle & micro-stop monitoring',
    description: 'Stroke cadence or part cycle time tracking with micro-stop anomaly capture.',
    defaultApplicable: (m) => !m.type.toLowerCase().includes('compressor'),
    defaultStatus: (m) => {
      if (m.type.toLowerCase().includes('compressor')) return 'na';
      return (m.monitoringLevel === 'Basic SCADA' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'ops_fault_downtime_logging',
    category: 'operational',
    categoryTitle: 'D. Operational Monitoring',
    label: 'Machine fault and downtime event logging',
    description: 'Automated timestamped logging of emergency stops, interlocks, and breakdown events.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel !== 'None' ? 'available' : 'missing';
    },
  },

  // E. Connectivity and Data Visibility
  {
    id: 'conn_sensor_connectivity',
    category: 'connectivity',
    categoryTitle: 'E. Connectivity & Data Visibility',
    label: 'Sensor field connectivity available',
    description: 'IO-Link master, hardwired 4-20mA, or industrial fieldbus linking sensors.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'conn_edge_gateway',
    category: 'connectivity',
    categoryTitle: 'E. Connectivity & Data Visibility',
    label: 'Data acquisition gateway available',
    description: 'Edge computer or IPC polling PLC/sensors with local storage buffer.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },
  {
    id: 'conn_dashboard_connected',
    category: 'connectivity',
    categoryTitle: 'E. Connectivity & Data Visibility',
    label: 'Monitoring dashboard connected',
    description: 'Live HMI / SCADA or browser-based dashboard visualizing real-time health telemetry.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Basic SCADA' || m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
  {
    id: 'conn_historical_data',
    category: 'connectivity',
    categoryTitle: 'E. Connectivity & Data Visibility',
    label: 'Historical data buffering & storage available',
    description: 'Time-series historian retaining continuous trend data for >=30 days.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return m.monitoringLevel === 'Predictive Ready' ? 'available' : 'missing';
    },
  },
  {
    id: 'conn_alert_notification',
    category: 'connectivity',
    categoryTitle: 'E. Connectivity & Data Visibility',
    label: 'Automated alert notification configured',
    description: 'Real-time SMS, WhatsApp, email, or webhook notifications on threshold breaches.',
    defaultApplicable: (m) => true,
    defaultStatus: (m) => {
      return (m.monitoringLevel === 'Condition Monitored' || m.monitoringLevel === 'Predictive Ready') ? 'available' : 'missing';
    },
  },
];

// Initialize default checklist state for a machine if not already created
export function initializeMachineChecklist(machine: MachineRecord): MachineChecklistData {
  const items: Record<string, { status: any; naReason?: string; remarks?: string }> = {};

  CHECKLIST_ITEMS.forEach((def) => {
    const isApp = def.defaultApplicable(machine);
    const status = def.defaultStatus(machine);
    
    let naReason: string | undefined = undefined;
    if (status === 'na') {
      if (machine.type.toLowerCase().includes('furnace')) {
        naReason = 'Non-rotating thermal atmosphere furnace - no mechanical drive train';
      } else if (machine.type.toLowerCase().includes('degreasing')) {
        naReason = 'Static ultrasonic washing tank - no heavy rotating transmission';
      } else if (machine.type.toLowerCase().includes('compressor')) {
        naReason = 'Continuous pressure utility asset - discrete cycle timing not applicable';
      } else {
        naReason = 'Asset design operates without reduction gearbox';
      }
    }

    items[def.id] = {
      status,
      naReason,
      remarks: '',
    };
  });

  return {
    machineId: machine.id,
    updatedAt: new Date().toISOString(),
    items,
    generalRemarks: `Baseline condition monitoring checklist generated for ${machine.name} (${machine.tag}).`,
  };
}

// Calculate Visibility Score for an individual machine
export function calculateMachineVisibilityScore(
  machine: MachineRecord,
  checklist?: MachineChecklistData
): MachineVisibilityScore {
  if (!checklist || !checklist.items) {
    // Fallback baseline
    return {
      totalItems: CHECKLIST_ITEMS.length,
      applicableItems: CHECKLIST_ITEMS.length,
      availableItems: 0,
      missingItems: CHECKLIST_ITEMS.length,
      naItems: 0,
      scorePct: 0,
      category: 'Poor Visibility',
      isFullyAssessed: false,
      hasCriticalGaps: machine.criticality === 'High' || machine.machineCriticality === 'Critical',
    };
  }

  let totalItems = 0;
  let applicableItems = 0;
  let availableItems = 0;
  let missingItems = 0;
  let naItems = 0;

  CHECKLIST_ITEMS.forEach((def) => {
    totalItems++;
    const state = checklist.items[def.id];
    const status = state ? state.status : 'missing';

    if (status === 'na') {
      naItems++;
    } else {
      applicableItems++;
      if (status === 'available') {
        availableItems++;
      } else {
        missingItems++;
      }
    }
  });

  const scorePct = applicableItems > 0 
    ? Math.round((availableItems / applicableItems) * 100) 
    : 100;

  let category: VisibilityCategory = 'Poor Visibility';
  if (scorePct >= 90) category = 'Strong Visibility';
  else if (scorePct >= 70) category = 'Good Visibility';
  else if (scorePct >= 40) category = 'Partial Visibility';
  else category = 'Poor Visibility';

  const isCritical = machine.criticality === 'High' || machine.machineCriticality === 'Critical';
  const hasCriticalGaps = isCritical && scorePct < 70;

  return {
    totalItems,
    applicableItems,
    availableItems,
    missingItems,
    naItems,
    scorePct,
    category,
    isFullyAssessed: applicableItems > 0,
    hasCriticalGaps,
  };
}

// Calculate summary across all machines in the factory
export interface FactoryChecklistSummary {
  totalMachines: number;
  assessedMachinesCount: number;
  criticalMachinesCount: number;
  criticalWithGapsCount: number;
  averageVisibilityPct: number;
  overallCategory: VisibilityCategory;
  totalMissingParameters: number;
  totalAvailableParameters: number;
  totalApplicableParameters: number;
  strongCount: number;
  goodCount: number;
  partialCount: number;
  poorCount: number;
}

export function calculateFactoryChecklistSummary(
  machines: MachineRecord[],
  checklistsMap?: Record<string, MachineChecklistData>
): FactoryChecklistSummary {
  if (!machines || machines.length === 0) {
    return {
      totalMachines: 0,
      assessedMachinesCount: 0,
      criticalMachinesCount: 0,
      criticalWithGapsCount: 0,
      averageVisibilityPct: 0,
      overallCategory: 'Poor Visibility',
      totalMissingParameters: 0,
      totalAvailableParameters: 0,
      totalApplicableParameters: 0,
      strongCount: 0,
      goodCount: 0,
      partialCount: 0,
      poorCount: 0,
    };
  }

  let totalScoreSum = 0;
  let criticalWithGapsCount = 0;
  let totalMissing = 0;
  let totalAvailable = 0;
  let totalApplicable = 0;
  let strongCount = 0;
  let goodCount = 0;
  let partialCount = 0;
  let poorCount = 0;

  machines.forEach((m) => {
    const chk = checklistsMap ? checklistsMap[m.id] : undefined;
    const score = calculateMachineVisibilityScore(m, chk);

    totalScoreSum += score.scorePct;
    totalMissing += score.missingItems;
    totalAvailable += score.availableItems;
    totalApplicable += score.applicableItems;

    if (score.hasCriticalGaps) {
      criticalWithGapsCount++;
    }

    if (score.category === 'Strong Visibility') strongCount++;
    else if (score.category === 'Good Visibility') goodCount++;
    else if (score.category === 'Partial Visibility') partialCount++;
    else poorCount++;
  });

  const avgPct = Math.round(totalScoreSum / machines.length);

  let overallCategory: VisibilityCategory = 'Poor Visibility';
  if (avgPct >= 90) overallCategory = 'Strong Visibility';
  else if (avgPct >= 70) overallCategory = 'Good Visibility';
  else if (avgPct >= 40) overallCategory = 'Partial Visibility';
  else overallCategory = 'Poor Visibility';

  const criticalMachinesCount = machines.filter(
    (m) => m.criticality === 'High' || m.machineCriticality === 'Critical'
  ).length;

  return {
    totalMachines: machines.length,
    assessedMachinesCount: machines.length,
    criticalMachinesCount,
    criticalWithGapsCount,
    averageVisibilityPct: avgPct,
    overallCategory,
    totalMissingParameters: totalMissing,
    totalAvailableParameters: totalAvailable,
    totalApplicableParameters: totalApplicable,
    strongCount,
    goodCount,
    partialCount,
    poorCount,
  };
}

// Generate rule-based recommendations for a machine
export function generateMachineRecommendations(
  machine: MachineRecord,
  checklist?: MachineChecklistData
): ChecklistRecommendation[] {
  const recommendations: ChecklistRecommendation[] = [];
  if (!checklist || !checklist.items) return recommendations;

  const items = checklist.items;
  const isCritical = machine.criticality === 'High' || machine.machineCriticality === 'Critical';
  const isImportant = machine.criticality === 'Medium' || machine.machineCriticality === 'Important';

  // Rule 1: Critical Rotating Equipment Missing Vibration Sensor
  if (items['vibe_sensor_installed']?.status === 'missing' && items['vibe_required']?.status !== 'na') {
    recommendations.push({
      id: `rec-vib-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'vibration',
      title: 'Mandate Triaxial Vibration Sensor on Spindle / Drive Bearing',
      priority: isCritical ? 'Critical' : isImportant ? 'High' : 'Medium',
      whyExplanation: `${machine.name} (${machine.tag}) is a ${isCritical ? 'critical bottleneck' : 'high-duty'} asset with no vibration sensor mounted. Bearing deterioration and unbalance will go undetected until catastrophic seizure occurs.`,
      actionRequired: 'Include 100 mV/g IEPE accelerometer with IO-Link hub in machine tender specification.',
    });
  }

  // Rule 2: Missing Bearing Demodulation / Spectrum Analysis on Critical Machines
  if (items['vibe_bearing_condition']?.status === 'missing' && items['vibe_sensor_installed']?.status !== 'na') {
    recommendations.push({
      id: `rec-fft-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'vibration',
      title: 'Enable High-Frequency Bearing Demodulation & FFT Analytics',
      priority: isCritical ? 'High' : 'Medium',
      whyExplanation: `Overall RMS vibration misses early microscopic micro-cracks in inner and outer bearing races. Spectral demodulation provides 4 to 8 weeks advance warning prior to functional breakdown.`,
      actionRequired: 'Configure edge gateway sampling at 10 kHz minimum for automated FFT peak trending.',
    });
  }

  // Rule 3: Missing Motor Current & Electrical Monitoring on Heavy Motor Drives
  if (items['elec_motor_current']?.status === 'missing' && (machine.ratedPowerKw || 0) >= 15) {
    recommendations.push({
      id: `rec-elec-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'electrical',
      title: 'Install Split-Core Current Transformers (CTs) for Motor Load Telemetry',
      priority: isCritical ? 'High' : 'Medium',
      whyExplanation: `${machine.name} has a heavy ${machine.ratedPowerKw} kW motor. Without current telemetry, tool wear, mechanical jam, and stator thermal overload cannot be detected.`,
      actionRequired: 'Specify 3-phase current transducer linked to PLC analog input or power meter gateway.',
    });
  }

  // Rule 4: Missing Temperature Monitoring on Heat-Generating or Critical Transmission Assets
  if (items['temp_bearing']?.status === 'missing') {
    recommendations.push({
      id: `rec-temp-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'temperature',
      title: 'Add Contact Bearing Temperature Monitoring (PT100 RTD)',
      priority: isCritical ? 'High' : 'Medium',
      whyExplanation: `Excessive lubrication degradation and misalignment invariably cause elevated bearing frictional heating. Temperature monitoring provides early confirmation of bearing distress.`,
      actionRequired: 'Retrofit PT100 resistance temperature probe to bearing housing casing.',
    });
  }

  // Rule 5: Missing Edge Gateway / Local Data Buffering
  if (items['conn_edge_gateway']?.status === 'missing' && items['conn_sensor_connectivity']?.status === 'available') {
    recommendations.push({
      id: `rec-gw-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'connectivity',
      title: 'Deploy Industrial Edge Gateway with Store-and-Forward Buffering',
      priority: isCritical ? 'Critical' : 'Medium',
      whyExplanation: `Sensors are available on ${machine.tag}, but lack a dedicated edge buffer. Factory network dropouts will lead to data holes and unreliable predictive maintenance alerts.`,
      actionRequired: 'Mandate edge computing gateway with 72-hour non-volatile buffer in vendor BOM.',
    });
  }

  // Rule 6: Missing Real-Time Alert Notification
  if (items['conn_alert_notification']?.status === 'missing' && items['conn_dashboard_connected']?.status === 'available') {
    recommendations.push({
      id: `rec-alt-${machine.id}`,
      machineId: machine.id,
      machineTag: machine.tag,
      machineName: machine.name,
      category: 'connectivity',
      title: 'Configure Real-Time Push Notification & Escalation SLA',
      priority: 'Medium',
      whyExplanation: `Operator must not rely on actively looking at a screen. Critical ISO 10816 threshold breaches must trigger SMS, WhatsApp, or plant horn alerts within 60 seconds.`,
      actionRequired: 'Set up webhook / SMS dispatch rule in alert management standards.',
    });
  }

  return recommendations;
}
