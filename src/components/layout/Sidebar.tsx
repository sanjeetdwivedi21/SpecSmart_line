import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CheckSquare, 
  Calculator, 
  Network, 
  Sparkles, 
  FileText, 
  BellRing, 
  FolderKanban, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { NavigationTab, FactoryProfile } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  factory: FactoryProfile;
}

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  factory,
}) => {
  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'factory-assessment', label: 'Factory Assessment', icon: Building2 },
    { id: 'machine-health', label: 'Machine Health Checklist', icon: CheckSquare, badge: `${factory.metrics.criticalMachines} Critical` },
    { id: 'roi-calculator', label: 'ROI & Risk Calculator', icon: Calculator, badge: 'Payback' },
    { id: 'architecture-designer', label: 'Architecture Designer', icon: Network },
    { id: 'procurement-advisor', label: 'Smart Procurement Advisor', icon: Sparkles },
    { id: 'specification-builder', label: 'Specification Builder', icon: FileText },
    { id: 'alert-standards', label: 'Alert & Monitoring Standards', icon: BellRing },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const unacknowledgedAlerts = factory.alerts.filter(a => !a.acknowledged).length;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#090F1E] border-r border-slate-800/80 transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="h-full w-full rounded-[10px] bg-[#090F1E] flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-white truncate">
                SpecSmart
              </span>
              <span className="text-[11px] font-medium text-blue-400/90 tracking-wide uppercase">
                Line Planner
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Industrial Modules
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && !isActive && (
                <span className="text-[11px] font-medium text-slate-400 shrink-0">
                  {item.badge}
                </span>
              )}
              {collapsed && item.id === 'machine-health' && unacknowledgedAlerts > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#090F1E]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current Factory Footer Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070C18]">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Active Plant</span>
              <span className="font-mono text-[11px] text-blue-400 font-medium">{factory.plantCode}</span>
            </div>
            <div className="text-xs text-white font-medium truncate" title={factory.name}>
              {factory.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate" title={factory.lineName}>
              {factory.lineName}
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                {unacknowledgedAlerts} active alerts
              </span>
              <span className="font-mono tabular-nums text-slate-300">
                {factory.metrics.pcmReadinessScore}% PCM
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-1" title={`${factory.name} (${factory.plantCode})`}>
            <div className="h-8 w-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 font-mono text-xs font-semibold">
              {factory.plantCode.split('-')[1] || 'IND'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
