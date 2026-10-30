import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle, 
  Check, 
  Activity, 
  FileCheck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { MachineRecord, CriticalityLevel, NavigationTab } from '../../types';

interface QuickMachineListProps {
  machines: MachineRecord[];
  onNavigate: (tab: NavigationTab) => void;
}

export const QuickMachineList: React.FC<QuickMachineListProps> = ({
  machines,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState<'All' | CriticalityLevel>('All');

  const filteredMachines = machines.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCriticality = criticalityFilter === 'All' || m.criticality === criticalityFilter;
    return matchesSearch && matchesCriticality;
  });

  return (
    <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Production Line Asset Condition & Criticality Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key physical parameters, current monitoring telemetry tier, and failure modes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tag, machine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
            />
          </div>

          {/* Criticality Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            {(['All', 'High', 'Medium'] as const).map((crit) => (
              <button
                key={crit}
                onClick={() => setCriticalityFilter(crit)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  criticalityFilter === crit
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {crit === 'All' ? 'All' : `${crit} Crit`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High Density Machine Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th className="py-2.5 px-3">Asset Tag</th>
              <th className="py-2.5 px-3">Machine / Station Name</th>
              <th className="py-2.5 px-3">Criticality</th>
              <th className="py-2.5 px-3 text-right">Vibration (RMS)</th>
              <th className="py-2.5 px-3 text-right">Temp (°C)</th>
              <th className="py-2.5 px-3 text-right">Current (A)</th>
              <th className="py-2.5 px-3">Monitoring Level</th>
              <th className="py-2.5 px-3">Failure Risk Category</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredMachines.map((m) => {
              const isVibCritical = m.vibrationMmS >= 4.5;
              return (
                <tr 
                  key={m.id}
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => onNavigate('machine-health')}
                >
                  {/* Tag */}
                  <td className="py-3 px-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                    {m.tag}
                  </td>

                  {/* Name & Type */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {m.manufacturer ? `${m.manufacturer} · ` : ''}{m.type}
                    </div>
                  </td>

                  {/* Criticality */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      (m.machineCriticality === 'Critical' || m.criticality === 'High')
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : (m.machineCriticality === 'Important' || m.criticality === 'Medium')
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {m.machineCriticality || m.criticality}
                    </span>
                  </td>

                  {/* Vibration */}
                  <td className={`py-3 px-3 text-right font-mono tabular-nums font-semibold ${
                    isVibCritical ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {m.vibrationMmS.toFixed(1)} <span className="text-[10px] text-slate-500">mm/s</span>
                  </td>

                  {/* Temp */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    {m.tempC.toFixed(1)} <span className="text-[10px] text-slate-500">°C</span>
                  </td>

                  {/* Current */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    {m.currentA.toFixed(1)} <span className="text-[10px] text-slate-500">A</span>
                  </td>

                  {/* Monitoring Level */}
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-300 font-medium">
                      {m.monitoringLevel}
                    </span>
                  </td>

                  {/* Failure Risk */}
                  <td className="py-3 px-3 text-[11px] text-slate-400">
                    {m.failureRiskCategory}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      m.status === 'Critical'
                        ? 'bg-rose-950/40 text-rose-400 border-rose-800'
                        : m.status === 'Warning'
                        ? 'bg-amber-950/40 text-amber-400 border-amber-800'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        m.status === 'Critical' ? 'bg-rose-400' : m.status === 'Warning' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      {m.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <span>Showing {filteredMachines.length} of {machines.length} line machines</span>
        <button
          onClick={() => onNavigate('specification-builder')}
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>Auto-Generate Vendor Spec Annexure (Tag List)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
