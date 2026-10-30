import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  IndianRupee, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Percent
} from 'lucide-react';
import { FactoryProfile } from '../../types';
import { formatINR } from '../../data/mockFactoryData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

interface RoiCalculatorModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export const RoiCalculatorModule: React.FC<RoiCalculatorModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  // Base inputs from factory assessment
  const [monthlyDowntimeHours, setMonthlyDowntimeHours] = useState<number>(
    factory.metrics.monthlyDowntimeHours || 46.5
  );
  const [hourlyDowntimeCostINR, setHourlyDowntimeCostINR] = useState<number>(
    factory.metrics.hourlyDowntimeCostINR || 32000
  );

  // Configurable ROI Parameters
  const criticalCount = factory.metrics.criticalMachines || 8;
  const defaultCapex = criticalCount * 175000 + 120000; // ~₹1.75L per critical station + ₹1.2L edge gateway
  const [plannedCapexINR, setPlannedCapexINR] = useState<number>(defaultCapex);
  const [expectedDowntimeReductionPct, setExpectedDowntimeReductionPct] = useState<number>(55);
  const [annualOpexPct, setAnnualOpexPct] = useState<number>(8); // 8% sensor maintenance & software/cloud
  const [scenarioName, setScenarioName] = useState<'Realistic SME (55%)' | 'Conservative (35%)' | 'Aggressive (75%)'>('Realistic SME (55%)');
  
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep synced with factory changes
  useEffect(() => {
    setMonthlyDowntimeHours(factory.metrics.monthlyDowntimeHours || 46.5);
    setHourlyDowntimeCostINR(factory.metrics.hourlyDowntimeCostINR || 32000);
    const calculatedCapex = (factory.metrics.criticalMachines || 8) * 175000 + 120000;
    setPlannedCapexINR(calculatedCapex);
    setIsDirty(false);
  }, [factory.id]);

  // Financial Calculations
  const currentMonthlyLoss = monthlyDowntimeHours * hourlyDowntimeCostINR;
  const currentAnnualDowntimeCost = currentMonthlyLoss * 12;

  const estimatedMonthlySavings = currentMonthlyLoss * (expectedDowntimeReductionPct / 100);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const annualOpexINR = plannedCapexINR * (annualOpexPct / 100);
  const netAnnualBenefitINR = Math.max(0, estimatedAnnualSavings - annualOpexINR);

  // Payback period (Months) = Planned Capex / (Estimated Monthly Savings)
  const paybackMonths = estimatedMonthlySavings > 0 
    ? Math.max(1.2, parseFloat((plannedCapexINR / estimatedMonthlySavings).toFixed(1)))
    : 0;

  // 3-Year Return on Investment %
  const threeYearGrossSavings = estimatedAnnualSavings * 3;
  const threeYearTotalCost = plannedCapexINR + (annualOpexINR * 3);
  const threeYearNetSavings = threeYearGrossSavings - threeYearTotalCost;
  const threeYearRoiPct = threeYearTotalCost > 0 
    ? Math.round((threeYearNetSavings / threeYearTotalCost) * 100)
    : 0;

  // Physical Hours Saved
  const annualHoursSaved = Math.round(monthlyDowntimeHours * 12 * (expectedDowntimeReductionPct / 100));
  const newMonthlyDowntimeHours = Math.max(1, parseFloat((monthlyDowntimeHours * (1 - expectedDowntimeReductionPct / 100)).toFixed(1)));
  const newMonthlyLossINR = Math.round(currentMonthlyLoss * (1 - expectedDowntimeReductionPct / 100));

  // Risk Severity Band Mapping
  const riskBand = expectedDowntimeReductionPct >= 65 
    ? { level: 'Low Risk', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', otdImprove: '+16.5%' }
    : expectedDowntimeReductionPct >= 45 
    ? { level: 'Medium Risk', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', otdImprove: '+12.4%' }
    : { level: 'High Residual Risk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', otdImprove: '+6.8%' };

  // Chart Data: Before vs After Downtime & Production Loss
  const chartData = [
    {
      metric: 'Downtime Hours/Mo',
      Before: monthlyDowntimeHours,
      After: newMonthlyDowntimeHours,
      unit: 'hrs',
    },
    {
      metric: 'Monthly Loss (₹ Lakhs)',
      Before: parseFloat((currentMonthlyLoss / 100000).toFixed(2)),
      After: parseFloat((newMonthlyLossINR / 100000).toFixed(2)),
      unit: '₹L',
    },
    {
      metric: 'Annual Loss (₹ Lakhs)',
      Before: parseFloat((currentAnnualDowntimeCost / 100000).toFixed(2)),
      After: parseFloat(((currentAnnualDowntimeCost - estimatedAnnualSavings) / 100000).toFixed(2)),
      unit: '₹L',
    },
  ];

  const handleScenarioChange = (scenario: typeof scenarioName) => {
    setScenarioName(scenario);
    if (scenario === 'Conservative (35%)') {
      setExpectedDowntimeReductionPct(35);
    } else if (scenario === 'Realistic SME (55%)') {
      setExpectedDowntimeReductionPct(55);
    } else {
      setExpectedDowntimeReductionPct(75);
    }
    setIsDirty(true);
  };

  const handleSaveRoi = () => {
    const updatedFactory: FactoryProfile = {
      ...factory,
      metrics: {
        ...factory.metrics,
        potentialAnnualSavingsINR: estimatedAnnualSavings,
        estimatedPaybackMonths: paybackMonths,
      },
      recentActivities: [
        {
          id: `act-roi-${Date.now()}`,
          title: 'ROI Payback Recalculated',
          type: 'roi_calculated',
          user: 'Operations Lead',
          timestamp: 'Just now',
          detail: `Locked ${expectedDowntimeReductionPct}% reduction scenario: ${paybackMonths} months payback with ${formatINR(estimatedAnnualSavings)}/yr savings.`,
        },
        ...factory.recentActivities.slice(0, 5),
      ],
    };

    onUpdateFactory(updatedFactory);
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Action Bar */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Calculator className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                ROI & Risk Reduction Calculator
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {factory.plantCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Model upfront sensor capex against monthly breakdown losses. Generate defensible payback justification for capital equipment approval.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  setExpectedDowntimeReductionPct(55);
                  setPlannedCapexINR(defaultCapex);
                  setIsDirty(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Defaults</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveRoi}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Save & Push to Spec</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('architecture-designer')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Architecture Designer</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* 4 Primary Financial KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Estimated Annual Savings
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {formatINR(estimatedAnnualSavings)}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              {expectedDowntimeReductionPct}% downtime cut
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Payback Horizon
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {paybackMonths} <span className="text-xs font-normal text-slate-400">Months</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              On {formatINR(plannedCapexINR)} Capex
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Net 3-Year Benefit
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {formatINR(threeYearNetSavings)}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-mono">
              +{threeYearRoiPct}% 3-Yr ROI
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Delivery Risk Band
            </span>
            <div className="mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${riskBand.color}`}>
                {riskBand.level}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              OTD: <strong className="text-emerald-400">{riskBand.otdImprove}</strong>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              ROI calculation locked and pushed to project specification! Annual savings ({formatINR(estimatedAnnualSavings)}) and {paybackMonths} months payback updated.
            </span>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Inputs & Assumptions vs Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 Cols): Inputs & Scenario Selector */}
        <div className="lg:col-span-5 bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-tight">
              1. Investment & Reduction Parameters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust planned sensor hardware spend and expected downtime reduction
            </p>
          </div>

          {/* Scenario Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Standard Industry Scenario Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative (35%)', 'Realistic SME (55%)', 'Aggressive (75%)'] as const).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => handleScenarioChange(sc)}
                  className={`p-2 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    scenarioName === sc
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sc.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Slider: Downtime Reduction % */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Target Downtime Reduction</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{expectedDowntimeReductionPct}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={80}
              step={5}
              value={expectedDowntimeReductionPct}
              onChange={(e) => {
                setExpectedDowntimeReductionPct(parseInt(e.target.value));
                setIsDirty(true);
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20% (Minimal)</span>
              <span>55% (CII SME Benchmark)</span>
              <span>80% (World Class)</span>
            </div>
          </div>

          {/* Planned Capex Input */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Planned Upfront Monitoring Investment (₹ Capex)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={25000}
                min={50000}
                value={plannedCapexINR}
                onChange={(e) => {
                  setPlannedCapexINR(Math.max(10000, parseInt(e.target.value) || 10000));
                  setIsDirty(true);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-cyan-400 font-mono font-bold shrink-0">
                {formatINR(plannedCapexINR)}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Covers {criticalCount} critical station sensors, field hubs, and edge gateways.
            </div>
          </div>

          {/* Operating Baseline Inputs (Locked from Assessment, with visual indicator) */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Baseline Downtime</span>
              <span className="font-mono font-bold text-white text-sm">
                {monthlyDowntimeHours} hrs/mo
              </span>
              <span className="text-[10px] text-slate-500 block">From Assessment</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Downtime Cost Rate</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {formatINR(hourlyDowntimeCostINR)}/hr
              </span>
              <span className="text-[10px] text-slate-500 block">Direct + Lost Margin</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Before vs After Visual Comparison & Assumptions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Comparison Card */}
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  2. Before vs. After Downtime Mitigation Impact
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison of monthly downtime hours and direct production loss
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
                Saves {annualHoursSaved} hrs/year
              </span>
            </div>

            {/* Before vs After Summary Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Column */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                  <span>Current Baseline (Run-to-Failure)</span>
                  <span className="font-mono text-[10px]">Unmonitored</span>
                </div>
                <div className="pt-1">
                  <div className="text-2xl font-bold font-mono text-white">
                    {monthlyDowntimeHours} <span className="text-xs font-normal text-slate-400">hrs/month</span>
                  </div>
                  <div className="text-xs text-rose-400 font-mono font-semibold mt-1">
                    Loss: {formatINR(currentMonthlyLoss)} / mo ({formatINR(currentAnnualDowntimeCost)} / yr)
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-rose-900/40">
                  Reactive firefighting, unplanned line stoppages, missed customer shipments.
                </div>
              </div>

              {/* After Column */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>With SpecSmart Condition Monitoring</span>
                  <span className="font-mono text-[10px]">Predictive</span>
                </div>
                <div className="pt-1">
                  <div className="text-2xl font-bold font-mono text-emerald-300">
                    {newMonthlyDowntimeHours} <span className="text-xs font-normal text-slate-400">hrs/month</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                    Residual: {formatINR(newMonthlyLossINR)} / mo (Saved {formatINR(estimatedAnnualSavings)} / yr)
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-900/40">
                  Pre-shift alerts, scheduled off-hour bearing changeouts, zero emergency line trips.
                </div>
              </div>
            </div>

            {/* Recharts Bar Comparison */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="metric" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any, item: any) => [`${val} ${item.payload.unit}`, name]}
                  />
                  <Bar dataKey="Before" name="Current (Before)" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="After" name="Mitigated (After)" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clearly Labeled Assumptions & Methodology */}
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <Info className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Assumptions & Calculation Methodology (Engineering Baseline)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pl-1 leading-relaxed">
              <li>
                <strong>Downtime Cost Rate:</strong> Directly adopted from Factory Assessment ({formatINR(hourlyDowntimeCostINR)}/hr), incorporating scrap rate, operator idle cost, and overhead allocation.
              </li>
              <li>
                <strong>Reduction Benchmark:</strong> {expectedDowntimeReductionPct}% downtime reduction represents empirical discrete manufacturing data (CII / Industry 4.0 SME study) achieved when rotating assets implement continuous ISO 10816 vibration and temperature threshold alerts.
              </li>
              <li>
                <strong>Annual Maintenance & Cloud Opex:</strong> Factored at {annualOpexPct}% of hardware Capex ({formatINR(annualOpexINR)}/year) for sensor recalibration, gateway firmware updates, and connectivity.
              </li>
              <li>
                <strong>Indicative Nature:</strong> Actual returns depend on factory maintenance team response times and adherence to generated escalation rules.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
