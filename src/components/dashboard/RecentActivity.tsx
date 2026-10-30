import React from 'react';
import { 
  FileText, 
  Calculator, 
  Radio, 
  AlertCircle, 
  ClipboardCheck, 
  History, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { ActivityItem, NavigationTab } from '../../types';

interface RecentActivityProps {
  activities: ActivityItem[];
  onNavigate: (tab: NavigationTab) => void;
}

const TYPE_CONFIG = {
  spec_updated: {
    icon: FileText,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    targetTab: 'specification-builder' as NavigationTab,
  },
  roi_calculated: {
    icon: Calculator,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    targetTab: 'roi-calculator' as NavigationTab,
  },
  sensor_added: {
    icon: Radio,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    targetTab: 'machine-health' as NavigationTab,
  },
  alert_logged: {
    icon: AlertCircle,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    targetTab: 'procurement-advisor' as NavigationTab,
  },
  audit_completed: {
    icon: ClipboardCheck,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    targetTab: 'factory-assessment' as NavigationTab,
  },
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onNavigate,
}) => {
  return (
    <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Line Planning Activity Stream
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Audit Trail
        </span>
      </div>

      {/* Activities Timeline */}
      <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {activities.map((act) => {
          const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.spec_updated;
          const Icon = cfg.icon;

          return (
            <div
              key={act.id}
              onClick={() => onNavigate(cfg.targetTab)}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/70 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-2.5">
                <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center border ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white text-xs group-hover:text-blue-400 transition-colors truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium">{act.user}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {act.detail}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Logged in Line Specification Audit Ledger</span>
        <button
          onClick={() => onNavigate('projects')}
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All Specs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
