import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  ShieldCheck, 
  Database, 
  Globe, 
  Bell, 
  FileCode 
} from 'lucide-react';
import { FactoryProfile } from '../../types';

interface SettingsModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  const [currency, setCurrency] = useState('INR');
  const [vibrationUnit, setVibrationUnit] = useState('mm/s');
  const [tempUnit, setTempUnit] = useState('Celsius');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem(`specsmart_checklist_${factory.id}`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Settings className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                System & Plant Engineering Settings
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Configure engineering units, currency representation, data persistence, and telemetry simulation flags.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>System engineering preferences updated successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Currency & Localization */}
        <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Currency & Regional Formatting
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Financial Currency Standard
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="INR">Indian Rupee (₹ INR) – Formatted in Lakhs & Crores</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Vibration Measurement Standard
              </label>
              <select
                value={vibrationUnit}
                onChange={(e) => setVibrationUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="mm/s">Velocity RMS (mm/s, 10–1000 Hz) – ISO 10816</option>
                <option value="g">Peak Acceleration (g)</option>
                <option value="um">Displacement Peak-to-Peak (µm)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Persistence & Cache */}
        <div className="bg-[#0B132B]/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Database className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Local Storage & Cache Management
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-slate-300 leading-relaxed">
              Assessment records, machine health checklists, and customized ROI scenarios are cached in the browser's persistent local storage.
            </p>

            <button
              type="button"
              onClick={handleClearCache}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>Reset Saved Checklist Cache for {factory.plantCode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Disclosure Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>TCS Hackathon Telemetry Disclosure:</strong> SpecSmart Line Planner is designed as an industrial specification and capital equipment planning platform. Live physical parameters (e.g. 7.8 mm/s vibration RMS on HOB-01) represent high-fidelity engineering simulated baselines tuned for discrete Indian manufacturing setups.
        </div>
      </div>
    </div>
  );
};
