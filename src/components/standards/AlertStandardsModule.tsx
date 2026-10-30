import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sliders, 
  Save, 
  RotateCcw, 
  ArrowRight,
  Clock,
  Activity,
  Thermometer,
  Zap
} from 'lucide-react';
import { FactoryProfile } from '../../types';

interface AlertStandardsModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export const AlertStandardsModule: React.FC<AlertStandardsModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  // Configurable Thresholds
  const [vibrationWarningMmS, setVibrationWarningMmS] = useState<number>(2.8);
  const [vibrationCriticalMmS, setVibrationCriticalMmS] = useState<number>(4.5);
  const [tempWarningC, setTempWarningC] = useState<number>(65);
  const [tempCriticalC, setTempCriticalC] = useState<number>(85);
  const [currentOverloadWarningPct, setCurrentOverloadWarningPct] = useState<number>(110);
  const [currentOverloadCriticalPct, setCurrentOverloadCriticalPct] = useState<number>(125);
  const [escalationSlaMinutes, setEscalationSlaMinutes] = useState<number>(15);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate affected machines based on current telemetry vs thresholds
  const machinesExceedingVibration = factory.machines.filter(
    (m) => m.vibrationMmS >= vibrationCriticalMmS
  );
  const machinesWarningVibration = factory.machines.filter(
    (m) => m.vibrationMmS >= vibrationWarningMmS && m.vibrationMmS < vibrationCriticalMmS
  );

  const handleSave = () => {
    onUpdateFactory({
      ...factory,
      recentActivities: [
        {
          id: `act-std-${Date.now()}`,
          title: 'Alert Standards Updated',
          type: 'alert_logged',
          user: 'Maintenance Reliability Engineer',
          timestamp: 'Just now',
          detail: `Tuned vibration threshold limits: Warning ${vibrationWarningMmS} mm/s, Critical ${vibrationCriticalMmS} mm/s (ISO 10816-3 Class II).`,
        },
        ...factory.recentActivities.slice(0, 5),
      ],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Actions */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <BellRing className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Alert & Monitoring Standards Guide
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                ISO 10816-3 Class II
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Establish standardized trip limits, sampling rates, and escalation matrix SLAs across rotating machinery, bearing temperatures, and motor current.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Save Alert Standards</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>View Line Projects</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Live Threshold Impact Pill */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Current Threshold Impact:</span>
            <span className="font-mono text-rose-400 font-bold">
              {machinesExceedingVibration.length} Critical Violations
            </span>
            <span>·</span>
            <span className="font-mono text-amber-400 font-bold">
              {machinesWarningVibration.length} Warning Excursions
            </span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">
            Applies to all {factory.machines.length} assets on {factory.lineName}
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Alert standards saved and locked into Section 5.0 of the Vendor Specification!</span>
          </div>
        )}
      </div>

      {/* 1. ISO 10816 Vibration Severity Thresholds */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              1. ISO 10816-3 Vibration Severity Zones & Tuner
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Unit: Velocity RMS (mm/s, 10–1000 Hz)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Zone A/B */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300">Zone A/B (Normal / Good)</span>
              <span className="font-mono font-bold text-white">&lt; {vibrationWarningMmS} mm/s</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Machine is in new or newly overhauled condition. Permissible for unrestricted continuous long-term operation.
            </p>
            <div className="text-[10px] text-emerald-400 font-mono pt-1">
              Escalation: Routine logging only
            </div>
          </div>

          {/* Zone C */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">Zone C (Warning / Alert)</span>
              <span className="font-mono font-bold text-white">{vibrationWarningMmS} – {vibrationCriticalMmS} mm/s</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Machine condition is deteriorated. Operation allowed for limited period until planned maintenance shutdown.
            </p>
            <div className="text-[10px] text-amber-400 font-mono pt-1">
              Escalation: Auto-alert to Maintenance Supervisor &lt; 15 min
            </div>
          </div>

          {/* Zone D */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-300">Zone D (Critical Trip)</span>
              <span className="font-mono font-bold text-white">&gt; {vibrationCriticalMmS} mm/s</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vibration magnitude severe enough to cause catastrophic spindle or bearing failure. Controlled line deceleration.
            </p>
            <div className="text-[10px] text-rose-400 font-mono pt-1">
              Escalation: Immediate audible beacon + SMS dispatch &lt; 60s
            </div>
          </div>
        </div>

        {/* Interactive Threshold Tuner */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200">
            Fine-Tune Engineering Thresholds for {factory.lineType}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Warning Threshold (Zone C Entry):</span>
                <span className="font-mono font-bold text-amber-400">{vibrationWarningMmS} mm/s</span>
              </div>
              <input
                type="range"
                min={1.8}
                max={4.0}
                step={0.1}
                value={vibrationWarningMmS}
                onChange={(e) => setVibrationWarningMmS(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Critical Trip Limit (Zone D Entry):</span>
                <span className="font-mono font-bold text-rose-400">{vibrationCriticalMmS} mm/s</span>
              </div>
              <input
                type="range"
                min={3.5}
                max={7.5}
                step={0.1}
                value={vibrationCriticalMmS}
                onChange={(e) => setVibrationCriticalMmS(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Temperature & Electrical Overload Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Temperature Standards */}
        <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Thermometer className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              2. Bearing & Sump Temperature Thresholds
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <strong className="text-white block">Drive Bearing Housing Temp</strong>
                <span className="text-slate-400 text-[11px]">PT100 probe on outer raceway</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-amber-400 font-bold">{tempWarningC}°C Warn</span>
                <span className="text-slate-500 mx-1.5">/</span>
                <span className="text-rose-400 font-bold">{tempCriticalC}°C Trip</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <strong className="text-white block">Gearbox Lube Sump Immersion</strong>
                <span className="text-slate-400 text-[11px]">Thermocouple in oil sump</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-amber-400 font-bold">75°C Warn</span>
                <span className="text-slate-500 mx-1.5">/</span>
                <span className="text-rose-400 font-bold">90°C Trip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Electrical Standards */}
        <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Zap className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              3. Motor Current & Electrical Overload
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <strong className="text-white block">Motor Full Load Current (FLA)</strong>
                <span className="text-slate-400 text-[11px]">True RMS Current via CTs</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-amber-400 font-bold">{currentOverloadWarningPct}% FLA</span>
                <span className="text-slate-500 mx-1.5">/</span>
                <span className="text-rose-400 font-bold">{currentOverloadCriticalPct}% Trip</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <strong className="text-white block">Phase Current Unbalance</strong>
                <span className="text-slate-400 text-[11px]">Max deviation from 3-phase mean</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-amber-400 font-bold">&gt; 5% Warn</span>
                <span className="text-slate-500 mx-1.5">/</span>
                <span className="text-rose-400 font-bold">&gt; 10% Trip</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three-Tier Escalation SLA Matrix */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              4. Three-Tier Alert Escalation SLA Protocol
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Automated SMS & Webhook Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Tier 1: Machine Operator</span>
              <span className="font-mono text-cyan-400 text-[11px]">Immediate</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Visual HMI warning banner + beacon flash. Operator validates tooling engagement and surface finish quality within 5 minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Tier 2: Maintenance Lead</span>
              <span className="font-mono text-amber-400 text-[11px]">&lt; 15 Minutes</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Automated WhatsApp / SMS dispatch if warning persists unacknowledged. Supervisor inspects lubricant level and reviews FFT harmonics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Tier 3: Plant Operations Head</span>
              <span className="font-mono text-rose-400 text-[11px]">&lt; 60 Minutes</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Critical Zone D trip unacknowledged. Incident logged in plant OEE ledger; decision on controlled line deceleration or tooling replacement.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>Engineering Baseline Notice:</strong> Vibration and temperature thresholds provided are established based on ISO 10816-3 Class II machinery guidelines (medium-sized industrial motors and drives on rigid foundations). These values serve as initial RFP targets and must be calibrated to specific baseline FFT signatures during the 48-hour loaded commissioning run.
        </div>
      </div>
    </div>
  );
};
