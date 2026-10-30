import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Cpu, 
  Radio, 
  Network, 
  BellRing, 
  ShieldCheck, 
  Calculator,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { FactoryProfile } from '../../types';
import { formatINR } from '../../data/mockFactoryData';
import { CHECKLIST_ITEMS } from '../../data/checklistDefinitions';

interface SpecificationBuilderModuleProps {
  factory: FactoryProfile;
  onUpdateFactory: (updated: FactoryProfile) => void;
  onNavigate: (tab: any) => void;
}

export const SpecificationBuilderModule: React.FC<SpecificationBuilderModuleProps> = ({
  factory,
  onUpdateFactory,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const specNumber = `SPEC-SLP-${factory.plantCode}-2026-V1.0`;
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const criticalCount = factory.machines.filter(
    (m) => m.criticality === 'High' || m.machineCriticality === 'Critical'
  ).length;

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdown = () => {
    return `# TECHNICAL SPECIFICATION FOR MACHINE HEALTH VISIBILITY & CONDITION MONITORING
**Document Reference:** ${specNumber}
**Date of Issuance:** ${generatedDate}
**Target Facility:** ${factory.name} (${factory.plantCode})
**Location:** ${factory.city}, ${factory.state}
**Production Line:** ${factory.lineName} (${factory.lineId || 'N/A'})
**Target Commissioning:** ${factory.targetGoLive}

---

## 1.0 MANDATE & BUSINESS JUSTIFICATION
Machine health visibility and continuous condition monitoring are non-negotiable procurement deliverables for this production line. Equipment vendors and system integrators must supply all assets with factory-fitted sensors and standard telemetry interfaces prior to final commissioning sign-off.

- **Baseline Unplanned Downtime:** ${factory.metrics.monthlyDowntimeHours} hours/month
- **Hourly Downtime Cost Rate:** ₹${factory.metrics.hourlyDowntimeCostINR.toLocaleString('en-IN')}/hour
- **Current Monthly Production Loss:** ₹${(factory.metrics.estimatedMonthlyDowntimeCostINR / 100000).toFixed(2)} Lakhs
- **Target Downtime Reduction:** 55%
- **Expected Annual Savings:** ₹${((factory.metrics.potentialAnnualSavingsINR || 11200000) / 100000).toFixed(2)} Lakhs
- **Target Payback Horizon:** ${factory.metrics.estimatedPaybackMonths || 9.2} Months

---

## 2.0 SCOPE OF MACHINERY & ASSET CRITICALITY
The line consists of ${factory.machines.length} total machines. All ${criticalCount} Critical assets must feature mandatory condition monitoring.

| Tag | Machine Name | Type | Manufacturer | Criticality | Rated kW |
|---|---|---|---|---|---|
${factory.machines
  .map(
    (m) =>
      `| ${m.tag} | ${m.name} | ${m.type} | ${m.manufacturer || 'OEM'} | ${
        m.machineCriticality || m.criticality
      } | ${m.ratedPowerKw || 30} kW |`
  )
  .join('\n')}

---

## 3.0 SENSOR TELEMETRY STANDARDS
1. **Vibration Sensors:** Triaxial IEPE piezoelectric accelerometers (100 mV/g, 10 kHz bandwidth) mounted directly on bearing housings.
2. **Temperature Probes:** PT100 RTD Class A probes on drive bearings and immersion thermocouples on gearbox sumps.
3. **Current Transducers:** Split-core 3-phase current transformers (CTs) on all motor drives >= 15 kW.

---

## 4.0 DATA ARCHITECTURE & EDGE BUFFERING
- **Field Bus:** IO-Link Master hubs (IP67) mounted directly on machine frames.
- **Edge Gateway:** Industrial DIN-Rail IPC with 72-hour non-volatile local SQLite/DuckDB buffer.
- **Protocol:** OPC-UA (Port 4840) or MQTT over TLS 1.3 (Port 8883) with X.509 client authentication.
- **Store-and-Forward:** In case of factory network interruption, telemetry must be cached locally and backfilled automatically upon reconnection.

---

## 5.0 ALERT THRESHOLDS & ESCALATION RULES
- **ISO 10816-3 Vibration Severity:**
  - Velocity RMS < 2.8 mm/s: Normal operation
  - Velocity RMS 2.8 - 4.5 mm/s: Warning (Automated alert dispatched within 15 mins)
  - Velocity RMS > 4.5 mm/s: Critical Trip (Line deceleration/interlock warning within 60s)
- **Bearing Temperature:** Normal < 65°C, Warning 65–85°C, Critical > 85°C.

---

## 6.0 VENDOR ACCEPTANCE CRITERIA
1. **FAT (Factory Acceptance Test):** Verification of all sensor channels, tag mapping, and IO-Link communication.
2. **SAT (Site Acceptance Test):** 48-hour continuous loaded production run with baseline FFT spectral signatures recorded.
3. **Documentation:** As-built sensor wiring schematics, tag list, and 12-month recalibration protocol.
4. **Milestone Payment:** Final 20% commissioning retention release is subject to complete telemetry validation.
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${factory.name.replace(/\s+/g, '_')}_LineSpec_v1.0.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Action Bar (Hidden during print) */}
      <div className="bg-[#0B132B]/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Vendor-Ready Specification Builder
              </h2>
              <span className="font-mono text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {specNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assembled tender document ready to share with equipment vendors, OEMs, and system integrators. Incorporates machine health non-negotiables into line procurement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {downloadSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
              <span>Download .md</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('alert-standards')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Alert Standards</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete RFP Package Assembled
            </span>
            <span className="text-slate-500">·</span>
            <span>{factory.machines.length} Assets Specified</span>
            <span className="text-slate-500">·</span>
            <span>{criticalCount} Critical Stations Covered</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Uses standard Browser Print Dialog to generate formal PDF
          </span>
        </div>
      </div>

      {/* Formal Tender Specification Document Preview (Styled for Screen & Print) */}
      <div className="bg-[#0B132B]/95 text-slate-100 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:space-y-6">
        {/* Document Header & Cover Information */}
        <div className="border-b-2 border-blue-500 pb-6 print:border-black">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-400 print:text-blue-700">
                CONFIDENTIAL PROCUREMENT SPECIFICATION · RFP ANNEXURE
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 print:text-black">
                Machine Health Visibility & Condition Monitoring Tender Specification
              </h1>
              <div className="text-sm font-semibold text-slate-300 mt-1 print:text-slate-800">
                Production Line: {factory.lineName}
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-400 print:text-slate-600 shrink-0 space-y-0.5">
              <div>Ref: <strong className="text-white print:text-black">{specNumber}</strong></div>
              <div>Date: {generatedDate}</div>
              <div>Revision: <strong>1.0 (Tender Ready)</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-800 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px] uppercase">Enterprise</span>
              <strong className="text-slate-200 print:text-black">{factory.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px] uppercase">Plant Location</span>
              <strong className="text-slate-200 print:text-black">{factory.city}, {factory.state}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px] uppercase">Sector</span>
              <strong className="text-slate-200 print:text-black">{factory.sector}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px] uppercase">Target Commissioning</span>
              <strong className="text-cyan-400 print:text-black">{factory.targetGoLive}</strong>
            </div>
          </div>
        </div>

        {/* Section 1.0 Executive Mandate */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            1.0 Executive Mandate & Business Justification
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            Machine health visibility, high-speed telemetry, and condition monitoring are non-negotiable procurement deliverables for <strong>{factory.lineName}</strong>. Traditional procurement approaches where sensors are treated as post-handover upgrades are strictly rejected. Bidders must deliver fully instrumented machinery capable of autonomous condition monitoring from Day 1 of production.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Current Line Downtime</span>
              <strong className="text-white print:text-black text-sm font-mono">{factory.metrics.monthlyDowntimeHours} hrs/month</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">@{formatINR(factory.metrics.hourlyDowntimeCostINR)}/hr loss</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Expected Savings</span>
              <strong className="text-emerald-400 print:text-emerald-800 text-sm font-mono">{formatINR(factory.metrics.potentialAnnualSavingsINR || 11200000)} / yr</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">Target 55% downtime reduction</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Payback Horizon</span>
              <strong className="text-cyan-300 print:text-black text-sm font-mono">{factory.metrics.estimatedPaybackMonths || 9.2} Months</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">Justified across capital asset life</div>
            </div>
          </div>
        </div>

        {/* Section 2.0 Machine Inventory Scope */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            2.0 Scope of Line Assets & Criticality Classification
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 print:border-black text-[10px] font-bold uppercase text-slate-400 print:text-black">
                  <th className="py-2 px-2">Tag</th>
                  <th className="py-2 px-2">Machine Description</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">OEM Manufacturer</th>
                  <th className="py-2 px-2">Criticality</th>
                  <th className="py-2 px-2 text-right">Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                {factory.machines.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 px-2 font-mono font-bold text-blue-400 print:text-black">{m.tag}</td>
                    <td className="py-2 px-2 font-medium">{m.name}</td>
                    <td className="py-2 px-2 text-[11px] text-slate-400 print:text-slate-700">{m.type}</td>
                    <td className="py-2 px-2">{m.manufacturer || 'OEM'}</td>
                    <td className="py-2 px-2">
                      <span className="font-semibold text-xs">{m.machineCriticality || m.criticality}</span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono">{m.ratedPowerKw || 30} kW</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3.0 Sensor Standards & Hardware Requirements */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            3.0 Physical Condition Monitoring Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1">
              <strong className="text-white print:text-black block">3.1 Vibration Telemetry</strong>
              <p className="text-slate-300 print:text-slate-800 leading-relaxed text-[11px]">
                Triaxial IEPE accelerometers (100 mV/g, 10 kHz bandwidth) mounted on primary drive spindle bearings. Overall velocity RMS + high-frequency FFT spectral demodulation required.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1">
              <strong className="text-white print:text-black block">3.2 Temperature Probes</strong>
              <p className="text-slate-300 print:text-slate-800 leading-relaxed text-[11px]">
                Class A PT100 RTD sensors for bearing housing surfaces and immersion thermocouples on reduction gearbox lube sumps. Dual-channel sampling at 1 Hz continuous averaging.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1">
              <strong className="text-white print:text-black block">3.3 Electrical Load Telemetry</strong>
              <p className="text-slate-300 print:text-slate-800 leading-relaxed text-[11px]">
                3-phase split-core current transducers on all motor feeds 15 kW and above. Measures true RMS phase current and detects phase unbalance (&gt;5%) and tool dullness overload.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4.0 Architecture & Connectivity */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            4.0 Data Architecture, Protocols & Edge Buffering
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            <li><strong>Field Interconnect:</strong> IP67 machine-mount IO-Link Master hubs communicating with sensors via shielded M12 cabling.</li>
            <li><strong>Edge Gateway:</strong> Industrial DIN-Rail IPC (quad-core, 16GB RAM, 256GB SSD) running on 24V DC auxiliary power.</li>
            <li><strong>Store-and-Forward Buffering:</strong> Non-volatile local buffer of minimum 72 hours. In case of network drop, data must be retained locally and backfilled automatically.</li>
            <li><strong>Security & Protocol:</strong> Outbound MQTT over TLS 1.3 (Port 8883) or OPC-UA (Port 4840) with Basic256Sha256 encryption. No inbound open firewall ports.</li>
          </ul>
        </div>

        {/* Section 5.0 Alert Standards & Escalation */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            5.0 Alarm Thresholds & Escalation Matrix (ISO 10816-3)
          </h2>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 print:border-black text-[10px] font-bold uppercase text-slate-400 print:text-black">
                  <th className="py-2 px-2">Severity</th>
                  <th className="py-2 px-2">Vibration (Velocity RMS)</th>
                  <th className="py-2 px-2">Bearing Temp</th>
                  <th className="py-2 px-2">Escalation Action & SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                <tr>
                  <td className="py-2 px-2 font-bold text-emerald-400 print:text-black">Zone A/B (Normal)</td>
                  <td className="py-2 px-2 font-mono">&lt; 2.8 mm/s</td>
                  <td className="py-2 px-2 font-mono">&lt; 65°C</td>
                  <td className="py-2 px-2">Routine continuous monitoring; no maintenance intervention.</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-bold text-amber-400 print:text-black">Zone C (Warning)</td>
                  <td className="py-2 px-2 font-mono">2.8 – 4.5 mm/s</td>
                  <td className="py-2 px-2 font-mono">65°C – 85°C</td>
                  <td className="py-2 px-2">Alert dispatched within 15 min. Inspection scheduled within 7 days.</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-bold text-rose-400 print:text-black">Zone D (Critical Trip)</td>
                  <td className="py-2 px-2 font-mono">&gt; 4.5 mm/s</td>
                  <td className="py-2 px-2 font-mono">&gt; 85°C</td>
                  <td className="py-2 px-2">Immediate acoustic horn / SMS alert &lt; 60s. Controlled line deceleration.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6.0 Vendor Acceptance & Commissioning Sign-Off */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-slate-800 print:border-slate-300 pb-1">
            6.0 Vendor Scope of Delivery & Milestone Acceptance
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            <li><strong>Factory Acceptance Test (FAT):</strong> Functional sign-off of all sensor channels, IO-Link masters, and gateway tag addressing prior to machine dispatch.</li>
            <li><strong>Site Acceptance Test (SAT):</strong> 48-hour continuous loaded trial run. Baseline FFT vibration spectrum and temperature signatures must be recorded for every station.</li>
            <li><strong>Retention Payment Condition:</strong> Release of the final 20% equipment payment milestone is contingent upon verified telemetry ingestion into the SpecSmart platform.</li>
          </ol>
        </div>

        {/* Signature & Sign-Off Block */}
        <div className="pt-8 border-t-2 border-slate-800 print:border-black grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400 print:text-black">
          <div>
            <span className="text-[10px] uppercase text-slate-500 block mb-4">Prepared By</span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-semibold text-white print:text-black">
              Rajesh Sharma
            </div>
            <div className="text-[10px] mt-0.5">Chief of Manufacturing Operations</div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 block mb-4">Approved By</span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-semibold text-white print:text-black">
              Plant Head / Promoter
            </div>
            <div className="text-[10px] mt-0.5">{factory.name}</div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 block mb-4">Vendor Acknowledgement</span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-semibold text-slate-500">
              Authorized OEM Signature & Seal
            </div>
            <div className="text-[10px] mt-0.5">Date: ________________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
