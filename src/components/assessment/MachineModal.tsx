import React, { useState, useEffect } from 'react';
import { X, Cpu, Check, AlertCircle } from 'lucide-react';
import { MachineRecord, CriticalityLevel, MachineCriticality, MachineStatus } from '../../types';

interface MachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: MachineRecord) => void;
  editingMachine?: MachineRecord | null;
  existingTags: string[];
}

export const MachineModal: React.FC<MachineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMachine,
  existingTags,
}) => {
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [installationYear, setInstallationYear] = useState<number>(2021);
  const [ratedPowerKw, setRatedPowerKw] = useState<number>(30);
  const [criticality, setCriticality] = useState<MachineCriticality>('Critical');
  const [operatingHours, setOperatingHours] = useState<number>(10000);
  const [status, setStatus] = useState<MachineStatus>('Normal');
  const [monitoringLevel, setMonitoringLevel] = useState<MachineRecord['monitoringLevel']>('Basic SCADA');
  const [failureRiskCategory, setFailureRiskCategory] = useState<string>('Bearing Spalling');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingMachine) {
      setTag(editingMachine.tag);
      setName(editingMachine.name);
      setType(editingMachine.type);
      setManufacturer(editingMachine.manufacturer || '');
      setInstallationYear(editingMachine.installationYear || 2021);
      setRatedPowerKw(editingMachine.ratedPowerKw || 30);
      setCriticality(
        editingMachine.machineCriticality || 
        (editingMachine.criticality === 'High' ? 'Critical' : editingMachine.criticality === 'Medium' ? 'Important' : 'Standard')
      );
      setOperatingHours(editingMachine.operatingHours || 10000);
      setStatus(editingMachine.status);
      setMonitoringLevel(editingMachine.monitoringLevel);
      setFailureRiskCategory(editingMachine.failureRiskCategory);
    } else {
      // Default new machine values
      setTag(`MC-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setType('CNC Machining / Primary Station');
      setManufacturer('');
      setInstallationYear(2022);
      setRatedPowerKw(35);
      setCriticality('Critical');
      setOperatingHours(8000);
      setStatus('Normal');
      setMonitoringLevel('Basic SCADA');
      setFailureRiskCategory('Bearing Spalling');
    }
    setError(null);
  }, [editingMachine, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTag = tag.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanTag) {
      setError('Machine Tag / Asset ID is required');
      return;
    }
    if (!cleanName) {
      setError('Machine Name is required');
      return;
    }

    // Check duplicate tag only if adding a new machine or changing tag
    if (!editingMachine || editingMachine.tag.toUpperCase() !== cleanTag) {
      if (existingTags.map(t => t.toUpperCase()).includes(cleanTag)) {
        setError(`A machine with tag "${cleanTag}" already exists on this line.`);
        return;
      }
    }

    const mappedCriticality: CriticalityLevel = 
      criticality === 'Critical' ? 'High' : criticality === 'Important' ? 'Medium' : 'Low';

    const savedRecord: MachineRecord = {
      id: editingMachine ? editingMachine.id : `m-${Date.now()}`,
      tag: cleanTag,
      name: cleanName,
      type: type.trim() || 'Production Machine',
      manufacturer: manufacturer.trim() || 'OEM Vendor',
      installationYear: Number(installationYear) || 2021,
      ratedPowerKw: Number(ratedPowerKw) || 30,
      criticality: mappedCriticality,
      machineCriticality: criticality,
      operatingHours: Number(operatingHours) || 0,
      status: status,
      monitoringLevel: monitoringLevel,
      failureRiskCategory: failureRiskCategory,
      vibrationMmS: editingMachine?.vibrationMmS ?? (status === 'Critical' ? 6.5 : status === 'Warning' ? 3.5 : 1.8),
      tempC: editingMachine?.tempC ?? (status === 'Critical' ? 75 : status === 'Warning' ? 55 : 42),
      currentA: editingMachine?.currentA ?? 32,
      historicalDowntimeHrs: editingMachine?.historicalDowntimeHrs ?? 6.0,
      lastAnomaly: editingMachine?.lastAnomaly,
    };

    onSave(savedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-slate-700/90 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080E20]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {editingMachine ? 'Edit Machine Inventory Record' : 'Add Machine to Line Inventory'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Log asset identification, OEM manufacturer, rated power, and criticality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Tag & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Asset ID / Tag *
              </label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. HOB-02"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Machine Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gleason CNC Gear Hobber 300"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Type & Manufacturer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Machine Type / Function
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Precision CNC Hobbing Cell"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Manufacturer (OEM)
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Gleason / Mazak / BFW / Siemens"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Installation Year, Rated Power, Operating Hours */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Install Year
              </label>
              <input
                type="number"
                min={1990}
                max={2030}
                value={installationYear}
                onChange={(e) => setInstallationYear(parseInt(e.target.value) || 2022)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rated Power (kW)
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={ratedPowerKw}
                onChange={(e) => setRatedPowerKw(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operating Hours
              </label>
              <input
                type="number"
                min={0}
                value={operatingHours}
                onChange={(e) => setOperatingHours(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Criticality & Monitoring Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Machine Criticality
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as MachineCriticality)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">Critical (Single-Point-of-Failure / Bottleneck)</option>
                <option value="Important">Important (Buffer exists, moderate line impact)</option>
                <option value="Standard">Standard (Auxiliary / Parallel redundant capacity)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monitoring Telemetry Tier
              </label>
              <select
                value={monitoringLevel}
                onChange={(e) => setMonitoringLevel(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="None">None (Dark asset)</option>
                <option value="Basic SCADA">Basic SCADA (Run/Stop/Count)</option>
                <option value="Condition Monitored">Condition Monitored (Temp / RMS Vib)</option>
                <option value="Predictive Ready">Predictive Ready (High-speed FFT + ML)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Primary Failure Risk & Health Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dominant Failure Risk Mode
              </label>
              <select
                value={failureRiskCategory}
                onChange={(e) => setFailureRiskCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Bearing Spalling">Bearing Spalling (Inner/Outer Race)</option>
                <option value="Gearbox Backlash">Gearbox Backlash & Tooth Pitting</option>
                <option value="Thermal Overload">Thermal Overload / Motor Winding</option>
                <option value="Hydraulic Loss">Hydraulic Pressure Loss / Valve Drift</option>
                <option value="Motor Misalignment">Motor Misalignment & Belt Slip</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Condition Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MachineStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Normal">Normal (In Tolerance)</option>
                <option value="Warning">Warning (ISO Threshold Exceeded)</option>
                <option value="Critical">Critical (High Breakdown Risk)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{editingMachine ? 'Update Machine' : 'Save Machine to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
