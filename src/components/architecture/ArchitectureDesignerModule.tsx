import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Radio, 
  Layers, 
  Server, 
  LayoutDashboard, 
  Save, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Sliders,
  ShieldCheck,
  Zap,
  Activity,
  Thermometer,
  Gauge,
  Wifi,
  Database
} from 'lucide-react';
import { FactoryProfile } from '../../types';

interface ArchitectureDesignerModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export type ArchitectureTopology = 'hybrid_cloud' | 'minimal_sme' | 'air_gapped_onprem';

export const ArchitectureDesignerModule: React.FC<ArchitectureDesignerModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  const [topology, setTopology] = useState<ArchitectureTopology>('hybrid_cloud');
  const [selectedLayer, setSelectedLayer] = useState<number>(3); // 1: Machines, 2: Sensors, 3: Edge Gateway, 4: Network, 5: Cloud, 6: Dashboard
  const [sensorProtocol, setSensorProtocol] = useState<'IO-Link' | 'Modbus TCP' | 'Analog 4-20mA'>('IO-Link');
  const [edgeBufferHours, setEdgeBufferHours] = useState<number>(72);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onUpdateFactory({
      ...factory,
      recentActivities: [
        {
          id: `act-arch-${Date.now()}`,
          title: 'Data Architecture Finalized',
          type: 'spec_updated',
          user: 'Automation Architect',
          timestamp: 'Just now',
          detail: `Selected ${topology.replace('_', ' ').toUpperCase()} with ${sensorProtocol} fieldbus and ${edgeBufferHours}h local buffering.`,
        },
        ...factory.recentActivities.slice(0, 5),
      ],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Mode Switcher */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Network className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Industrial IoT Data Architecture Designer
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {factory.lineName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive end-to-end data pipeline: Machines → Sensors → Edge Gateway → Network → Cloud / On-Prem Server → Monitoring Dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Save Architecture to Spec</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('procurement-advisor')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Procurement Advisor</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Topology Selector & Architecture Specs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Architecture Topology:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {[
                { id: 'hybrid_cloud', label: 'Hybrid Cloud (Recommended)' },
                { id: 'minimal_sme', label: 'Minimal SME Local' },
                { id: 'air_gapped_onprem', label: 'On-Prem Air-Gapped' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopology(t.id as any)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    topology === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Protocol: <strong className="text-white">{sensorProtocol}</strong></span>
            <span>·</span>
            <span>Edge Buffer: <strong className="text-white">{edgeBufferHours} Hours</strong></span>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Architecture blueprint locked and populated into Section 5.0 of the Vendor Specification!</span>
          </div>
        )}
      </div>

      {/* 2. Full Visual Architecture Diagram */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Visual Pipeline Map</span>
            <span className="text-slate-500 font-normal">· Click any layer node to inspect component details</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">
            End-to-End Latency: &lt; 250ms
          </span>
        </div>

        {/* The 6 Architecture Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Layer 1: Machines */}
          <div
            onClick={() => setSelectedLayer(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 1
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">1. Machines & PLCs</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {factory.machines.length} Total Assets
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-blue-300 font-mono">
              Spindles, Presses, Furnaces
            </div>
          </div>

          {/* Layer 2: Physical Sensors */}
          <div
            onClick={() => setSelectedLayer(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 2
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <Radio className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">2. IoT Sensors</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Vibration, Temp, Current
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-300 font-mono">
              IEPE, PT100, CTs
            </div>
          </div>

          {/* Layer 3: Edge Gateway */}
          <div
            onClick={() => setSelectedLayer(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 3
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">3. Edge Gateway / IPC</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Local SQLite Buffer ({edgeBufferHours}h)
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-indigo-300 font-mono">
              Store-and-Forward
            </div>
          </div>

          {/* Layer 4: Network */}
          <div
            onClick={() => setSelectedLayer(4)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 4
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Wifi className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">4. Industrial Network</div>
              <div className="text-[10px] text-slate-400 mt-1">
                OPC-UA / MQTT TLS
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-emerald-300 font-mono">
              Ethernet / 4G Fallback
            </div>
          </div>

          {/* Layer 5: Cloud / Server */}
          <div
            onClick={() => setSelectedLayer(5)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 5
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Database className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">5. Cloud / Historian</div>
              <div className="text-[10px] text-slate-400 mt-1">
                TimescaleDB / Postgres
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300 font-mono">
              Long-term Trend Data
            </div>
          </div>

          {/* Layer 6: Dashboard */}
          <div
            onClick={() => setSelectedLayer(6)}
            className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
              selectedLayer === 6
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div>
              <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-2">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white">6. Operator HMI</div>
              <div className="text-[10px] text-slate-400 mt-1">
                SpecSmart Dashboard & Alerts
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-rose-300 font-mono">
              SMS / WhatsApp Push
            </div>
          </div>
        </div>

        {/* Connecting Protocol Arrow Bar */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
          <span className="font-mono text-cyan-400">
            Flow: Physical Telemetry → IO-Link Master → Edge IPC → OPC-UA Client → TimescaleDB → Real-Time Alert Engine
          </span>
          <span className="text-slate-400">
            Selected Layer: <strong>Layer {selectedLayer}</strong>
          </span>
        </div>
      </div>

      {/* 3. Deep Component Inspector Panel */}
      <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Component Specification & Engineering Rules (Layer {selectedLayer})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Standard: IEC 61131 / ISO 10816
          </span>
        </div>

        {selectedLayer === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Line Machinery Physical Context</h4>
              <p className="text-slate-300 leading-relaxed">
                Connects directly to {factory.machines.length} production stations on {factory.lineName}. Rotating cutter spindles, reduction gearboxes, feed hydraulic cylinders, and continuous furnaces.
              </p>
              <div className="pt-2 text-cyan-300 font-mono text-[11px]">
                Critical Bottlenecks: {factory.metrics.criticalMachines} Assets designated as Single-Point-of-Failure.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">PLC & Controller Interfaces</h4>
              <p className="text-slate-300 leading-relaxed">
                Supports Siemens S7-1200/1500 (Profinet/OPC-UA), Rockwell ControlLogix (EtherNet/IP), and Mitsubishi iQ-R. No modifications to machine safety loops required.
              </p>
            </div>
          </div>
        )}

        {selectedLayer === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <Activity className="h-4 w-4 text-blue-400" />
                Vibration Accelerometers
              </div>
              <p className="text-slate-300">
                Triaxial piezoelectric IEPE sensors (100 mV/g, 10 kHz bandwidth). Magnetic or stud mounted directly on spindle bearing housings.
              </p>
              <span className="text-[10px] text-cyan-400 font-mono block">Sampling: 10,240 Hz for FFT demodulation</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <Thermometer className="h-4 w-4 text-amber-400" />
                Temperature Probes
              </div>
              <p className="text-slate-300">
                PT100 Class A RTD probes for bearing housings and immersion thermocouples for gearbox lube oil sumps.
              </p>
              <span className="text-[10px] text-amber-400 font-mono block">Sampling: 1 Hz continuous averaging</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <Zap className="h-4 w-4 text-cyan-400" />
                Electrical Current CTs
              </div>
              <p className="text-slate-300">
                Non-invasive split-core current transformers (5A secondary or 4-20mA) clipped around VFD motor feeder leads.
              </p>
              <span className="text-[10px] text-cyan-400 font-mono block">Sampling: 50 Hz true RMS</span>
            </div>
          </div>
        )}

        {selectedLayer === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Edge Gateway Specification</h4>
              <p className="text-slate-300 leading-relaxed">
                Industrial DIN-rail IPC (Intel Celeron/Atom x6413E, 16GB RAM, 256GB NVMe SSD, Dual Gigabit Ethernet, 24V DC). IP40 aluminum chassis rated for 0°C to 60°C shopfloor environments.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="text-slate-400">Local Buffer Retention:</span>
                <select
                  value={edgeBufferHours}
                  onChange={(e) => setEdgeBufferHours(parseInt(e.target.value))}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                >
                  <option value={24}>24 Hours</option>
                  <option value={72}>72 Hours (Recommended for Indian SME)</option>
                  <option value={168}>7 Days (Extended)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Store-and-Forward Logic</h4>
              <p className="text-slate-300 leading-relaxed">
                High-speed SQLite/DuckDB buffer on edge. If plant LAN drops or internet disconnects, telemetry is cached locally and back-filled seamlessly upon reconnection without losing peak vibration spikes.
              </p>
            </div>
          </div>
        )}

        {selectedLayer === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Field Protocol Selection</h4>
              <div className="flex items-center gap-2 pt-1">
                {(['IO-Link', 'Modbus TCP', 'Analog 4-20mA'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSensorProtocol(p)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-colors ${
                      sensorProtocol === p
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-slate-400 pt-1 leading-relaxed">
                IO-Link master hubs (IP67) mount directly on machine frames, reducing sensor cabling home-runs by up to 70%.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Uplink Security & Protocols</h4>
              <p className="text-slate-300 leading-relaxed">
                MQTT over TLS 1.3 (Port 8883) with X.509 client certificates or OPC-UA (Port 4840) with Basic256Sha256 encryption. Outbound only; no incoming ports opened on the factory firewall.
              </p>
            </div>
          </div>
        )}

        {selectedLayer >= 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Time-Series Historian & Storage</h4>
              <p className="text-slate-300 leading-relaxed">
                TimescaleDB / PostgreSQL time-series engine with automated hypertable partitioning. Compresses sensor telemetry by up to 90% while retaining sub-second resolution for post-breakdown root cause analysis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">Operator HMI & Alert Dispatcher</h4>
              <p className="text-slate-300 leading-relaxed">
                Real-time web dashboard running SpecSmart Line Planner. Automated rule engine dispatches ISO 10816 threshold breaches to Maintenance Supervisors via SMS / WhatsApp within 60 seconds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
