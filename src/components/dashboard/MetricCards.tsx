import React from 'react';
import { 
  Cpu, 
  AlertOctagon, 
  Clock, 
  IndianRupee, 
  Radio, 
  Activity, 
  TrendingDown, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { FactoryProfile, NavigationTab } from '../../types';
import { formatINR } from '../../data/mockFactoryData';

interface MetricCardsProps {
  factory: FactoryProfile;
  onNavigate: (tab: NavigationTab) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ factory, onNavigate }) => {
  const { metrics, machines } = factory;
  const criticalPct = Math.round((metrics.criticalMachines / metrics.totalMachines) * 100);
  const monitoredMachinesCount = Math.round((metrics.monitoringCoveragePct / 100) * metrics.totalMachines);
  
  // Grade color mapping
  const gradeColor = {
    'Foundational': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'Emerging': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Operational': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Predictive Leader': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }[metrics.pcmReadinessGrade] || 'text-blue-400 bg-blue-400/10 border-blue-400/20';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Total Machines */}
      <div 
        onClick={() => onNavigate('machine-health')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Machines</span>
          <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {metrics.totalMachines}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{monitoredMachinesCount} connected</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{metrics.totalMachines - monitoredMachinesCount} dark assets</span>
          </div>
        </div>
      </div>

      {/* 2. Critical Machines */}
      <div 
        onClick={() => onNavigate('machine-health')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-rose-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Critical Machines</span>
          <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <AlertOctagon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-rose-300 font-mono tabular-nums">
            {metrics.criticalMachines}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{criticalPct}% of line capacity</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-rose-400 font-medium">Bottlenecks</span>
          </div>
        </div>
      </div>

      {/* 3. Downtime Hours */}
      <div 
        onClick={() => onNavigate('roi-calculator')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-amber-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Downtime Hours</span>
          <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {metrics.monthlyDowntimeHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs/mo</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingDown className="h-3 w-3" />
            <span>-3.5% vs previous cycle</span>
          </div>
        </div>
      </div>

      {/* 4. Estimated Downtime Cost */}
      <div 
        onClick={() => onNavigate('roi-calculator')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Downtime Cost</span>
          <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <IndianRupee className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {formatINR(metrics.estimatedMonthlyDowntimeCostINR)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-mono">@{formatINR(metrics.hourlyDowntimeCostINR)}/hr loss</span>
          </div>
        </div>
      </div>

      {/* 5. Monitoring Coverage */}
      <div 
        onClick={() => onNavigate('architecture-designer')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Monitoring Coverage</span>
          <div className="h-7 w-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Radio className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {metrics.monitoringCoveragePct.toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {monitoredMachinesCount}/{metrics.totalMachines}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.monitoringCoveragePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6. Predictive Maintenance Readiness */}
      <div 
        onClick={() => onNavigate('factory-assessment')}
        className="group bg-[#0B132B]/80 hover:bg-[#0E1838] border border-slate-800/90 hover:border-emerald-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">PdM Readiness</span>
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {metrics.pcmReadinessScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${gradeColor}`}>
              {metrics.pcmReadinessGrade}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};
