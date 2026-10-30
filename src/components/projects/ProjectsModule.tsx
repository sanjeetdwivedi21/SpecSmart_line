import React from 'react';
import { 
  FolderKanban, 
  Plus, 
  MapPin, 
  Cpu, 
  Calendar, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Download
} from 'lucide-react';
import { FactoryProfile } from '../../types';
import { DEMO_FACTORIES, formatINR } from '../../data/mockFactoryData';

interface ProjectsModuleProps {
  currentFactory: FactoryProfile;
  onSelectFactory: (factory: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
  onCreateNewPlan: () => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  currentFactory,
  onSelectFactory,
  onNavigate,
  onCreateNewPlan,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FolderKanban className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Line Planning & Specification Projects
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Portfolio of manufacturing lines under condition monitoring audit, ROI justification, and vendor tender preparation.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewPlan}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Line Plan</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_FACTORIES.map((fac) => {
          const isSelected = fac.id === currentFactory.id;
          const displayFac = isSelected ? currentFactory : fac;

          return (
            <div
              key={fac.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500/60 shadow-xl'
                  : 'bg-[#0B132B]/80 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {displayFac.plantCode}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Target: {displayFac.targetGoLive}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {displayFac.lineName}
                </h3>
                <div className="text-xs text-slate-300 mt-0.5">
                  {displayFac.name}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <span>{displayFac.city}, {displayFac.state}</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-mono">{displayFac.sector}</span>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Assets</span>
                  <strong className="text-white font-mono">{displayFac.machines.length} machines</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Downtime Loss</span>
                  <strong className="text-amber-400 font-mono">{formatINR(displayFac.metrics.estimatedMonthlyDowntimeCostINR)}/mo</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Savings</span>
                  <strong className="text-emerald-400 font-mono">{formatINR(displayFac.metrics.potentialAnnualSavingsINR || 11200000)}/yr</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                {isSelected ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Active In Workspace</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectFactory(fac)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Open Line Workspace
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!isSelected) onSelectFactory(fac);
                    onNavigate('specification-builder');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Spec</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
