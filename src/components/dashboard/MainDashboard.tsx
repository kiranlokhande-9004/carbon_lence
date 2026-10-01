import React, { useRef, useEffect, memo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Monthly trend data for the floating emissions graph
const TREND_DATA = [
  { month: 'Jan', actual: 118.2, baseline: 132.0, pctChange: '-10.5%' },
  { month: 'Feb', actual: 122.5, baseline: 130.5, pctChange: '-6.1%' },
  { month: 'Mar', actual: 125.0, baseline: 134.2, pctChange: '-6.9%' },
  { month: 'Apr', actual: 119.8, baseline: 131.0, pctChange: '-8.5%' },
  { month: 'May', actual: 131.4, baseline: 139.8, pctChange: '-6.0%' },
  { month: 'Jun', actual: 142.3, baseline: 126.4, pctChange: '+12.6%' },
  { month: 'Jul', actual: 136.8, baseline: 144.2, pctChange: '-5.1%' },
  { month: 'Aug', actual: 129.4, baseline: 141.0, pctChange: '-8.2%' },
  { month: 'Sep', actual: 124.6, baseline: 137.5, pctChange: '-9.4%' },
  { month: 'Oct', actual: 121.2, baseline: 135.0, pctChange: '-10.2%' },
  { month: 'Nov', actual: 117.8, baseline: 133.4, pctChange: '-11.7%' },
  { month: 'Dec', actual: 115.6, baseline: 131.8, pctChange: '-12.3%' },
];

// Top emission sources
const TOP_SOURCES = [
  { name: 'Electricity', percentage: 43, color: '#059669' },
  { name: 'Fuel', percentage: 22, color: '#10b981' },
  { name: 'Business Travel', percentage: 14, color: '#34d399' },
  { name: 'Purchased Goods', percentage: 11, color: '#6ee7b7' },
  { name: 'Waste', percentage: 6, color: '#a7f3d0' },
  { name: 'Employee Commute', percentage: 4, color: '#d1fae5' },
];

// Scope donut data
const SCOPE_DATA = [
  { name: 'Scope 1', value: 31.4, percentage: 24, color: '#059669' }, // Emerald
  { name: 'Scope 2', value: 54.7, percentage: 43, color: '#0284c7' }, // Sky/Blue
  { name: 'Scope 3', value: 42.5, percentage: 33, color: '#6366f1' }, // Indigo
];

// Custom floating graph tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const actual = payload[0]?.value;
    const baseline = payload[1]?.value;
    const itemData = TREND_DATA.find((d) => d.month === label);

    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs border border-slate-700/60 pointer-events-none">
        <p className="font-semibold text-slate-200">{label} 2026</p>
        <p className="text-emerald-400 font-bold text-sm mt-0.5">{actual} tCO₂e</p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 border-t border-slate-800 pt-1">
          <span>2025: {baseline} tCO₂e</span>
          {itemData?.pctChange && (
            <span className={itemData.pctChange.startsWith('-') ? 'text-emerald-400' : 'text-amber-400'}>
              {itemData.pctChange} vs 2025
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const MainDashboard: React.FC = () => {
  const { setActiveTab } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="relative min-h-full p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Background Video & Ambient Luminous Blur Mesh for Overview */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 brightness-105"
        >
          <source src="/videos/climate-loop.mp4" type="video/mp4" />
        </video>
        {/* Ambient atmospheric color orbs that create the rich background blur lighting */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-sky-500/18 blur-[90px]" />
        <div className="absolute -bottom-32 left-1/4 w-[520px] h-[520px] rounded-full bg-teal-400/15 blur-[110px]" />
        {/* Full viewport frosted glass backdrop blur */}
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-2xl" />
      </div>

      {/* Main Interactive Content Shell */}
      <div className="relative z-10 space-y-8">
        {/* =========================================================================
            1. 4 KPI CARDS: Compact, high-contrast, clean with frosted glass backdrop blur & floating
            ========================================================================= */}
        <section
          id="kpi-cards-grid"
          aria-label="Key Performance Indicators"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Card 1: Total Emissions */}
          <div className="floating-info-card-1">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Total Emissions
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  128.6
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">tCO₂e</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>↓ 8.4% vs previous period</span>
              </div>
            </div>
          </div>

          {/* Card 2: Scope 1 */}
          <div className="floating-info-card-2">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 1
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  31.4
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">tCO₂e</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="font-semibold text-slate-800">24%</span> of total
              </p>
            </div>
          </div>

          {/* Card 3: Scope 2 */}
          <div className="floating-info-card-3">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 2
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs shadow-sky-500/50" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  54.7
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">tCO₂e</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="font-semibold text-slate-800">43%</span> of total
              </p>
            </div>
          </div>

          {/* Card 4: Scope 3 */}
          <div className="floating-info-card-4">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 3
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/50" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  42.5
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">tCO₂e</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="font-semibold text-slate-800">33%</span> of total
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. MAIN FLOATING GRAPH: Emissions Trend (Area + Line)
            ========================================================================= */}
        <section
          id="main-emissions-graph-card"
          aria-label="Emissions Trend Graph"
          className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Emissions Trend
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Total emissions (tCO₂e)
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="font-medium text-slate-800">2026 Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-400" />
                <span className="font-medium text-slate-500">2025 Baseline</span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={[100, 160]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* =========================================================================
            3. THREE SIMPLE DATA CARDS BELOW THE MAIN GRAPH with frosted glass & floating
            ========================================================================= */}
        <section
          id="secondary-cards-grid"
          aria-label="Secondary Insights"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Top Emission Sources (Compact horizontal bar chart) */}
          <div className="floating-info-card-1">
            <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Top Emission Sources
                </h3>
                <p className="text-xs text-slate-500 font-normal mb-5">
                  Key contributors this reporting period
                </p>

                <div className="space-y-3.5">
                  {TOP_SOURCES.map((source) => (
                    <div key={source.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{source.name}</span>
                        <span className="text-slate-900 font-semibold">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${source.percentage}%`,
                            backgroundColor: source.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Emissions by Scope (Clean donut chart) */}
          <div className="floating-info-card-2">
            <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Emissions by Scope
                </h3>
                <p className="text-xs text-slate-500 font-normal mb-2">
                  Distribution across standard GHG scopes
                </p>

                {/* Donut Chart with Center Text */}
                <div className="relative h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SCOPE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {SCOPE_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-900 leading-tight">128.6</span>
                    <span className="text-[11px] font-medium text-slate-500">tCO₂e</span>
                  </div>
                </div>

                {/* Scope Legend */}
                <div className="flex items-center justify-around text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-2xs shadow-emerald-500/50" />
                    <span className="text-slate-600">Scope 1:</span>
                    <span className="font-bold text-slate-900">24%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-2xs shadow-sky-500/50" />
                    <span className="text-slate-600">Scope 2:</span>
                    <span className="font-bold text-slate-900">43%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-2xs shadow-indigo-500/50" />
                    <span className="text-slate-600">Scope 3:</span>
                    <span className="font-bold text-slate-900">33%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: CarbonLens Insight */}
          <div className="floating-info-card-3">
            <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    CarbonLens Insight
                  </h3>
                </div>

                {/* Insight 1 */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    Electricity accounts for <span className="font-bold text-emerald-800">43%</span> of your reported emissions this period.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('emissions')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>View electricity data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Insight 2 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Emissions Reduction</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Your emissions decreased by <span className="font-bold text-slate-800">8.4%</span> compared with the previous period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
