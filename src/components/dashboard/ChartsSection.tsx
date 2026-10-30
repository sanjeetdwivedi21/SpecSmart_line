import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid,
  Legend,
  Line
} from 'recharts';
import { FactoryProfile } from '../../types';
import { TrendingUp, ShieldAlert, PieChart as PieIcon, Activity } from 'lucide-react';

interface ChartsSectionProps {
  factory: FactoryProfile;
}

const HEALTH_COLORS = {
  Normal: '#10B981',   // Emerald
  Warning: '#F59E0B',  // Amber
  Critical: '#F43F5E', // Rose
};

// Custom Tooltip for Area Chart
const CustomDowntimeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B132B] border border-slate-700/90 rounded-lg p-3 shadow-2xl text-xs space-y-1.5 min-w-[200px]">
        <div className="font-semibold text-white border-b border-slate-800 pb-1">{label}</div>
        <div className="flex items-center justify-between text-blue-400">
          <span>Actual Downtime:</span>
          <span className="font-mono font-bold tabular-nums">{payload[0]?.value} hrs</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Target Allowance:</span>
          <span className="font-mono tabular-nums">{payload[1]?.value} hrs</span>
        </div>
        {payload[2] && (
          <div className="flex items-center justify-between text-amber-400 pt-1 border-t border-slate-800/80">
            <span>Production Loss:</span>
            <span className="font-mono font-bold tabular-nums">₹{payload[2]?.value} Lakhs</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Risk Chart
const CustomRiskTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-[#0B132B] border border-slate-700/90 rounded-lg p-3 shadow-2xl text-xs space-y-1 min-w-[200px]">
        <div className="font-semibold text-white border-b border-slate-800 pb-1">{label}</div>
        <div className="flex items-center justify-between text-cyan-400">
          <span>Failure Risk Index:</span>
          <span className="font-mono font-bold tabular-nums">{data?.riskScore} / 100</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Exposed Machines:</span>
          <span className="font-mono font-semibold tabular-nums">{data?.machineCount} machines</span>
        </div>
        <div className="flex items-center justify-between text-rose-400">
          <span>Critical Tier Assets:</span>
          <span className="font-mono font-bold tabular-nums">{data?.criticalCount} assets</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({ factory }) => {
  const [trendRange, setTrendRange] = useState<'6M' | '3M'>('6M');

  // Compute machine health summary counts
  const normalCount = factory.machines.filter(m => m.status === 'Normal').length;
  const warningCount = factory.machines.filter(m => m.status === 'Warning').length;
  const criticalCount = factory.machines.filter(m => m.status === 'Critical').length;
  
  const healthData = [
    { name: 'Normal (In Spec)', value: normalCount || 16, color: HEALTH_COLORS.Normal },
    { name: 'Warning (Threshold Alert)', value: warningCount || 7, color: HEALTH_COLORS.Warning },
    { name: 'Critical (High Loss Risk)', value: criticalCount || 5, color: HEALTH_COLORS.Critical },
  ];

  const totalAssets = healthData.reduce((acc, curr) => acc + curr.value, 0);

  const displayTrends = trendRange === '3M' 
    ? factory.downtimeTrends.slice(-3) 
    : factory.downtimeTrends;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Chart 1: Downtime & Production Loss Trends (Area + Line) - 7 Cols */}
      <div className="lg:col-span-7 bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Unplanned Downtime & Production Loss Trend
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly downtime hours vs. allowed target with financial loss exposure (₹ Lakhs)
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setTrendRange('6M')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                trendRange === '6M'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTrendRange('3M')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                trendRange === '3M'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 3M
            </button>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="downtimeHoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
                unit="h"
              />
              <Tooltip content={<CustomDowntimeTooltip />} />
              <Area
                type="monotone"
                dataKey="actualHours"
                name="Actual Downtime (hrs)"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#downtimeHoursGrad)"
              />
              <Line
                type="monotone"
                dataKey="targetHours"
                name="Target Benchmark"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lossINR_Lakhs"
                name="Loss (₹ Lakhs)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3, fill: '#F59E0B' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Actual Downtime (hrs)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 bg-slate-400" />
              Allowed Target (hrs)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Financial Loss (₹ Lakhs)
            </span>
          </div>
          <span className="font-mono text-slate-300">
            Avg: {(factory.metrics.monthlyDowntimeHours).toFixed(1)} hrs/mo
          </span>
        </div>
      </div>

      {/* Chart 2: Machine Health Breakdown (Donut) - 5 Cols */}
      <div className="lg:col-span-5 bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
        <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Machine Health Distribution
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {totalAssets} Total Assets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center my-2">
          {/* Donut Chart */}
          <div className="sm:col-span-7 h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B132B" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} machines`, name]}
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Readiness</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {factory.metrics.pcmReadinessScore}%
              </span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="sm:col-span-5 space-y-2 text-xs">
            {healthData.map((item) => {
              const pct = Math.round((item.value / totalAssets) * 100);
              return (
                <div key={item.name} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name.split(' ')[0]}
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">{item.value}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{pct}% of line</span>
                    <span className="font-mono">{item.value > 1 ? `${item.value} units` : '1 unit'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Continuous vibration & thermal monitoring</span>
          <span className="text-cyan-400 font-medium">ISO 10816 Class II</span>
        </div>
      </div>

      {/* Chart 3: Failure Mode & Risk Distribution - Full 12 Cols */}
      <div className="lg:col-span-12 bg-[#0B132B]/80 border border-slate-800/90 rounded-xl p-4 sm:p-5">
        <div className="pb-3 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Failure Mode & Critical Asset Risk Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Risk severity score (0–100) vs number of exposed production machines across line stations
            </p>
          </div>
          <div className="text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            Highest Risk: <span className="text-rose-400 font-semibold">{factory.riskDistribution[0]?.category}</span>
          </div>
        </div>

        <div className="h-56 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factory.riskDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomRiskTooltip />} />
              <Bar 
                dataKey="riskScore" 
                name="Failure Risk Score (0-100)" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={48}
              />
              <Bar 
                dataKey="criticalCount" 
                name="Critical Machines Exposed" 
                fill="#F43F5E" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-blue-600" />
              Failure Risk Index (Severity × Frequency)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-rose-500" />
              Critical Bottleneck Count
            </span>
          </div>
          <span className="text-slate-300">
            Recommended Action: Mandate triaxial accelerometer & high-speed vibration FFT in vendor RFP spec
          </span>
        </div>
      </div>
    </div>
  );
};
