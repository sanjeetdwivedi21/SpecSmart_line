import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ShieldAlert, 
  ExternalLink,
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { CriticalAlert, AlertSeverity, NavigationTab } from '../../types';
import { formatINR } from '../../data/mockFactoryData';

interface CriticalAlertsProps {
  alerts: CriticalAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CriticalAlerts: React.FC<CriticalAlertsProps> = ({
  alerts,
  onAcknowledgeAlert,
  onNavigate,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | AlertSeverity>('All');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'All') return true;
    return alert.severity === filterSeverity;
  });

  const unackCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Active Anomaly & Critical Threshold Alerts
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time physical parameter violations requiring spec-level sensor requirements
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['All', 'Critical', 'Warning'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="mt-3 space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            All parameters nominal in this filter category.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-700/80'
                    : 'bg-amber-950/20 border-amber-800/50 hover:border-amber-700/80'
                } ${alert.acknowledged ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div
                      className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white text-xs">
                          {alert.machineName}
                        </span>
                        <span className="font-mono text-[11px] text-blue-400 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-900/60">
                          {alert.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {alert.timestamp}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 mt-1 font-medium">
                        {alert.parameter}: <strong className="text-white">{alert.value}</strong>
                        <span className="text-slate-400 font-normal"> (ISO Standard Limit: {alert.threshold})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {alert.affectedProductionLossINR > 0 && (
                      <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40 whitespace-nowrap">
                        Risk: {formatINR(alert.affectedProductionLossINR)}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      {!alert.acknowledged ? (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                          title="Acknowledge this condition alert"
                        >
                          <Check className="h-3 w-3" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-400" />
                          Acked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link to Machine Health Checklist */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          {unackCount} pending response · Real-time SCADA/Edge polling
        </span>
        <button
          onClick={() => onNavigate('machine-health')}
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Open Full Checklist</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
