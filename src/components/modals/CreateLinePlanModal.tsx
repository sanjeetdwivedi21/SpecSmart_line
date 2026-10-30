import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Factory, 
  Check, 
  Calculator, 
  Clock, 
  IndianRupee, 
  Calendar, 
  Layers, 
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { FactoryProfile, MaintenanceStyle } from '../../types';
import { formatINR } from '../../data/mockFactoryData';

interface CreateLinePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (newFactory: FactoryProfile) => void;
}

export const CreateLinePlanModal: React.FC<CreateLinePlanModalProps> = ({
  isOpen,
  onClose,
  onCreatePlan,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [factoryName, setFactoryName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [sector, setSector] = useState('Automotive Powertrain & Gears');
  const [lineName, setLineName] = useState('');
  const [lineType, setLineType] = useState<FactoryProfile['lineType']>('Machining & CNC Cell');

  const [totalMachines, setTotalMachines] = useState<number>(24);
  const [criticalMachines, setCriticalMachines] = useState<number>(8);
  const [monthlyDowntimeHours, setMonthlyDowntimeHours] = useState<number>(42);
  const [hourlyDowntimeCostINR, setHourlyDowntimeCostINR] = useState<number>(35000);

  const [targetGoLive, setTargetGoLive] = useState('Q2 2027');
  const [currentMaintenanceStyle, setCurrentMaintenanceStyle] = useState<MaintenanceStyle>('Time-based');
  const [targetDowntimeReductionPct, setTargetDowntimeReductionPct] = useState<number>(55);

  if (!isOpen) return null;

  // Real-time calculations
  const monthlyCost = monthlyDowntimeHours * hourlyDowntimeCostINR;
  const annualCost = monthlyCost * 12;
  const estimatedSavings = annualCost * (targetDowntimeReductionPct / 100);
  const estimatedCapex = criticalMachines * 180000; // ~₹1.8L per critical station for IoT sensors + Edge gateway
  const paybackMonths = Math.max(2, parseFloat(((estimatedCapex / (estimatedSavings / 12))).toFixed(1)));

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    const newProfile: FactoryProfile = {
      id: `factory-custom-${Date.now()}`,
      name: factoryName.trim() || 'Omkar Auto Forge & Gears Pvt. Ltd.',
      plantCode: `PLANT-${(city || 'IND').substring(0, 3).toUpperCase()}-01`,
      city: city.trim() || 'Pune',
      state: state.trim() || 'Maharashtra',
      sector: sector,
      lineName: lineName.trim() || 'New High-Torque Gear Line',
      lineType: lineType,
      targetGoLive: targetGoLive,
      currentMaintenanceStyle: currentMaintenanceStyle,
      metrics: {
        totalMachines: totalMachines,
        criticalMachines: criticalMachines,
        monthlyDowntimeHours: monthlyDowntimeHours,
        hourlyDowntimeCostINR: hourlyDowntimeCostINR,
        estimatedMonthlyDowntimeCostINR: monthlyCost,
        monitoringCoveragePct: 20.0,
        pcmReadinessScore: 32,
        pcmReadinessGrade: 'Foundational',
        potentialAnnualSavingsINR: estimatedSavings,
        estimatedPaybackMonths: paybackMonths,
      },
      machines: [
        {
          id: `m-cust-1`,
          tag: 'STN-01',
          name: `${lineName || 'Primary Station'} Unit 1`,
          type: `${lineType} Master Unit`,
          criticality: 'High',
          status: 'Warning',
          vibrationMmS: 4.8,
          tempC: 68.0,
          currentA: 45.0,
          monitoringLevel: 'None',
          failureRiskCategory: 'Bearing Spalling',
          historicalDowntimeHrs: 14.5,
          lastAnomaly: 'High vibration flagged during commissioning trial',
        },
        {
          id: `m-cust-2`,
          tag: 'STN-02',
          name: `${lineName || 'Secondary Station'} Unit 2`,
          type: 'Automated Secondary Station',
          criticality: 'High',
          status: 'Normal',
          vibrationMmS: 2.1,
          tempC: 42.0,
          currentA: 30.0,
          monitoringLevel: 'Basic SCADA',
          failureRiskCategory: 'Gearbox Backlash',
          historicalDowntimeHrs: 6.2,
        },
      ],
      downtimeTrends: [
        { month: 'Aug 2026', actualHours: monthlyDowntimeHours * 1.15, targetHours: 20, lossINR_Lakhs: parseFloat(((monthlyCost * 1.15) / 100000).toFixed(2)) },
        { month: 'Sep 2026', actualHours: monthlyDowntimeHours * 1.05, targetHours: 20, lossINR_Lakhs: parseFloat(((monthlyCost * 1.05) / 100000).toFixed(2)) },
        { month: 'Oct 2026', actualHours: monthlyDowntimeHours, targetHours: 20, lossINR_Lakhs: parseFloat((monthlyCost / 100000).toFixed(2)) },
      ],
      riskDistribution: [
        { category: 'Bearing Degradation', riskScore: 85, machineCount: Math.round(totalMachines * 0.4), criticalCount: Math.round(criticalMachines * 0.6) },
        { category: 'Gearbox & Drive Play', riskScore: 72, machineCount: Math.round(totalMachines * 0.3), criticalCount: Math.round(criticalMachines * 0.4) },
        { category: 'Thermal Overheating', riskScore: 60, machineCount: Math.round(totalMachines * 0.2), criticalCount: 2 },
      ],
      alerts: [
        {
          id: `alt-cust-1`,
          machineId: `m-cust-1`,
          machineName: `${lineName || 'Station 01'} Master Unit`,
          tag: 'STN-01',
          parameter: 'Bearing Radial RMS Vibration',
          severity: 'Critical',
          timestamp: 'Just now',
          value: '4.8 mm/s',
          threshold: '4.5 mm/s ISO 10816 Limit',
          message: 'Planned line asset lacks continuous condition monitoring sensors; immediate spec requirement needed.',
          acknowledged: false,
          affectedProductionLossINR: hourlyDowntimeCostINR * 4,
        },
      ],
      recentActivities: [
        {
          id: `act-cust-1`,
          title: 'Line Plan Created',
          type: 'spec_updated',
          user: 'Operations Lead',
          timestamp: 'Just now',
          detail: `Initialized line plan for ${lineName || 'New Manufacturing Line'} with ${totalMachines} machines.`,
        },
      ],
    };

    onCreatePlan(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-slate-700/90 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080E20]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Factory className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Create New Line Plan</h2>
              <p className="text-xs text-slate-400">
                Embed machine health visibility & IoT sensor standards into your new production line
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-4 text-center border-b-2 transition-all ${
              step === 1
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            1. Plant & Line Identity
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 px-4 text-center border-b-2 transition-all ${
              step === 2
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            2. Asset Inventory & Downtime
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-3 px-4 text-center border-b-2 transition-all ${
              step === 3
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            3. ROI & Commissioning
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleFinish} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Factory / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Bharat Forge Powertrain Division"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Pune / Rajkot / Coimbatore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Manufacturing Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Automotive Powertrain & Gears">Automotive & Powertrain</option>
                    <option value="Heavy Forging & Heavy CNC Machining">Heavy Forging & Machining</option>
                    <option value="Food, Beverage & High-Speed Packaging">Food, Beverage & Packaging</option>
                    <option value="Textile Yarn & Ring Spinning">Textile & Spinning</option>
                    <option value="Pharmaceutical Formulation & Packaging">Pharma Formulation</option>
                    <option value="General Discrete Engineering">General Discrete Manufacturing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Line Type Architecture
                  </label>
                  <select
                    value={lineType}
                    onChange={(e) => setLineType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Machining & CNC Cell">Machining & CNC Cell</option>
                    <option value="Automated Assembly">Automated Assembly Line</option>
                    <option value="High-Speed Packaging">High-Speed Packaging Line</option>
                    <option value="Continuous Process">Continuous Process Line</option>
                    <option value="Textile Spinning">Textile Ring Spinning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Production Line Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Line 4: Crankshaft Machining & Induction Hardening"
                  value={lineName}
                  onChange={(e) => setLineName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Machines on Line
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      min={2}
                      max={200}
                      value={totalMachines}
                      onChange={(e) => setTotalMachines(Math.max(2, parseInt(e.target.value) || 2))}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-mono font-bold text-white text-center focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400">Total planned production stations</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Critical Bottleneck Machines
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      min={1}
                      max={totalMachines}
                      value={criticalMachines}
                      onChange={(e) => setCriticalMachines(Math.min(totalMachines, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-24 bg-slate-950 border border-rose-800/80 rounded-lg px-3 py-1.5 text-base font-mono font-bold text-rose-300 text-center focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-400">If stopped, entire line stops</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Monthly Downtime (Hours)
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={monthlyDowntimeHours}
                      onChange={(e) => setMonthlyDowntimeHours(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-mono font-bold text-white text-center focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400">Hours/month lost to breakdowns</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cost of Downtime (₹ / Hour)
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      step={1000}
                      min={5000}
                      value={hourlyDowntimeCostINR}
                      onChange={(e) => setHourlyDowntimeCostINR(Math.max(1000, parseInt(e.target.value) || 0))}
                      className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-mono font-bold text-amber-300 text-center focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">Includes lost output & labor</span>
                  </div>
                </div>
              </div>

              {/* Real-time downtime loss banner */}
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">Current Monthly Downtime Exposure:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {formatINR(monthlyCost)} / month ({formatINR(annualCost)} / yr)
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Commissioning Date
                  </label>
                  <select
                    value={targetGoLive}
                    onChange={(e) => setTargetGoLive(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Q1 2027">Q1 2027 (Jan - Mar)</option>
                    <option value="Q2 2027">Q2 2027 (Apr - Jun)</option>
                    <option value="Q3 2027">Q3 2027 (Jul - Sep)</option>
                    <option value="Q4 2027">Q4 2027 (Oct - Dec)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Maintenance Style
                  </label>
                  <select
                    value={currentMaintenanceStyle}
                    onChange={(e) => setCurrentMaintenanceStyle(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Run-to-failure">Run-to-Failure (Firefighting)</option>
                    <option value="Time-based">Time-based Preventive (PM Schedules)</option>
                    <option value="Condition-based">Condition-based (Periodic Vibration)</option>
                    <option value="Predictive">Predictive (Online Sensors & ML)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Target Downtime Reduction</span>
                  <span className="font-mono font-bold text-blue-400">{targetDowntimeReductionPct}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={80}
                  step={5}
                  value={targetDowntimeReductionPct}
                  onChange={(e) => setTargetDowntimeReductionPct(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>30% (Conservative)</span>
                  <span>55% (Realistic SME)</span>
                  <span>80% (Aggressive)</span>
                </div>
              </div>

              {/* Financial Justification Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-cyan-950/30 border border-blue-700/40 space-y-2.5">
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Calculator className="h-4 w-4" />
                  Estimated Spec ROI & Business Case
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Annual Savings</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatINR(estimatedSavings)} / yr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payback Period</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {paybackMonths} Months
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                  Ready to translate into non-negotiable vendor specifications and sensor tender annexures.
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Initialize SpecSmart Line Plan</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
