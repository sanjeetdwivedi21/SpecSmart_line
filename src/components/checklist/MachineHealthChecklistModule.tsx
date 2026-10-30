import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Save, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  Activity, 
  Radio, 
  Thermometer, 
  Zap, 
  Gauge, 
  Network, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  Check, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  FactoryProfile, 
  MachineRecord, 
  MachineCriticality, 
  ChecklistCategory, 
  ChecklistItemStatus, 
  MachineChecklistData, 
  VisibilityCategory 
} from '../../types';
import { 
  CHECKLIST_ITEMS, 
  initializeMachineChecklist, 
  calculateMachineVisibilityScore, 
  calculateFactoryChecklistSummary, 
  generateMachineRecommendations 
} from '../../data/checklistDefinitions';
import { formatINR } from '../../data/mockFactoryData';

interface MachineHealthChecklistModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

const CATEGORY_META: Record<ChecklistCategory, { icon: React.ComponentType<{ className?: string }>; title: string; color: string }> = {
  vibration: { icon: Activity, title: 'A. Vibration Monitoring', color: 'text-blue-400' },
  temperature: { icon: Thermometer, title: 'B. Temperature Monitoring', color: 'text-amber-400' },
  electrical: { icon: Zap, title: 'C. Electrical Monitoring', color: 'text-cyan-400' },
  operational: { icon: Gauge, title: 'D. Operational Monitoring', color: 'text-emerald-400' },
  connectivity: { icon: Network, title: 'E. Connectivity & Data Visibility', color: 'text-indigo-400' },
};

