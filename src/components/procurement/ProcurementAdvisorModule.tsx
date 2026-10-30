import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Check, 
  Save, 
  Plus, 
  Package, 
  ShieldAlert,
  Thermometer,
  Zap,
  Activity,
  IndianRupee
} from 'lucide-react';
import { FactoryProfile, MachineRecord } from '../../types';
import { formatINR } from '../../data/mockFactoryData';
import { CHECKLIST_ITEMS } from '../../data/checklistDefinitions';

interface ProcurementAdvisorModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export interface ProcurementBOMItem {
  id: string;
  category: 'Sensors' | 'Edge Gateway' | 'Cabling & IO Hubs' | 'Software & Buffer';
  name: string;
  specs: string;
  targetMachineIds: string[];
  targetMachineTags: string[];
  quantity: number;
  unit: string;
  priority: 'Critical' | 'High' | 'Medium';
  whyReason: string;
  indicativeUnitCostINR: number;
  accepted: boolean;
}

export const ProcurementAdvisorModule: React.FC<ProcurementAdvisorModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Sensors' | 'Edge Gateway' | 'Cabling & IO Hubs'>('All');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate deterministic, rule-based BOM items based on factory machines & missing checklist items
  const initialBOM: ProcurementBOMItem[] = useMemo(() => {
    const items: ProcurementBOMItem[] = [];
    const machines = factory.machines || [];

    // Filter rotating / machining machines needing vibration
    const vibMachines = machines.filter(m => 
      !m.type.toLowerCase().includes('furnace') && 
      (m.criticality === 'High' || m.machineCriticality === 'Critical' || m.monitoringLevel === 'None' || m.monitoringLevel === 'Basic SCADA')
    );

    if (vibMachines.length > 0) {
      items.push({
        id: 'bom-vib-01',
        category: 'Sensors',
        name: 'Triaxial Industrial Accelerometer (IEPE / IO-Link)',
        specs: '100 mV/g sensitivity, 0.5 Hz to 10 kHz bandwidth, M12 connector, IP68 hermetic stainless steel.',
        targetMachineIds: vibMachines.map(m => m.id),
        targetMachineTags: vibMachines.map(m => m.tag),
        quantity: vibMachines.length,
        unit: 'units',
        priority: 'Critical',
        whyReason: `Required for ${vibMachines.length} critical rotating drive stations (${vibMachines.slice(0, 3).map(m => m.tag).join(', ')}${vibMachines.length > 3 ? '...' : ''}) to detect early inner/outer bearing race fatigue prior to line breakdown.`,
        indicativeUnitCostINR: 28000,
        accepted: true,
      });
    }

    // Filter machines needing contact bearing temperature
    const tempMachines = machines.filter(m => m.criticality === 'High' || m.machineCriticality === 'Critical' || m.type.toLowerCase().includes('furnace'));
    if (tempMachines.length > 0) {
      items.push({
        id: 'bom-temp-01',
        category: 'Sensors',
        name: 'Contact Bearing PT100 RTD Temperature Probe',
        specs: 'Class A 3-wire PT100, -50°C to +250°C, 1/4" NPT threaded casing or magnetic mount.',
        targetMachineIds: tempMachines.map(m => m.id),
        targetMachineTags: tempMachines.map(m => m.tag),
        quantity: tempMachines.length * 2, // 2 bearings per machine
        unit: 'units',
        priority: 'Critical',
        whyReason: `Provides thermal runaway protection for ${tempMachines.length} high-duty drive and furnace stations. Overheating is the primary indicator of lube starvation and misalignment.`,
        indicativeUnitCostINR: 6500,
        accepted: true,
      });
    }

    // Filter heavy motor drive machines (>= 15 kW) needing split-core current CTs
    const heavyMotors = machines.filter(m => (m.ratedPowerKw || 0) >= 15);
    if (heavyMotors.length > 0) {
      items.push({
        id: 'bom-ct-01',
        category: 'Sensors',
        name: '3-Phase Split-Core Current Transformers (CTs)',
        specs: '100A / 5A or 4-20mA true RMS loop-powered split-core transducer for non-invasive VFD feeder clipping.',
        targetMachineIds: heavyMotors.map(m => m.id),
        targetMachineTags: heavyMotors.map(m => m.tag),
        quantity: heavyMotors.length,
        unit: 'sets (3-ph)',
        priority: 'High',
        whyReason: `Non-invasive electrical current telemetry for ${heavyMotors.length} heavy motor stations (${heavyMotors.slice(0, 3).map(m => m.tag).join(', ')}). Flags motor overload, cutting tool dullness, and mechanical jams.`,
        indicativeUnitCostINR: 12000,
        accepted: true,
      });
    }

    // Edge Gateway calculation: 1 Gateway per 10-15 machines
    const gatewayCount = Math.max(1, Math.ceil(machines.length / 12));
    items.push({
      id: 'bom-gw-01',
      category: 'Edge Gateway',
      name: 'Industrial Edge Computing IPC (DIN-Rail)',
      specs: 'Intel Atom/Celeron x6413E quad-core, 16GB RAM, 256GB SSD, Dual GbE LAN, 24V DC, 72h local SQLite buffer.',
      targetMachineIds: machines.map(m => m.id),
      targetMachineTags: ['Line-Wide Master'],
      quantity: gatewayCount,
      unit: 'units',
      priority: 'Critical',
      whyReason: `Provides localized store-and-forward edge buffering so plant LAN drops do not cause gaps in predictive vibration spectral data.`,
      indicativeUnitCostINR: 115000,
      accepted: true,
    });

    // Field IO-Link Masters: 1 Master per 4 monitored machines
    const ioMasterCount = Math.max(1, Math.ceil(vibMachines.length / 4));
    items.push({
      id: 'bom-io-01',
      category: 'Cabling & IO Hubs',
      name: '8-Port Machine-Mount IP67 IO-Link Master',
      specs: 'Profinet / EtherNet/IP & MQTT IoT port, IP67 ruggedized zinc die-cast housing with M12 A-coded ports.',
      targetMachineIds: vibMachines.map(m => m.id),
      targetMachineTags: ['Bay Sub-Hubs'],
      quantity: ioMasterCount,
      unit: 'units',
      priority: 'High',
      whyReason: `Mounts directly onto production station frames, eliminating expensive multi-conductor home-run sensor cabling.`,
      indicativeUnitCostINR: 42000,
      accepted: true,
    });

    return items;
  }, [factory.machines]);

  const [bomList, setBomList] = useState<ProcurementBOMItem[]>(initialBOM);

  const toggleAccept = (id: string) => {
    setBomList(prev => prev.map(item => item.id === id ? { ...item, accepted: !item.accepted } : item));
  };

  const filteredBOM = bomList.filter(item => filterCategory === 'All' || item.category === filterCategory);

  // Totals
  const acceptedItems = bomList.filter(item => item.accepted);
  const totalIndicativeBudget = acceptedItems.reduce((acc, item) => acc + (item.quantity * item.indicativeUnitCostINR), 0);

  const handleSaveToSpec = () => {
    onUpdateFactory({
      ...factory,
      recentActivities: [
        {
          id: `act-proc-${Date.now()}`,
          title: 'Smart Procurement BOM Locked',
          type: 'sensor_added',
          user: 'Procurement Lead',
          timestamp: 'Just now',
          detail: `Approved ${acceptedItems.length} BOM hardware packages (${formatINR(totalIndicativeBudget)} indicative estimate) for Section 4.0 tender RFP.`,
        },
        ...factory.recentActivities.slice(0, 5),
      ],
    });
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
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Smart Procurement Advisor & Sensor BOM
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {factory.lineName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rule-based hardware recommendations derived from machine criticality and missing checklist monitoring parameters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveToSpec}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Apply Approved BOM to Spec</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('specification-builder')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Specification Builder</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* 4 Summary Budget & Package KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Indicative Hardware Budget
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {formatINR(totalIndicativeBudget)}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Engineering estimate
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Recommended Packages
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {acceptedItems.length} <span className="text-xs font-normal text-slate-400">/ {bomList.length}</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-mono">
              Ready for vendor RFP
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Monitored Stations
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {factory.machines.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Zero blindspots
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Tender Status
            </span>
            <div className="mt-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Non-Negotiable Scope
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Section 4.0 BOM annexure
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Procurement BOM synchronized and locked into the Specification Builder!</span>
          </div>
        )}
      </div>

      {/* Category Tabs & Filter */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
        {(['All', 'Sensors', 'Edge Gateway', 'Cabling & IO Hubs'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended BOM Items List */}
      <div className="space-y-4">
        {filteredBOM.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.accepted
                ? 'bg-[#0B132B]/90 border-slate-800/90 hover:border-slate-700'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.priority === 'Critical' ? 'bg-rose-950/40 text-rose-300 border-rose-800' :
                    item.priority === 'High' ? 'bg-amber-950/40 text-amber-300 border-amber-800' :
                    'bg-blue-950/40 text-blue-300 border-blue-800'
                  }`}>
                    {item.priority} Priority
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {item.specs}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-1">
                  <div>
                    <strong className="text-white">Engineering Rationale:</strong> {item.whyReason}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono">
                    Target Assets: {item.targetMachineTags.join(', ')}
                  </div>
                </div>
              </div>

              {/* Quantity, Cost & Accept Switch */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-left md:text-right">
                  <div className="text-sm font-bold font-mono text-white">
                    {item.quantity} {item.unit}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                    Est: {formatINR(item.quantity * item.indicativeUnitCostINR)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    (@{formatINR(item.indicativeUnitCostINR)}/ea)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAccept(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    item.accepted
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {item.accepted ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-blue-400" />
                      <span>Included in RFP</span>
                    </>
                  ) : (
                    <span>Excluded</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>Disclaimer on Indicative Costs:</strong> Unit prices and total budgets are empirical industrial planning estimates based on Indian discrete manufacturing vendor benchmarks. They do not represent formal vendor quotations. Actual procurement quotes must be validated via formal supplier tenders using the SpecSmart Specification Builder.
        </div>
      </div>
    </div>
  );
};
