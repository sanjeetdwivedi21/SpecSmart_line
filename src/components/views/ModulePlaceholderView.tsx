import React, { useState } from 'react';
import { 
  NavigationTab, 
  FactoryProfile 
} from '../../types';
import { 
  Building2, 
  CheckSquare, 
  Calculator, 
  Network, 
  Sparkles, 
  FileText, 
  BellRing, 
  FolderKanban, 
  Settings, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  Sliders,
  TrendingDown,
  FileCode
} from 'lucide-react';
import { formatINR } from '../../data/mockFactoryData';

interface ModulePlaceholderViewProps {
  tab: NavigationTab;
  factory: FactoryProfile;
  onNavigate: (tab: NavigationTab) => void;
}

export const ModulePlaceholderView: React.FC<ModulePlaceholderViewProps> = ({
  tab,
  factory,
  onNavigate,
}) => {
  // Local state for interactive controls inside preview views
  const [roiReductionPct, setRoiReductionPct] = useState<number>(55);
  const [selectedSensorProtocol, setSelectedSensorProtocol] = useState<'IO-Link' | 'Modbus TCP' | 'OPC-UA'>('IO-Link');
  const [specExported, setSpecExported] = useState(false);

  // Compute live ROI values based on slider
  const annualCost = factory.metrics.estimatedMonthlyDowntimeCostINR * 12;
  const annualSavings = annualCost * (roiReductionPct / 100);
  const estimatedCapex = factory.metrics.criticalMachines * 180000;
  const paybackMonths = Math.max(1.5, parseFloat((estimatedCapex / (annualSavings / 12)).toFixed(1)));

  // Render according to the selected tab
  switch (tab) {
    case 'factory-assessment':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Factory Downtime & Risk Assessment</h2>
                  <p className="text-xs text-slate-400">Section 5.2 Build Plan: Baseline audit of production line risk profile</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('machine-health')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Proceed to Machine Checklist</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Facility Profile</span>
                <div className="text-sm font-bold text-white">{factory.name}</div>
                <div className="text-xs text-slate-300">{factory.city}, {factory.state}</div>
                <div className="text-xs text-blue-400 font-mono mt-1">{factory.sector}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Line Capacity Under Audit</span>
                <div className="text-sm font-bold text-white">{factory.lineName}</div>
                <div className="text-xs text-slate-300">Architecture: {factory.lineType}</div>
                <div className="text-xs text-amber-400 font-mono mt-1">Target Go-Live: {factory.targetGoLive}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Maintenance Maturity</span>
                <div className="text-sm font-bold text-white">{factory.currentMaintenanceStyle}</div>
                <div className="text-xs text-slate-300">PdM Readiness Score: {factory.metrics.pcmReadinessScore}/100</div>
                <div className="text-xs text-cyan-400 font-mono mt-1">Status: {factory.metrics.pcmReadinessGrade}</div>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 mb-2">Key Assessment Findings & Non-Negotiables</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unplanned Downtime Burden:</strong> Currently losing {factory.metrics.monthlyDowntimeHours} hours/month at {formatINR(factory.metrics.hourlyDowntimeCostINR)}/hr ({formatINR(factory.metrics.estimatedMonthlyDowntimeCostINR)}/mo loss).</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Telemetry Dark Zone:</strong> {Math.round(100 - factory.metrics.monitoringCoveragePct)}% of assets operate without continuous condition telemetry, causing reactive troubleshooting.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vendor Non-Negotiable:</strong> Machine health sensors and edge gateway must be included in the capital equipment specification rather than treated as a post-handover retrofit.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'machine-health':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Machine Health Visibility Checklist</h2>
                  <p className="text-xs text-slate-400">Section 4.3 Build Plan: 6-Step guided wizard ensuring zero monitoring blindspots</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('roi-calculator')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Calculate ROI Impact</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {[
                { step: '01', title: 'Line & Machine Inventory', count: `${factory.metrics.totalMachines} Assets`, status: 'Completed', detail: 'Criticality scoring logged for all primary drive stations' },
                { step: '02', title: 'Parameters to Monitor', count: 'Vibration, Temp, Current', status: 'Completed', detail: 'ISO 10816 vibration thresholds & thermocouple ranges mapped' },
                { step: '03', title: 'Sensor & Connectivity', count: 'IO-Link Masters + IEPE', status: 'In Review', detail: 'Selected high-frequency accelerometers & IO-Link hubs' },
                { step: '04', title: 'Alert & Escalation Rules', count: 'SMS / WhatsApp / Webhook', status: 'Configured', detail: 'Critical alerts routed to Plant Head within 5 mins of limit trip' },
                { step: '05', title: 'Data Architecture', count: 'OPC-UA Edge Gateway', status: 'Configured', detail: 'Local time-series buffering with cloud historian link' },
                { step: '06', title: 'Predictive Analytics', count: 'Bearing Anomaly Models', status: 'Ready for Spec', detail: 'FFT spectral analysis specified for vendor handover' },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-400 font-bold">{item.step}.</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{item.count}</div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'roi-calculator':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Interactive ROI & Risk Reduction Calculator</h2>
                  <p className="text-xs text-slate-400">Section 4.1 Build Plan: Quantifying financial justification for machine health sensors</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('specification-builder')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Push to Vendor Spec</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Interactive Calculator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Target Unplanned Downtime Reduction</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">{roiReductionPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={80}
                    step={5}
                    value={roiReductionPct}
                    onChange={(e) => setRoiReductionPct(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>25% (Conservative)</span>
                    <span>55% (Realistic SME)</span>
                    <span>80% (Aggressive)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Current Downtime Loss</span>
                    <span className="font-mono font-bold text-rose-400 text-base">
                      {formatINR(annualCost)} / yr
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {factory.metrics.monthlyDowntimeHours}h/mo @ {formatINR(factory.metrics.hourlyDowntimeCostINR)}/h
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Estimated Sensor Capex</span>
                    <span className="font-mono font-bold text-cyan-300 text-base">
                      {formatINR(estimatedCapex)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {factory.metrics.criticalMachines} critical machines @ ₹1.8L
                    </span>
                  </div>
                </div>
              </div>

              {/* Output Cards */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-cyan-950/30 border border-blue-700/40 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Calculated Financial Returns
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Annual Savings</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                        {formatINR(annualSavings)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Payback Period</span>
                      <span className="text-2xl font-bold font-mono text-white tabular-nums">
                        {paybackMonths} <span className="text-sm font-normal text-slate-400">Months</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>On-Time Delivery (OTD) Impact:</span>
                    <strong className="text-emerald-400">+14.2% Improvement</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Default Risk Band:</span>
                    <strong className="text-cyan-400">Shifted from High → Low</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'architecture-designer':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Network className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Data Architecture Visualization Canvas</h2>
                  <p className="text-xs text-slate-400">Section 4.5 Build Plan: Interactive machine-to-cloud data flow and protocol mapper</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Field Protocol:</span>
                <select
                  value={selectedSensorProtocol}
                  onChange={(e) => setSelectedSensorProtocol(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="IO-Link">IO-Link (Recommended)</option>
                  <option value="Modbus TCP">Modbus TCP</option>
                  <option value="OPC-UA">OPC-UA Direct</option>
                </select>
              </div>
            </div>

            {/* Architecture Node Diagram */}
            <div className="mt-5 p-6 rounded-xl bg-slate-950/70 border border-slate-800 overflow-x-auto">
              <div className="min-w-[700px] flex items-center justify-between gap-3">
                {/* Node 1: Physical Sensors */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 w-44 text-center">
                  <Radio className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-white">Sensors & IEPE</div>
                  <div className="text-[10px] text-slate-400 mt-1">Triaxial Vibration & PT100 Temp</div>
                  <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    10 kHz Sampling
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-blue-400">{selectedSensorProtocol}</span>
                  <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 my-1 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-cyan-400" />
                  </div>
                </div>

                {/* Node 2: IO Master / PLC */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 w-44 text-center">
                  <Cpu className="h-5 w-5 text-indigo-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-white">PLC / IO Master</div>
                  <div className="text-[10px] text-slate-400 mt-1">Siemens S7-1500 / Allen Bradley</div>
                  <div className="mt-2 text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-800/40">
                    Real-time Logic
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-cyan-400">OPC-UA / MQTT</span>
                  <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 my-1 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                </div>

                {/* Node 3: Edge Gateway */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 w-44 text-center">
                  <Layers className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-white">Edge Gateway / IPC</div>
                  <div className="text-[10px] text-slate-400 mt-1">Local Buffer (72h storage)</div>
                  <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    Edge FFT Analytics
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-emerald-400">TLS 1.3 JSON</span>
                  <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 my-1 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-cyan-400" />
                  </div>
                </div>

                {/* Node 4: Cloud Analytics */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 w-44 text-center">
                  <Network className="h-5 w-5 text-cyan-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-white">Cloud PdM Engine</div>
                  <div className="text-[10px] text-slate-400 mt-1">Historian + Predictive Models</div>
                  <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    ISO Severity Alerts
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 flex items-center justify-between">
              <span>This architecture flow automatically embeds into Section 5 of your Vendor-Ready Specification Document.</span>
              <button
                onClick={() => onNavigate('specification-builder')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Inspect Spec Section →
              </button>
            </div>
          </div>
        </div>
      );

    case 'procurement-advisor':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Smart Procurement Advisor</h2>
                  <p className="text-xs text-slate-400">Section 4.7 Build Plan: Contextual sensor recommendations & tender gap auditor</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('specification-builder')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Apply All to Spec</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  type: 'Missing Standard',
                  severity: 'High',
                  title: 'Edge Gateway Local Data Buffer Missing in Tender Spec',
                  desc: 'Indian manufacturing setups experience occasional LAN drops. Without local SQLite/Timescale buffering on the Edge Gateway, high-frequency vibration bursts during micro-stops will be lost.',
                  recommendation: 'Mandate 72-hour on-premise non-volatile storage with store-and-forward MQTT in Section 4.5 of RFP.',
                },
                {
                  type: 'Sensor Recommendation',
                  severity: 'Critical',
                  title: 'Triaxial Accelerometer Required on Primary Gear Hobbing Spindle',
                  desc: `Asset ${factory.machines[0]?.tag || 'HOB-01'} has high risk of gearbox backlash. Standard 1-axis velocity transmitters miss high-frequency bearing cage impacts above 1.5 kHz.`,
                  recommendation: 'Specify IEPE 100 mV/g wideband accelerometer with IO-Link master module in machine BOM.',
                },
                {
                  type: 'Vendor Responsibility',
                  severity: 'Medium',
                  title: 'Commissioning Baseline Vibration Sign-off Requirement',
                  desc: 'Vendors often walk away after running 100 parts. Cold line tests do not reveal thermal expansion or misalignment issues.',
                  recommendation: 'Mandate a continuous 48-hour loaded run-in with baseline FFT signature sign-off before final 20% payment milestone.',
                },
              ].map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rec.severity === 'Critical' ? 'bg-rose-950/40 text-rose-400 border-rose-800' : 'bg-amber-950/40 text-amber-400 border-amber-800'
                      }`}>
                        {rec.severity} Risk
                      </span>
                      {rec.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{rec.type}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.desc}</p>
                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200">
                    <strong>Recommended Specification Clause:</strong> {rec.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'specification-builder':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Vendor-Ready Specification Builder</h2>
                  <p className="text-xs text-slate-400">Sections 4.2 & 4.4 Build Plan: Assembling tender-grade machine health documentation</p>
                </div>
              </div>
              <button
                onClick={() => setSpecExported(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
              >
                <Download className="h-4 w-4" />
                <span>{specExported ? 'Specification Package Exported!' : 'Export Vendor-Ready Spec (PDF)'}</span>
              </button>
            </div>

            {specExported && (
              <div className="my-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Generated Spec Document: <strong>{factory.name}_LinePlan_Spec_v1.0.pdf</strong> (Includes Cover, BOM, ISO 10816 annex, and Tag Matrix)
                </span>
                <button
                  onClick={() => setSpecExported(false)}
                  className="text-xs font-medium text-emerald-300 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Document Preview */}
            <div className="mt-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs font-sans">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Tender Annexure Spec #SLP-2026-IND</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{factory.name} – {factory.lineName}</h3>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">Status: Ready for Tender RFP</span>
              </div>

              <div className="space-y-3 text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white text-xs">Section 1.0 Executive Mandate & Business Justification</h4>
                  <p className="mt-1">
                    Machine health visibility, high-speed telemetry, and condition monitoring are non-negotiable requirements of this line build. Baseline line downtime is evaluated at {factory.metrics.monthlyDowntimeHours} hrs/month with an estimated financial loss exposure of {formatINR(factory.metrics.estimatedMonthlyDowntimeCostINR)}/month. Equipment vendors must guarantee sensor interfaces that reduce unplanned downtime by at least 50%.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs">Section 2.0 Sensor & Telemetry Integration Standards</h4>
                  <p className="mt-1">
                    All critical stations ({factory.metrics.criticalMachines} designated bottlenecks) shall be supplied with factory-fitted triaxial piezoelectric accelerometers (100 mV/g, 10 kHz bandwidth) and dual-channel bearing temperature probes terminated at an on-machine IO-Link master hub.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs">Section 3.0 Industrial Communication & Edge Gateway</h4>
                  <p className="mt-1">
                    The PLC shall expose an OPC-UA server communicating with the plant Edge Gateway via standard Ethernet/IP or Profinet. Historical buffering of 72 hours minimum is required locally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'alert-standards':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Alert & Monitoring Standards Guide</h2>
                  <p className="text-xs text-slate-400">Section 4.6 Build Plan: Industrial ISO 10816 thresholds and escalation SLA rules</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('overview')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">Zone A/B: Good / Acceptable</span>
                  <span className="text-slate-400">&lt; 2.8 mm/s RMS</span>
                </div>
                <div className="text-xs text-slate-300">Continuous production permitted. Normal machine vibration signature on rigid industrial foundation.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Zone C: Warning</span>
                  <span className="text-slate-400">2.8 – 4.5 mm/s RMS</span>
                </div>
                <div className="text-xs text-slate-300">Machine condition degraded. Schedule planned maintenance inspection within 7 days. Automated alert to Maintenance Lead.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">Zone D: Critical Trip</span>
                  <span className="text-slate-400">&gt; 4.5 mm/s RMS</span>
                </div>
                <div className="text-xs text-slate-300">Imminent damage risk. Line interlock warning or controlled deceleration triggered to prevent catastrophic spindle seizure.</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'projects':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Line Planning Projects</h2>
                  <p className="text-xs text-slate-400">Active manufacturing line plans and tender specification documents</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('overview')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { name: `${factory.name} – ${factory.lineName}`, code: factory.plantCode, machines: factory.metrics.totalMachines, status: 'Active Draft', progress: 78, savings: factory.metrics.potentialAnnualSavingsINR },
                { name: 'Kalyani Precision Gear Line 2 (Retrofit Spec)', code: 'KPAC-PUN-02', machines: 22, status: 'Vendor Review', progress: 95, savings: 8400000 },
                { name: 'Bhosari Machine Shop Cell C (Tender Ready)', code: 'BMSC-PUN-01', machines: 16, status: 'Approved', progress: 100, savings: 6200000 },
              ].map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm truncate">{proj.name}</span>
                      <span className="font-mono text-[11px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/60 shrink-0">
                        {proj.code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>{proj.machines} Machines</span>
                      <span>·</span>
                      <span>Est. Savings: {formatINR(proj.savings)}/yr</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-medium">{proj.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-28 text-right">
                      <span className="text-xs font-mono font-bold text-slate-300">{proj.progress}%</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('overview')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'settings':
      return (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Plant & System Configuration</h2>
                <p className="text-xs text-slate-400">SpecSmart Line Planner engineering defaults and regional manufacturing presets</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white">Regional Currency & Engineering Units</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Financial Currency</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                    <option>Indian Rupee (₹ INR) – Lakhs & Crores</option>
                    <option>US Dollar ($ USD)</option>
                    <option>Euro (€ EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Vibration Unit Standard</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                    <option>Velocity RMS (mm/s) – ISO 10816</option>
                    <option>Peak Acceleration (g)</option>
                    <option>Peak-to-Peak Displacement (µm)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white">Alert Escalation & Integration</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Critical Trip Notification SLA</label>
                  <input type="text" defaultValue="Immediate (&lt; 60 seconds)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Plant MES / ERP Export Format</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                    <option>REST JSON API / Webhook</option>
                    <option>OPC-UA Tag Mapping</option>
                    <option>CSV / Excel Tag Export</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
