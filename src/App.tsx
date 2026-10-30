import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MetricCards } from './components/dashboard/MetricCards';
import { ChartsSection } from './components/dashboard/ChartsSection';
import { CriticalAlerts } from './components/dashboard/CriticalAlerts';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { QuickMachineList } from './components/dashboard/QuickMachineList';
import { CreateLinePlanModal } from './components/modals/CreateLinePlanModal';
import { ModulePlaceholderView } from './components/views/ModulePlaceholderView';
import { FactoryAssessmentModule } from './components/assessment/FactoryAssessmentModule';
import { MachineHealthChecklistModule } from './components/checklist/MachineHealthChecklistModule';
import { RoiCalculatorModule } from './components/calculator/RoiCalculatorModule';
import { ArchitectureDesignerModule } from './components/architecture/ArchitectureDesignerModule';
import { ProcurementAdvisorModule } from './components/procurement/ProcurementAdvisorModule';
import { SpecificationBuilderModule } from './components/specification/SpecificationBuilderModule';
import { AlertStandardsModule } from './components/standards/AlertStandardsModule';
import { ProjectsModule } from './components/projects/ProjectsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { DEMO_FACTORIES } from './data/mockFactoryData';
import { FactoryProfile, NavigationTab } from './types';
import { 
  Plus, 
  Factory, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [factory, setFactory] = useState<FactoryProfile>(DEMO_FACTORIES[0]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectFactory = (newFactory: FactoryProfile) => {
    setFactory(newFactory);
    showToast(`Loaded ${newFactory.name} (${newFactory.city}, ${newFactory.state})`);
  };

  const handleCreatePlan = (newFactory: FactoryProfile) => {
    setFactory(newFactory);
    setCurrentTab('overview');
    showToast(`New Line Plan Created: ${newFactory.lineName}`);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setFactory((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    }));
    showToast('Alert acknowledged and logged in line maintenance record.');
  };

  return (
    <div className="min-h-screen bg-[#080E1E] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/50 text-white shadow-2xl text-xs animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        factory={factory}
      />

      {/* Main Container with dynamic margin for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 min-w-0 ${
          sidebarCollapsed ? 'pl-20' : 'pl-0 sm:pl-72'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          currentFactory={factory}
          onSelectFactory={handleSelectFactory}
          onCreateNewPlan={() => setCreateModalOpen(true)}
          onSelectTab={setCurrentTab}
          onAcknowledgeAlert={handleAcknowledgeAlert}
        />

        {/* Main Body Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-7 max-w-[1720px] w-full mx-auto space-y-6">
          {currentTab === 'overview' ? (
            <>
              {/* Executive Line Planning Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-[#0A1430] border border-blue-500/20 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{factory.plantCode}</span>
                    <span className="text-slate-600">·</span>
                    <span>{factory.sector}</span>
                    <span className="text-slate-600">·</span>
                    <span>Target Go-Live: {factory.targetGoLive}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {factory.lineName}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    Treating machine health visibility as non-negotiable. Embedding standardized vibration, thermal, and current telemetry into equipment vendor tenders before PO issuance.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setCurrentTab('roi-calculator')}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                    <span>View ROI Justification</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('specification-builder')}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Vendor Spec Package</span>
                  </button>
                </div>
              </div>

              {/* 1. Metric Cards (6 KPI Cards) */}
              <MetricCards factory={factory} onNavigate={setCurrentTab} />

              {/* 2. Charts Section (Recharts) */}
              <ChartsSection factory={factory} />

              {/* 3. Alerts & Activity 2-Column Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <CriticalAlerts
                    alerts={factory.alerts}
                    onAcknowledgeAlert={handleAcknowledgeAlert}
                    onNavigate={setCurrentTab}
                  />
                </div>
                <div className="lg:col-span-5">
                  <RecentActivity
                    activities={factory.recentActivities}
                    onNavigate={setCurrentTab}
                  />
                </div>
              </div>

              {/* 4. Machine Inventory Matrix */}
              <QuickMachineList
                machines={factory.machines}
                onNavigate={setCurrentTab}
              />
            </>
          ) : currentTab === 'factory-assessment' ? (
            <FactoryAssessmentModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`Factory Assessment saved for ${updated.name}`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'machine-health' ? (
            <MachineHealthChecklistModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`Checklist saved! Dashboard coverage & readiness synced.`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'roi-calculator' ? (
            <RoiCalculatorModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`ROI scenario saved & pushed to specification.`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'architecture-designer' ? (
            <ArchitectureDesignerModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`Architecture blueprint saved.`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'procurement-advisor' ? (
            <ProcurementAdvisorModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`Procurement BOM applied to tender spec.`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'specification-builder' ? (
            <SpecificationBuilderModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'alert-standards' ? (
            <AlertStandardsModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
                showToast(`Alert standards and thresholds saved.`);
              }}
              onNavigate={setCurrentTab}
            />
          ) : currentTab === 'projects' ? (
            <ProjectsModule
              currentFactory={factory}
              onSelectFactory={handleSelectFactory}
              onNavigate={setCurrentTab}
              onCreateNewPlan={() => setCreateModalOpen(true)}
            />
          ) : currentTab === 'settings' ? (
            <SettingsModule
              factory={factory}
              onUpdateFactory={(updated) => {
                setFactory(updated);
              }}
              onNavigate={setCurrentTab}
            />
          ) : (
            <ModulePlaceholderView
              tab={currentTab}
              factory={factory}
              onNavigate={setCurrentTab}
            />
          )}
        </main>
      </div>

      {/* Create New Line Plan Modal */}
      <CreateLinePlanModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}
