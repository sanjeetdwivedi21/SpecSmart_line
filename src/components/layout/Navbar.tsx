import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Factory, 
  ChevronDown, 
  Check, 
  AlertTriangle, 
  Info, 
  User, 
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { NavigationTab, FactoryProfile, CriticalAlert } from '../../types';
import { DEMO_FACTORIES } from '../../data/mockFactoryData';

interface NavbarProps {
  currentTab: NavigationTab;
  currentFactory: FactoryProfile;
  onSelectFactory: (factory: FactoryProfile) => void;
  onCreateNewPlan: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
}

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string }> = {
  'overview': { title: 'Executive Overview', subtitle: 'Live line condition, financial downtime exposure & PCM readiness' },
  'factory-assessment': { title: 'Factory Assessment', subtitle: 'Current line profile, operating shifts & operational downtime audit' },
  'machine-health': { title: 'Machine Health Checklist', subtitle: 'Critical asset parameters, sensor inventory & failure mode taxonomy' },
  'roi-calculator': { title: 'ROI & Risk Calculator', subtitle: 'Financial justification, downtime mitigation & payback horizon' },
  'architecture-designer': { title: 'Architecture Designer', subtitle: 'Industrial edge-to-cloud telemetry & protocol flow canvas' },
  'procurement-advisor': { title: 'Smart Procurement Advisor', subtitle: 'Contextual sensor selection & vendor specification gap auditor' },
  'specification-builder': { title: 'Specification Builder', subtitle: 'Standardized vendor-ready machine health tender documentation' },
  'alert-standards': { title: 'Alert & Monitoring Standards', subtitle: 'ISO 10816 vibration guidelines, sampling rates & escalation SLA matrix' },
  'projects': { title: 'Line Planning Projects', subtitle: 'Enterprise manufacturing lines under design and procurement review' },
  'settings': { title: 'Plant & System Settings', subtitle: 'Sensor engineering thresholds, currency standards & ERP integration hooks' },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentFactory,
  onSelectFactory,
  onCreateNewPlan,
  onSelectTab,
  onAcknowledgeAlert,
}) => {
  const [factoryMenuOpen, setFactoryMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const factoryDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (factoryDropdownRef.current && !factoryDropdownRef.current.contains(event.target as Node)) {
        setFactoryMenuOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = currentFactory.alerts.filter((a) => !a.acknowledged);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#090F1E]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Contextual Title & Breadcrumbs */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hover:text-slate-200 transition-colors">SpecSmart</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-slate-300 truncate font-medium">{currentFactory.name}</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-blue-400 font-semibold">{TAB_TITLES[currentTab]?.title || 'Overview'}</span>
        </div>
        <h1 className="text-base md:text-lg font-bold text-white tracking-tight truncate">
          {TAB_TITLES[currentTab]?.title || 'Executive Overview'}
        </h1>
      </div>

      {/* Zone 2 & 3: Controls, Switcher, Notifications & CTA */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Load Demo Factory Selector */}
        <div className="relative" ref={factoryDropdownRef}>
          <button
            onClick={() => setFactoryMenuOpen(!factoryMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm"
            title="Load different demo Indian manufacturing plants"
          >
            <Factory className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline font-mono text-slate-400">{currentFactory.plantCode}</span>
            <span className="hidden lg:inline text-slate-300 font-medium max-w-[140px] truncate">
              {currentFactory.city}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {factoryMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0B132B] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200">Load Demo Indian Factory</div>
                <div className="text-[11px] text-slate-400">
                  Select a realistic manufacturing setup tailored for Indian SMEs
                </div>
              </div>
              <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
                {DEMO_FACTORIES.map((fac) => {
                  const isSelected = fac.id === currentFactory.id;
                  return (
                    <button
                      key={fac.id}
                      onClick={() => {
                        onSelectFactory(fac);
                        setFactoryMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-100">
                          <span className="truncate">{fac.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-blue-400/90 truncate mt-0.5">
                          {fac.lineName}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {fac.city}, {fac.state}
                          </span>
                          <span>·</span>
                          <span>{fac.metrics.totalMachines} Machines</span>
                          <span>·</span>
                          <span>₹{(fac.metrics.estimatedMonthlyDowntimeCostINR / 100000).toFixed(1)}L/mo loss</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60 transition-colors"
            title="Line Machine Alerts"
            aria-label="View notifications and machine alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0B132B] border border-slate-700/80 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Critical Machine Alerts</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {unreadAlerts.length} unacknowledged on {currentFactory.lineName}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectTab('machine-health');
                    setNotificationsOpen(false);
                  }}
                  className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
                >
                  View Checklist
                </button>
              </div>

              <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto">
                {currentFactory.alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active critical alerts on this line.
                  </div>
                ) : (
                  currentFactory.alerts.map((alert: CriticalAlert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs transition-colors ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-950/20 border-rose-800/40 text-rose-100'
                          : alert.severity === 'Warning'
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {alert.severity === 'Critical' ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                          ) : (
                            <Info className="h-3.5 w-3.5 text-amber-400" />
                          )}
                          {alert.machineName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">{alert.message}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">
                          Value: <strong className="text-white">{alert.value}</strong> (Limit: {alert.threshold})
                        </span>
                        {!alert.acknowledged && onAcknowledgeAlert && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: Create New Line Plan */}
        <button
          onClick={onCreateNewPlan}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create New Line Plan</span>
        </button>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            title="User Profile"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/80 flex items-center justify-center text-xs font-bold text-blue-400">
              RS
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">Rajesh Sharma</span>
              <span className="text-[10px] text-slate-400 leading-tight">Chief Plant Head</span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0B132B] border border-slate-700/80 shadow-2xl p-3 z-50 text-xs">
              <div className="pb-2 border-b border-slate-800">
                <div className="font-semibold text-white">Rajesh Sharma</div>
                <div className="text-[11px] text-slate-400">Head of Operations & Digital Manufacturing</div>
                <div className="mt-1 text-[10px] text-blue-400 font-mono">TCS Hackathon 2026 Edition</div>
              </div>
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  Factory Configuration
                </button>
                <button
                  onClick={() => {
                    onSelectTab('projects');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  My Line Planning Specs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
