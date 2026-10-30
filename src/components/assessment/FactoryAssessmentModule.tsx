import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Cpu, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  RotateCcw, 
  Search, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
  Calendar,
  Zap,
  Check
} from 'lucide-react';
import { FactoryProfile, MachineRecord, MachineCriticality, CriticalityLevel } from '../../types';
import { MachineModal } from './MachineModal';
import { formatINR } from '../../data/mockFactoryData';

interface FactoryAssessmentModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updatedFactory: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export const FactoryAssessmentModule: React.FC<FactoryAssessmentModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  // Form State: 1. Factory Information
  const [factoryName, setFactoryName] = useState(factory.name);
  const [city, setCity] = useState(factory.city);
  const [state, setState] = useState(factory.state);
  const [sector, setSector] = useState(factory.sector);
  const [plantCode, setPlantCode] = useState(factory.plantCode);
  const [operatingHoursPerDay, setOperatingHoursPerDay] = useState<number>(factory.operatingHoursPerDay ?? 24);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState<number>(factory.workingDaysPerWeek ?? 6);
  const [productionShifts, setProductionShifts] = useState<number>(factory.productionShifts ?? 3);
  const [shiftsDescription, setShiftsDescription] = useState(
    factory.shiftsDescription || `${factory.productionShifts ?? 3} Shifts × 8 Hours (Continuous Rotation)`
  );

  // Form State: 2. Production Line Details
  const [lineName, setLineName] = useState(factory.lineName);
  const [lineId, setLineId] = useState(factory.lineId || `${factory.plantCode}-LN-01`);
  const [lineType, setLineType] = useState(factory.lineType);
  const [productionCapacity, setProductionCapacity] = useState(factory.productionCapacity || '1,800 units / day');
  const [monthlyProductionTarget, setMonthlyProductionTarget] = useState(factory.monthlyProductionTarget || '45,000 units / month');
  const [processDescription, setProcessDescription] = useState(
    factory.processDescription || 'Raw blank feeding, precision CNC turning, high-speed gear hobbing, sealed carburizing heat treatment, and precision shaving.'
  );

  // Form State: 3. Machine Inventory
  const [machines, setMachines] = useState<MachineRecord[]>(factory.machines);
  const [searchQuery, setSearchQuery] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState<'All' | MachineCriticality>('All');
  const [machineModalOpen, setMachineModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<MachineRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State: 4. Downtime Economics
  const [monthlyDowntimeHours, setMonthlyDowntimeHours] = useState<number>(factory.metrics.monthlyDowntimeHours);
  const [hourlyDowntimeCostINR, setHourlyDowntimeCostINR] = useState<number>(factory.metrics.hourlyDowntimeCostINR);

  // Meta & UI States
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'factory' | 'line' | 'inventory' | 'economics'>('all');

  // Keep local state in sync when the parent factory changes (e.g., demo factory switched)
  useEffect(() => {
    setFactoryName(factory.name);
    setCity(factory.city);
    setState(factory.state);
    setSector(factory.sector);
    setPlantCode(factory.plantCode);
    setOperatingHoursPerDay(factory.operatingHoursPerDay ?? 24);
    setWorkingDaysPerWeek(factory.workingDaysPerWeek ?? 6);
    setProductionShifts(factory.productionShifts ?? 3);
    setShiftsDescription(factory.shiftsDescription || `${factory.productionShifts ?? 3} Shifts × 8 Hours`);

    setLineName(factory.lineName);
    setLineId(factory.lineId || `${factory.plantCode}-LN-01`);
    setLineType(factory.lineType);
    setProductionCapacity(factory.productionCapacity || '1,800 units / day');
    setMonthlyProductionTarget(factory.monthlyProductionTarget || '45,000 units / month');
    setProcessDescription(factory.processDescription || '');

    setMachines(factory.machines);
    setMonthlyDowntimeHours(factory.metrics.monthlyDowntimeHours);
    setHourlyDowntimeCostINR(factory.metrics.hourlyDowntimeCostINR);
    setIsDirty(false);
  }, [factory.id]);

  // Derived Downtime Calculations
  const estimatedMonthlyLoss = monthlyDowntimeHours * hourlyDowntimeCostINR;
  const annualDowntimeCost = estimatedMonthlyLoss * 12;
  const costPerMinuteINR = hourlyDowntimeCostINR / 60;
  const annualLostProductionHours = monthlyDowntimeHours * 12;

  // Completion Progress Calculation
  const calculateProgress = () => {
    let score = 0;
    const checks = [
      Boolean(factoryName.trim()),
      Boolean(city.trim() && state.trim()),
      Boolean(sector.trim()),
      Boolean(plantCode.trim()),
      operatingHoursPerDay > 0 && workingDaysPerWeek > 0,
      Boolean(lineName.trim() && lineId.trim()),
      Boolean(productionCapacity.trim()),
      Boolean(processDescription.trim()),
      Boolean(monthlyProductionTarget.trim()),
      machines.length >= 3,
      machines.some(m => (m.machineCriticality === 'Critical' || m.criticality === 'High')),
      monthlyDowntimeHours > 0,
      hourlyDowntimeCostINR > 0,
    ];
    score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return Math.min(100, score);
  };

  const progressPct = calculateProgress();

  // Machine counts by criticality
  const criticalCount = machines.filter(m => (m.machineCriticality === 'Critical' || m.criticality === 'High')).length;
  const importantCount = machines.filter(m => (m.machineCriticality === 'Important' || m.criticality === 'Medium')).length;
  const standardCount = machines.filter(m => (m.machineCriticality === 'Standard' || m.criticality === 'Low')).length;

  // Filtered Machines
  const filteredMachines = machines.filter((m) => {
    const crit = m.machineCriticality || (m.criticality === 'High' ? 'Critical' : m.criticality === 'Medium' ? 'Important' : 'Standard');
    const matchesFilter = criticalityFilter === 'All' || crit === criticalityFilter;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.manufacturer && m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Machine CRUD Handlers
  const handleSaveMachine = (savedMachine: MachineRecord) => {
    if (editingMachine) {
      setMachines(machines.map(m => m.id === savedMachine.id ? savedMachine : m));
    } else {
      setMachines([savedMachine, ...machines]);
    }
    setIsDirty(true);
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
    setDeleteConfirmId(null);
    setIsDirty(true);
  };

  const handleAddMultipleDemoMachines = () => {
    const nextIdx = machines.length + 1;
    const sampleBatch: MachineRecord[] = [
      {
        id: `m-batch-${Date.now()}-1`,
        tag: `STN-${nextIdx < 10 ? '0' + nextIdx : nextIdx}`,
        name: 'Liebherr Precision Tooth Profile Grinder',
        type: 'Continuous Generating Gear Grinder',
        manufacturer: 'Liebherr Verzahntechnik Germany',
        installationYear: 2022,
        ratedPowerKw: 42,
        criticality: 'High',
        machineCriticality: 'Critical',
        operatingHours: 9200,
        status: 'Normal',
        vibrationMmS: 1.6,
        tempC: 38.2,
        currentA: 28.0,
        monitoringLevel: 'Condition Monitored',
        failureRiskCategory: 'Bearing Spalling',
        historicalDowntimeHrs: 4.5,
      },
      {
        id: `m-batch-${Date.now()}-2`,
        tag: `STN-${nextIdx + 1 < 10 ? '0' + (nextIdx + 1) : nextIdx + 1}`,
        name: 'Guhring Automated Carbide Tool Presetter',
        type: 'Optical Tool Measurement & Balancing',
        manufacturer: 'Guhring India Pvt Ltd',
        installationYear: 2023,
        ratedPowerKw: 8,
        criticality: 'Low',
        machineCriticality: 'Standard',
        operatingHours: 3400,
        status: 'Normal',
        vibrationMmS: 0.9,
        tempC: 28.0,
        currentA: 9.5,
        monitoringLevel: 'Basic SCADA',
        failureRiskCategory: 'Motor Misalignment',
        historicalDowntimeHrs: 1.2,
      },
    ];
    setMachines([...sampleBatch, ...machines]);
    setIsDirty(true);
  };

  // Validation & Save Assessment
  const handleSaveAssessment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: string[] = [];

    if (!factoryName.trim()) errors.push('Factory Name cannot be blank');
    if (!city.trim() || !state.trim()) errors.push('Location (City and State) is required');
    if (!plantCode.trim()) errors.push('Plant Code is required');
    if (!lineName.trim()) errors.push('Production Line Name is required');
    if (machines.length === 0) errors.push('At least one machine must be in the line inventory');
    if (monthlyDowntimeHours <= 0) errors.push('Average monthly downtime hours must be greater than 0');
    if (hourlyDowntimeCostINR <= 0) errors.push('Cost of downtime per hour in INR must be greater than 0');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    // Recalculate metrics that feed into Overview and ROI calculator
    const totalCount = machines.length;
    const criticalMachinesCount = machines.filter(m => (m.machineCriticality === 'Critical' || m.criticality === 'High')).length;
    const monitoredCount = machines.filter(m => m.monitoringLevel !== 'None').length;
    const coveragePct = Math.round((monitoredCount / Math.max(1, totalCount)) * 100);

    const updatedProfile: FactoryProfile = {
      ...factory,
      name: factoryName.trim(),
      city: city.trim(),
      state: state.trim(),
      sector: sector.trim(),
      plantCode: plantCode.trim().toUpperCase(),
      operatingHoursPerDay,
      workingDaysPerWeek,
      productionShifts,
      shiftsDescription,
      lineName: lineName.trim(),
      lineId: lineId.trim(),
      lineType: lineType,
      productionCapacity,
      processDescription,
      monthlyProductionTarget,
      assessmentSavedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST Today',
      machines: machines,
      metrics: {
        ...factory.metrics,
        totalMachines: totalCount,
        criticalMachines: criticalMachinesCount,
        monthlyDowntimeHours: monthlyDowntimeHours,
        hourlyDowntimeCostINR: hourlyDowntimeCostINR,
        estimatedMonthlyDowntimeCostINR: estimatedMonthlyLoss,
        annualDowntimeCostINR: annualDowntimeCost,
        monitoringCoveragePct: coveragePct,
        potentialAnnualSavingsINR: Math.round(annualDowntimeCost * 0.55),
      },
    };

    onUpdateFactory(updatedProfile);
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleReset = () => {
    setFactoryName(factory.name);
    setCity(factory.city);
    setState(factory.state);
    setSector(factory.sector);
    setPlantCode(factory.plantCode);
    setOperatingHoursPerDay(factory.operatingHoursPerDay ?? 24);
    setWorkingDaysPerWeek(factory.workingDaysPerWeek ?? 6);
    setProductionShifts(factory.productionShifts ?? 3);
    setLineName(factory.lineName);
    setLineId(factory.lineId || `${factory.plantCode}-LN-01`);
    setLineType(factory.lineType);
    setProductionCapacity(factory.productionCapacity || '');
    setProcessDescription(factory.processDescription || '');
    setMonthlyProductionTarget(factory.monthlyProductionTarget || '');
    setMachines(factory.machines);
    setMonthlyDowntimeHours(factory.metrics.monthlyDowntimeHours);
    setHourlyDowntimeCostINR(factory.metrics.hourlyDowntimeCostINR);
    setIsDirty(false);
    setValidationErrors([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Module Title Bar & Progress Bar */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Building2 className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Factory & Line Assessment
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {plantCode}
              </span>
              {factory.assessmentSavedAt && (
                <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                  · Last saved: {factory.assessmentSavedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Complete operational baseline audit: facility parameters, production line targets, machine asset inventory, and downtime loss economics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Discard unsaved changes"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Discard Changes</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveAssessment()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Save Assessment</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('machine-health')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Machine Health Checklist</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Assessment Progress Meter */}
        <div className="mt-4 pt-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Assessment Completeness Progress</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                progressPct === 100 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800' 
                  : 'bg-blue-950/40 text-blue-400 border-blue-800'
              }`}>
                {progressPct}% Completed
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-3">
              <span className={factoryName && plantCode ? 'text-emerald-400' : 'text-slate-500'}>✓ Factory Info</span>
              <span>·</span>
              <span className={lineName && lineId ? 'text-emerald-400' : 'text-slate-500'}>✓ Line Details</span>
              <span>·</span>
              <span className={machines.length > 0 ? 'text-emerald-400' : 'text-slate-500'}>✓ {machines.length} Machines</span>
              <span>·</span>
              <span className={monthlyDowntimeHours > 0 ? 'text-emerald-400' : 'text-slate-500'}>✓ Downtime Economics</span>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-200">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              <span>Please resolve the following assessment validation errors:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Assessment saved successfully! Updated factory profile, line inventory, and financial downtime losses have synchronized with the dashboard.
            </span>
          </div>
        )}
      </div>

      {/* 1. Factory Information Section */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              1. Factory Information & Operating Schedule
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Plant ID: {plantCode}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Factory / Enterprise Name *
            </label>
            <input
              type="text"
              required
              value={factoryName}
              onChange={(e) => { setFactoryName(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Kalyani Precision Auto-Components Pvt. Ltd."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => { setCity(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Pune"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => { setState(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Maharashtra"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Industry Sector *
            </label>
            <input
              type="text"
              value={sector}
              onChange={(e) => { setSector(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Automotive Powertrain & Gears"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Plant Code (Internal Ref) *
            </label>
            <input
              type="text"
              value={plantCode}
              onChange={(e) => { setPlantCode(e.target.value.toUpperCase()); setIsDirty(true); }}
              placeholder="e.g. KPAC-PUN-03"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Operating Hours / Day
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={8}
                max={24}
                value={operatingHoursPerDay}
                onChange={(e) => { setOperatingHoursPerDay(Math.min(24, Math.max(1, parseInt(e.target.value) || 24))); setIsDirty(true); }}
                className="w-20 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-slate-400">hours/day</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Working Days / Week
            </label>
            <select
              value={workingDaysPerWeek}
              onChange={(e) => { setWorkingDaysPerWeek(parseInt(e.target.value)); setIsDirty(true); }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5 Days / Week</option>
              <option value={6}>6 Days / Week (Standard Indian SME)</option>
              <option value={7}>7 Days / Week (Continuous 24/7)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Production Shifts
            </label>
            <select
              value={productionShifts}
              onChange={(e) => { 
                const val = parseInt(e.target.value);
                setProductionShifts(val);
                setShiftsDescription(`${val} Shifts × ${Math.round(operatingHoursPerDay / val)} Hours`);
                setIsDirty(true); 
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1}>1 Shift (General Shift 8h)</option>
              <option value={2}>2 Shifts (Day & Night 16h)</option>
              <option value={3}>3 Shifts (Continuous 24h Rotation)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Shift Roster & Changeover Description
            </label>
            <input
              type="text"
              value={shiftsDescription}
              onChange={(e) => { setShiftsDescription(e.target.value); setIsDirty(true); }}
              placeholder="e.g. 3 Shifts x 8h (Morning 06:00, Evening 14:00, Night 22:00 with 30m changeover)"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Production Line Details Section */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              2. Production Line Details & Process Scope
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Line ID: {lineId}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Production Line Name *
            </label>
            <input
              type="text"
              required
              value={lineName}
              onChange={(e) => { setLineName(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Line 3: Transmission Gear Hobbing & Heat Treatment"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Line ID / Identifier *
            </label>
            <input
              type="text"
              value={lineId}
              onChange={(e) => { setLineId(e.target.value.toUpperCase()); setIsDirty(true); }}
              placeholder="e.g. KPAC-L3-GEAR"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Line Architecture Type
            </label>
            <select
              value={lineType}
              onChange={(e) => { setLineType(e.target.value as any); setIsDirty(true); }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Machining & CNC Cell">Machining & CNC Cell</option>
              <option value="Automated Assembly">Automated Assembly Line</option>
              <option value="High-Speed Packaging">High-Speed Packaging Line</option>
              <option value="Continuous Process">Continuous Process Line</option>
              <option value="Textile Spinning">Textile Ring Spinning</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Production Capacity *
            </label>
            <input
              type="text"
              value={productionCapacity}
              onChange={(e) => { setProductionCapacity(e.target.value); setIsDirty(true); }}
              placeholder="e.g. 1,800 gears / day (120 gears/hr nominal)"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monthly Production Target *
            </label>
            <input
              type="text"
              value={monthlyProductionTarget}
              onChange={(e) => { setMonthlyProductionTarget(e.target.value); setIsDirty(true); }}
              placeholder="e.g. 45,000 finished gear assemblies / month"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Production Process Description *
          </label>
          <textarea
            rows={2}
            value={processDescription}
            onChange={(e) => { setProcessDescription(e.target.value); setIsDirty(true); }}
            placeholder="Describe the step-by-step physical transformation from raw material to finished product..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>
      </div>

      {/* 3. Machine Inventory Section (Full CRUD) */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                3. Production Line Machine Inventory
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Total Assets: <strong className="text-white font-mono">{machines.length}</strong> · Critical Bottlenecks: <strong className="text-rose-400 font-mono">{criticalCount}</strong> · Important: <strong className="text-amber-400 font-mono">{importantCount}</strong> · Standard: <strong className="text-slate-300 font-mono">{standardCount}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddMultipleDemoMachines}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Add 2 sample production machines"
            >
              + Add Sample Assets
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingMachine(null);
                setMachineModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Machine</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tag, machine, manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
            {(['All', 'Critical', 'Important', 'Standard'] as const).map((crit) => (
              <button
                key={crit}
                type="button"
                onClick={() => setCriticalityFilter(crit)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  criticalityFilter === crit
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {crit}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-2.5 px-3">Asset Tag</th>
                <th className="py-2.5 px-3">Machine Name & Type</th>
                <th className="py-2.5 px-3">Manufacturer</th>
                <th className="py-2.5 px-3 text-center">Year</th>
                <th className="py-2.5 px-3 text-right">Rated kW</th>
                <th className="py-2.5 px-3">Criticality</th>
                <th className="py-2.5 px-3 text-right">Operating Hours</th>
                <th className="py-2.5 px-3">Monitoring Level</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No machines match the selected filter. Click "Add Machine" to log a new asset.
                  </td>
                </tr>
              ) : (
                filteredMachines.map((m) => {
                  const crit = m.machineCriticality || (m.criticality === 'High' ? 'Critical' : m.criticality === 'Medium' ? 'Important' : 'Standard');
                  const isCrit = crit === 'Critical';
                  const isImp = crit === 'Important';

                  return (
                    <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {m.tag}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{m.type}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {m.manufacturer || 'OEM Specified'}
                      </td>

                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {m.installationYear || 2021}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300 font-medium">
                        {m.ratedPowerKw || 30} <span className="text-[10px] text-slate-500">kW</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isCrit 
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : isImp
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {crit}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                        {m.operatingHours ? m.operatingHours.toLocaleString() : '8,500'} <span className="text-[10px] text-slate-500">hrs</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-300">
                          {m.monitoringLevel}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMachine(m);
                              setMachineModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                            title="Edit machine details"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          {deleteConfirmId === m.id ? (
                            <div className="flex items-center gap-1 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                              <span className="text-[10px] text-rose-300">Delete?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteMachine(m.id)}
                                className="text-[10px] text-rose-400 hover:underline font-bold"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-[10px] text-slate-400 hover:underline"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(m.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Delete machine from inventory"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Downtime Economics Section */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              4. Downtime Economics & Production Loss Modeling
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold">
            Annual Loss: {formatINR(annualDowntimeCost)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Average Monthly Unplanned Downtime (Hours) *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="300"
                  value={monthlyDowntimeHours}
                  onChange={(e) => { 
                    setMonthlyDowntimeHours(Math.max(0.5, parseFloat(e.target.value) || 0.5)); 
                    setIsDirty(true); 
                  }}
                  className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base font-mono font-bold text-white text-center focus:outline-none focus:border-blue-500"
                />
                <div className="text-xs text-slate-400">
                  Total cumulative hours line halted across shifts each month
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Cost of Downtime per Hour (₹ INR) *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  value={hourlyDowntimeCostINR}
                  onChange={(e) => { 
                    setHourlyDowntimeCostINR(Math.max(500, parseInt(e.target.value) || 500)); 
                    setIsDirty(true); 
                  }}
                  className="w-36 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base font-mono font-bold text-amber-400 text-center focus:outline-none focus:border-amber-500"
                />
                <div className="text-xs text-slate-400">
                  Value of lost parts + idle direct labor + line restart overhead
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Calculation KPI Panel */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-amber-950/20 border border-blue-700/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
                <span>Calculated Production Loss Burden</span>
                <span className="text-[11px] font-mono text-blue-400">Auto-Calculated</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Monthly Production Loss</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
                    {formatINR(estimatedMonthlyLoss)}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                    {monthlyDowntimeHours}h × {formatINR(hourlyDowntimeCostINR)}/h
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Annual Downtime Exposure</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-rose-400 tabular-nums">
                    {formatINR(annualDowntimeCost)}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                    12 Months @ current pace
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 mt-4 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Loss per Line Operating Minute:</span>
                <strong className="font-mono text-white">₹{Math.round(costPerMinuteINR).toLocaleString('en-IN')}/min</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Annual Lost Capacity:</span>
                <strong className="font-mono text-slate-200">{annualLostProductionHours} hours / year</strong>
              </div>
              <div className="flex items-center justify-between pt-1 text-emerald-400">
                <span>Target 55% PdM Downtime Reduction:</span>
                <strong className="font-mono">Save {formatINR(annualDowntimeCost * 0.55)}/year</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Bar if changes were made */}
      {isDirty && (
        <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-slate-900/95 border border-blue-500/50 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>You have unsaved changes in the Factory Assessment.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => handleSaveAssessment()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Machine Add / Edit Modal */}
      <MachineModal
        isOpen={machineModalOpen}
        onClose={() => {
          setMachineModalOpen(false);
          setEditingMachine(null);
        }}
        onSave={handleSaveMachine}
        editingMachine={editingMachine}
        existingTags={machines.map(m => m.tag)}
      />
    </div>
  );
};