export const MachineHealthChecklistModule: React.FC<MachineHealthChecklistModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  // Checklists map in state (machineId -> MachineChecklistData)
  const [checklistsMap, setChecklistsMap] = useState<Record<string, MachineChecklistData>>(() => {
    const existing = factory.checklists;
    if (existing && Object.keys(existing).length > 0) {
      return existing;
    }
    // Try localStorage
    const saved = localStorage.getItem(`specsmart_checklist_${factory.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to auto-initializing
      }
    }
    // Auto initialize for all machines
    const initialMap: Record<string, MachineChecklistData> = {};
    factory.machines.forEach((m) => {
      initialMap[m.id] = initializeMachineChecklist(m);
    });
    return initialMap;
  });

  // Selected Machine for Detail view
  const [selectedMachineId, setSelectedMachineId] = useState<string>(
    factory.machines[0]?.id || ''
  );

  // Search & Filter state for left machine list
  const [searchQuery, setSearchQuery] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState<'All' | MachineCriticality>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Gaps Only' | 'Assessed'>('All');

  // Expanded categories accordion state for right pane
  const [expandedCategories, setExpandedCategories] = useState<Record<ChecklistCategory, boolean>>({
    vibration: true,
    temperature: true,
    electrical: true,
    operational: true,
    connectivity: true,
  });

  // Dirty state tracking
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if factory changes (e.g. demo factory switched in top bar)
  useEffect(() => {
    const existing = factory.checklists;
    if (existing && Object.keys(existing).length > 0) {
      setChecklistsMap(existing);
    } else {
      const saved = localStorage.getItem(`specsmart_checklist_${factory.id}`);
      if (saved) {
        try {
          setChecklistsMap(JSON.parse(saved));
        } catch (e) {
          const initialMap: Record<string, MachineChecklistData> = {};
          factory.machines.forEach((m) => {
            initialMap[m.id] = initializeMachineChecklist(m);
          });
          setChecklistsMap(initialMap);
        }
      } else {
        const initialMap: Record<string, MachineChecklistData> = {};
        factory.machines.forEach((m) => {
          initialMap[m.id] = initializeMachineChecklist(m);
        });
        setChecklistsMap(initialMap);
      }
    }

    if (factory.machines.length > 0) {
      const stillExists = factory.machines.some(m => m.id === selectedMachineId);
      if (!stillExists) {
        setSelectedMachineId(factory.machines[0].id);
      }
    }
    setIsDirty(false);
  }, [factory.id]);

  // Active selected machine record
  const selectedMachine = useMemo(() => {
    return factory.machines.find(m => m.id === selectedMachineId) || factory.machines[0];
  }, [factory.machines, selectedMachineId]);

  // Active machine checklist data
  const activeChecklist = useMemo(() => {
    if (!selectedMachine) return null;
    if (checklistsMap[selectedMachine.id]) {
      return checklistsMap[selectedMachine.id];
    }
    return initializeMachineChecklist(selectedMachine);
  }, [checklistsMap, selectedMachine]);

  // Visibility score for selected machine
  const activeScore = useMemo(() => {
    if (!selectedMachine) return null;
    return calculateMachineVisibilityScore(selectedMachine, activeChecklist || undefined);
  }, [selectedMachine, activeChecklist]);

  // Rule-based recommendations for selected machine
  const activeRecommendations = useMemo(() => {
    if (!selectedMachine || !activeChecklist) return [];
    return generateMachineRecommendations(selectedMachine, activeChecklist);
  }, [selectedMachine, activeChecklist]);

  // Factory-level overall summary
  const factorySummary = useMemo(() => {
    return calculateFactoryChecklistSummary(factory.machines, checklistsMap);
  }, [factory.machines, checklistsMap]);

  // Filtered Machines in left pane
  const filteredMachines = useMemo(() => {
    return factory.machines.filter((m) => {
      const crit = m.machineCriticality || (m.criticality === 'High' ? 'Critical' : m.criticality === 'Medium' ? 'Important' : 'Standard');
      const matchesCrit = criticalityFilter === 'All' || crit === criticalityFilter;

      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.manufacturer && m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()));

      if (statusFilter === 'Gaps Only') {
        const chk = checklistsMap[m.id];
        const sc = calculateMachineVisibilityScore(m, chk);
        return matchesCrit && matchesSearch && sc.missingItems > 0;
      }
      return matchesCrit && matchesSearch;
    });
  }, [factory.machines, criticalityFilter, searchQuery, statusFilter, checklistsMap]);

  // Toggle Category Accordion
  const toggleCategory = (cat: ChecklistCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Checklist Item State Change Handler
  const handleItemStatusChange = (
    itemId: string,
    newStatus: ChecklistItemStatus,
    naReason?: string
  ) => {
    if (!selectedMachine) return;

    setChecklistsMap(prev => {
      const currentMachineData = prev[selectedMachine.id] || initializeMachineChecklist(selectedMachine);
      const prevItem = currentMachineData.items[itemId] || { status: 'missing' };

      const updatedItems = {
        ...currentMachineData.items,
        [itemId]: {
          ...prevItem,
          status: newStatus,
          naReason: newStatus === 'na' ? (naReason || prevItem.naReason || 'Not applicable for this asset design') : undefined,
        },
      };

      return {
        ...prev,
        [selectedMachine.id]: {
          ...currentMachineData,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        },
      };
    });

    setIsDirty(true);
  };

  // Change NA Reason
  const handleNaReasonChange = (itemId: string, reason: string) => {
    if (!selectedMachine) return;

    setChecklistsMap(prev => {
      const currentMachineData = prev[selectedMachine.id] || initializeMachineChecklist(selectedMachine);
      const prevItem = currentMachineData.items[itemId] || { status: 'na' };

      return {
        ...prev,
        [selectedMachine.id]: {
          ...currentMachineData,
          items: {
            ...currentMachineData.items,
            [itemId]: {
              ...prevItem,
              naReason: reason,
            },
          },
          updatedAt: new Date().toISOString(),
        },
      };
    });

    setIsDirty(true);
  };

  // Change Item Remarks
  const handleItemRemarksChange = (itemId: string, remarks: string) => {
    if (!selectedMachine) return;

    setChecklistsMap(prev => {
      const currentMachineData = prev[selectedMachine.id] || initializeMachineChecklist(selectedMachine);
      const prevItem = currentMachineData.items[itemId] || { status: 'missing' };

      return {
        ...prev,
        [selectedMachine.id]: {
          ...currentMachineData,
          items: {
            ...currentMachineData.items,
            [itemId]: {
              ...prevItem,
              remarks,
            },
          },
          updatedAt: new Date().toISOString(),
        },
      };
    });

    setIsDirty(true);
  };

  // Change General Remarks
  const handleGeneralRemarksChange = (remarks: string) => {
    if (!selectedMachine) return;

    setChecklistsMap(prev => {
      const currentMachineData = prev[selectedMachine.id] || initializeMachineChecklist(selectedMachine);
      return {
        ...prev,
        [selectedMachine.id]: {
          ...currentMachineData,
          generalRemarks: remarks,
          updatedAt: new Date().toISOString(),
        },
      };
    });

    setIsDirty(true);
  };

  // Batch Quick Presets for Selected Machine
  const handleQuickPreset = (preset: 'all_available' | 'reset_default') => {
    if (!selectedMachine) return;

    if (preset === 'reset_default') {
      const fresh = initializeMachineChecklist(selectedMachine);
      setChecklistsMap(prev => ({
        ...prev,
        [selectedMachine.id]: fresh,
      }));
    } else if (preset === 'all_available') {
      const updatedItems: Record<string, any> = {};
      CHECKLIST_ITEMS.forEach(def => {
        const cur = activeChecklist?.items[def.id];
        if (cur?.status === 'na') {
          updatedItems[def.id] = cur;
        } else {
          updatedItems[def.id] = { status: 'available', remarks: cur?.remarks || '' };
        }
      });
      setChecklistsMap(prev => ({
        ...prev,
        [selectedMachine.id]: {
          machineId: selectedMachine.id,
          updatedAt: new Date().toISOString(),
          items: updatedItems,
          generalRemarks: activeChecklist?.generalRemarks || '',
        },
      }));
    }
    setIsDirty(true);
  };

  // Save Checklist Progress & Synchronize Dashboard
  const handleSaveChecklist = () => {
    // 1. Save to localStorage
    localStorage.setItem(`specsmart_checklist_${factory.id}`, JSON.stringify(checklistsMap));

    // 2. Compute dynamic metrics for the factory
    const newSummary = calculateFactoryChecklistSummary(factory.machines, checklistsMap);

    // Monitoring coverage is the percentage of applicable parameters that are available across the factory
    const newCoveragePct = newSummary.totalApplicableParameters > 0
      ? Math.round((newSummary.totalAvailableParameters / newSummary.totalApplicableParameters) * 100)
      : factory.metrics.monitoringCoveragePct;

    // Readiness score aligns with average visibility percentage adjusted for critical bottleneck gaps
    const criticalDeduction = newSummary.criticalWithGapsCount * 3;
    const newReadinessScore = Math.max(15, Math.min(98, newSummary.averageVisibilityPct - criticalDeduction));

    let newGrade: FactoryProfile['metrics']['pcmReadinessGrade'] = 'Foundational';
    if (newReadinessScore >= 80) newGrade = 'Predictive Leader';
    else if (newReadinessScore >= 60) newGrade = 'Operational';
    else if (newReadinessScore >= 35) newGrade = 'Emerging';
    else newGrade = 'Foundational';

    const updatedFactory: FactoryProfile = {
      ...factory,
      checklists: checklistsMap,
      checklistSavedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST Today',
      metrics: {
        ...factory.metrics,
        monitoringCoveragePct: newCoveragePct,
        pcmReadinessScore: newReadinessScore,
        pcmReadinessGrade: newGrade,
      },
    };

    onUpdateFactory(updatedFactory);
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Discard changes
  const handleDiscard = () => {
    const existing = factory.checklists;
    if (existing) {
      setChecklistsMap(existing);
    } else {
      const saved = localStorage.getItem(`specsmart_checklist_${factory.id}`);
      if (saved) {
        try {
          setChecklistsMap(JSON.parse(saved));
        } catch (e) {
          // keep
        }
      }
    }
    setIsDirty(false);
  };

  if (!selectedMachine) {
    return (
      <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
        <Cpu className="h-12 w-12 text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-white">No Machines in Line Inventory</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please add machines to this production line in the Factory Assessment module before assessing machine health visibility.
        </p>
        <button
          onClick={() => onNavigate('factory-assessment')}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
        >
          Go to Factory Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header & Summary Statistics Cards */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Machine Health Visibility Checklist
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {factory.plantCode}
              </span>
              {factory.checklistSavedAt && (
                <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                  · Last saved: {factory.checklistSavedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Audit physical condition monitoring telemetry for all {factory.machines.length} line assets across vibration, thermal, electrical, operational, and edge connectivity layers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Discard unsaved changes"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveChecklist}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Save & Sync Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('roi-calculator')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: ROI & Risk Calculator</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* 5 Factory-Level KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Card 1: Total Assessed */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Total Machines
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {factorySummary.totalMachines}
              </span>
              <span className="text-[11px] text-slate-400">assets</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              100% in line inventory
            </div>
          </div>

          {/* Card 2: Fully Assessed */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Audited Parameters
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                {factorySummary.totalAvailableParameters}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                / {factorySummary.totalApplicableParameters}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-cyan-400 font-medium">
              Active physical telemetry
            </div>
          </div>

          {/* Card 3: Machines with Critical Monitoring Gaps */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-rose-400 font-medium block">
              Critical Asset Gaps
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {factorySummary.criticalWithGapsCount}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                / {factorySummary.criticalMachinesCount} critical
              </span>
            </div>
            <div className="mt-1 text-[11px] text-rose-300">
              Score &lt; 70% on bottlenecks
            </div>
          </div>

          {/* Card 4: Factory Visibility Score */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Average Visibility
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {factorySummary.averageVisibilityPct}%
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                factorySummary.overallCategory === 'Strong Visibility' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                factorySummary.overallCategory === 'Good Visibility' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                factorySummary.overallCategory === 'Partial Visibility' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}>
                {factorySummary.overallCategory}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Line baseline score
            </div>
          </div>

          {/* Card 5: Missing Monitoring Parameters */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium block">
              Total Missing Sensors
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {factorySummary.totalMissingParameters}
              </span>
              <span className="text-[11px] text-slate-400">gaps</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-300">
              Sensor tender scope
            </div>
          </div>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Checklist data saved! Updated monitoring coverage ({factorySummary.averageVisibilityPct}%) and predictive maintenance readiness have synchronized with the dashboard.
            </span>
          </div>
        )}
      </div>

      {/* 2. Main Master-Detail Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Cols 1-4): Machine Selection Master List */}
        <div className="lg:col-span-4 bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-4 space-y-3.5 sticky top-20 max-h-[85vh] flex flex-col">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white tracking-tight uppercase">
                  Line Assets ({factory.machines.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Click to Assess
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mt-2.5">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tag, name, manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Criticality Filters */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 mt-2">
              {(['All', 'Critical', 'Important', 'Standard'] as const).map((crit) => (
                <button
                  key={crit}
                  onClick={() => setCriticalityFilter(crit)}
                  className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-colors ${
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

          {/* Machine List Items */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[58vh]">
            {filteredMachines.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No machines match the selected filter.
              </div>
            ) : (
              filteredMachines.map((m) => {
                const isSelected = m.id === selectedMachineId;
                const chk = checklistsMap[m.id];
                const score = calculateMachineVisibilityScore(m, chk);
                const crit = m.machineCriticality || (m.criticality === 'High' ? 'Critical' : m.criticality === 'Medium' ? 'Important' : 'Standard');
                const isCrit = crit === 'Critical';
                const isImp = crit === 'Important';

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMachineId(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/50 shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {m.tag}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                          isCrit ? 'bg-rose-950/40 text-rose-300 border-rose-800' :
                          isImp ? 'bg-amber-950/40 text-amber-300 border-amber-800' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {crit}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white truncate mt-1">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {m.manufacturer ? `${m.manufacturer} · ` : ''}{m.type}
                      </div>

                      {/* Mini Score Bar */}
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">
                          Visibility: <strong className="text-white">{score.scorePct}%</strong>
                        </span>
                        {score.missingItems > 0 ? (
                          <span className="text-rose-400 font-mono flex items-center gap-1 font-semibold">
                            <AlertTriangle className="h-3 w-3" />
                            {score.missingItems} gaps
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                            <Check className="h-3 w-3" />
                            Complete
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score.scorePct >= 80 ? 'bg-emerald-400' :
                            score.scorePct >= 50 ? 'bg-cyan-400' :
                            score.scorePct >= 30 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score.scorePct}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform mt-1 ${
                      isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Cols 5-12): Selected Machine Checklist Detail */}
        <div className="lg:col-span-8 space-y-5">
          {/* Machine Header & Visibility Score Card */}
          <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/60">
                    {selectedMachine.tag}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedMachine.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedMachine.criticality === 'High' || selectedMachine.machineCriticality === 'Critical'
                      ? 'bg-rose-950/50 text-rose-300 border-rose-800'
                      : 'bg-amber-950/50 text-amber-300 border-amber-800'
                  }`}>
                    {selectedMachine.machineCriticality || selectedMachine.criticality}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                  <span>Type: <strong>{selectedMachine.type}</strong></span>
                  <span>·</span>
                  <span>OEM: <strong>{selectedMachine.manufacturer || 'OEM Specified'}</strong></span>
                  <span>·</span>
                  <span>Rated Power: <strong>{selectedMachine.ratedPowerKw || 30} kW</strong></span>
                  <span>·</span>
                  <span>Hours: <strong>{(selectedMachine.operatingHours || 8000).toLocaleString()}h</strong></span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('all_available')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                >
                  Mark Available
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('reset_default')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Visibility Score Formula & Metrics */}
            {activeScore && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="sm:col-span-5 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-white tabular-nums">
                      {activeScore.scorePct}%
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      activeScore.category === 'Strong Visibility' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      activeScore.category === 'Good Visibility' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                      activeScore.category === 'Partial Visibility' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                      'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {activeScore.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Score = ({activeScore.availableItems} Available / {activeScore.applicableItems} Applicable) × 100
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        activeScore.scorePct >= 80 ? 'bg-emerald-400' :
                        activeScore.scorePct >= 50 ? 'bg-cyan-400' :
                        activeScore.scorePct >= 30 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${activeScore.scorePct}%` }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-7 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                    <div className="text-emerald-400 font-bold font-mono text-base tabular-nums">
                      {activeScore.availableItems}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Available</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-800/40">
                    <div className="text-rose-400 font-bold font-mono text-base tabular-nums">
                      {activeScore.missingItems}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Missing Gaps</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <div className="text-slate-300 font-bold font-mono text-base tabular-nums">
                      {activeScore.naItems}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Not Applicable</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5 Collapsible Checklist Categories */}
          {(['vibration', 'temperature', 'electrical', 'operational', 'connectivity'] as ChecklistCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const isExpanded = expandedCategories[cat];
            const catItems = CHECKLIST_ITEMS.filter(item => item.category === cat);

            // Compute sub-counts for this category
            const availableCount = catItems.filter(item => activeChecklist?.items[item.id]?.status === 'available').length;
            const missingCount = catItems.filter(item => activeChecklist?.items[item.id]?.status === 'missing').length;
            const naCount = catItems.filter(item => activeChecklist?.items[item.id]?.status === 'na').length;

            return (
              <div key={cat} className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="w-full px-5 py-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors flex items-center justify-between border-b border-slate-800/80"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {meta.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({availableCount} / {catItems.length - naCount} Monitored)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {missingCount > 0 && (
                      <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60 font-mono">
                        {missingCount} Missing
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="divide-y divide-slate-800/60 p-1">
                    {catItems.map((def) => {
                      const itemState = activeChecklist?.items[def.id] || { status: 'missing' };
                      const status = itemState.status;

                      return (
                        <div key={def.id} className="p-4 space-y-2 hover:bg-slate-900/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="text-xs font-semibold text-white">
                                {def.label}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {def.description}
                              </p>
                            </div>

                            {/* 3 Interaction Segmented Buttons: Available / Missing / N/A */}
                            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleItemStatusChange(def.id, 'available')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                                  status === 'available'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Available</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleItemStatusChange(def.id, 'missing')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                                  status === 'missing'
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                <XCircle className="h-3 w-3" />
                                <span>Missing</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleItemStatusChange(def.id, 'na')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                                  status === 'na'
                                    ? 'bg-slate-700 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                <MinusCircle className="h-3 w-3" />
                                <span>N/A</span>
                              </button>
                            </div>
                          </div>

                          {/* If Status is N/A: Prompt for Reason */}
                          {status === 'na' && (
                            <div className="pt-2 flex items-center gap-2 text-xs">
                              <span className="text-slate-400 text-[11px] shrink-0 font-medium">N/A Reason:</span>
                              <input
                                type="text"
                                value={itemState.naReason || ''}
                                onChange={(e) => handleNaReasonChange(def.id, e.target.value)}
                                placeholder="e.g. Asset operates without reduction gearbox / pure static chamber"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          )}

                          {/* Remarks field */}
                          <div className="pt-1">
                            <input
                              type="text"
                              value={itemState.remarks || ''}
                              onChange={(e) => handleItemRemarksChange(def.id, e.target.value)}
                              placeholder="Optional engineer notes or tag standard (e.g. IO-Link Ch 2, 4-20mA to PLC)..."
                              className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Machine General Remarks */}
          <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Machine Health Assessment Remarks & Vendor Tender Notes ({selectedMachine.tag})
            </label>
            <textarea
              rows={2}
              value={activeChecklist?.generalRemarks || ''}
              onChange={(e) => handleGeneralRemarksChange(e.target.value)}
              placeholder="Log specific requirements, mounting constraints, or environmental factors..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* 3. Rule-Based Recommendations Section */}
          <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Rule-Based Predictive Maintenance Recommendations
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Asset: {selectedMachine.tag}
              </span>
            </div>

            {activeRecommendations.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero high-priority sensor gaps detected on this asset! All vital telemetry layers are covered.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      rec.priority === 'Critical'
                        ? 'bg-rose-950/20 border-rose-800/60'
                        : rec.priority === 'High'
                        ? 'bg-amber-950/20 border-amber-800/60'
                        : 'bg-blue-950/20 border-blue-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          rec.priority === 'Critical' ? 'bg-rose-900/60 text-rose-300 border-rose-700' :
                          rec.priority === 'High' ? 'bg-amber-900/60 text-amber-300 border-amber-700' :
                          'bg-blue-900/60 text-blue-300 border-blue-700'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <span>{rec.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        {rec.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Why:</strong> {rec.whyExplanation}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-300 flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Recommended Tender Action:</strong> {rec.actionRequired}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Save Bar if changes were made */}
      {isDirty && (
        <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-slate-900/95 border border-blue-500/50 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>You have unsaved checklist modifications. Save to synchronize dashboard readiness.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveChecklist}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save & Sync Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
