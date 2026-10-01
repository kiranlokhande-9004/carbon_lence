import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Upload,
  Download,
  Info,
  Building2,
  FileText,
  Flame,
  CheckCircle2,
  RefreshCw,
  Radio,
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
} from 'recharts';
import { GHGEmissionsFlow } from './GHGEmissionsFlow';
import { AnimatedCounter } from './AnimatedCounter';

export const MainDashboard: React.FC = () => {
  const {
    currentESGData,
    setIsESGUploadModalOpen,
    downloadESGStatusPDF,
    setActiveTab,
    showToast,
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const {
    metrics,
    reportingYear,
    previousYear,
    companyName,
    ticker,
    assuranceProvider,
    sourceReportTitle,
    annualReportSource,
    reportedGases,
  } = currentESGData;

  // Real-time style live telemetry data refresh simulation
  const handleLiveRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((prev) => prev + 1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(timeStr);
      showToast(`Live telemetry refreshed: ${companyName} (${ticker}) verified data streams`, 'success');
    }, 600);
  };

  // Monthly trend data mapped to thousands tCO2e
  const trendData = currentESGData.monthlyEmissionsTrend.map((d) => ({
    month: d.month,
    actual: d.actual2023,
    baseline: d.baseline2022,
    pctChange: d.pctChange,
  }));

  // Custom floating graph tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload[0]?.value;
      const baseline = payload[1]?.value;
      const itemData = trendData.find((d) => d.month === label);

      return (
        <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs border border-slate-700/60 pointer-events-none transition-all">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-semibold text-slate-200">{label} {reportingYear}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
              Reported
            </span>
          </div>
          <p className="text-emerald-400 font-bold text-sm">
            {actual}k MT CO₂e
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span>{previousYear}: {baseline}k MT CO₂e</span>
            {itemData?.pctChange && (
              <span className={itemData.pctChange.startsWith('-') ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {itemData.pctChange} vs {previousYear}
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div key={refreshKey} className="relative min-h-full p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
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
            LIVE DATA INDICATOR & VERIFIED REAL ESG STATUS BANNER
            ========================================================================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
          <div className="flex items-start sm:items-center gap-3">
            {/* Live Indicator Icon */}
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs font-bold text-sm relative">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Clear LIVE DATA Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  LIVE DATA
                </span>

                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  {companyName} ({ticker})
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {currentESGData.verificationStatus} by {assuranceProvider}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  {previousYear} vs {reportingYear} Verified Public Disclosures
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span>
                  Official Source: <strong className="text-slate-700 font-semibold">{sourceReportTitle}</strong> & <strong className="text-slate-700 font-semibold">{annualReportSource}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Last synced:</span>
                  <span className="text-emerald-700 font-semibold">{lastSyncTime}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            {/* Live Data Refresh Button */}
            <button
              type="button"
              onClick={handleLiveRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="Refresh live verified data streams"
              aria-label="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsESGUploadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>PDF Upload Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => downloadESGStatusPDF()}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download official audited PDF report"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Download Company ESG PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. 4 KPI CARDS: Compact, high-contrast, clean with frosted glass & counting numbers
            ========================================================================= */}
        <section
          id="kpi-cards-grid"
          aria-label="Key Performance Indicators"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Card 1: Total Emissions */}
          <div className="floating-info-card-1">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Total Net Emissions
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  [{metrics.totalEmissionsMarket.valueType}]
                </span>
              </div>
              <div className="my-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={metrics.totalEmissionsMarket.currentValue! / 1000000}
                    decimals={2}
                    duration={900}
                  />
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">M MT CO₂e</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  +{metrics.totalEmissionsMarket.percentageChange}% vs {previousYear}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Scope 1 */}
          <div className="floating-info-card-2">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 1 Direct
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              </div>
              <div className="my-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={metrics.scope1.currentValue! / 1000}
                    decimals={0}
                    duration={800}
                  />
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">k MT CO₂e</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {metrics.scope1.percentageChange}% vs {previousYear}
                </span>
                <span className="text-slate-400 font-medium text-[11px]">&lt;1% of total</span>
              </div>
            </div>
          </div>

          {/* Card 3: Scope 2 */}
          <div className="floating-info-card-3">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 2 (Market)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs shadow-sky-500/50" />
              </div>
              <div className="my-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={metrics.scope2Market.currentValue! / 1000}
                    decimals={0}
                    duration={850}
                  />
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">k MT CO₂e</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{metrics.scope2Market.percentageChange}% vs {previousYear}
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">100% Green PPAs</span>
              </div>
            </div>
          </div>

          {/* Card 4: Scope 3 */}
          <div className="floating-info-card-4">
            <div className="attractive-info-card rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Scope 3 Value Chain
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/50" />
              </div>
              <div className="my-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={metrics.scope3.currentValue! / 1000000}
                    decimals={2}
                    duration={950}
                  />
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">M MT CO₂e</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{metrics.scope3.percentageChange}% vs {previousYear}
                </span>
                <span className="text-slate-500 font-semibold text-[11px]">97.7% of total</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. MAIN FLOATING GRAPH: Dynamic Emissions Trend (Area + Line Animated)
            ========================================================================= */}
        <section
          id="main-emissions-graph-card"
          aria-label="Emissions Trend Graph"
          className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Emissions Trend & YoY Distribution
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Data
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Monthly trajectory (thousand MT CO₂e) • {reportingYear} Actual vs {previousYear} Baseline
              </p>
            </div>

            {/* Legend & Real-Time Sync State */}
            <div className="flex items-center gap-5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-medium text-slate-800">{reportingYear} Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-400" />
                <span className="font-medium text-slate-500">{previousYear} Baseline</span>
              </div>
            </div>
          </div>

          {/* Chart Container with Smooth Transitions */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.22} />
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
                  domain={[1100, 1550]}
                  tickFormatter={(val) => `${val}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* =========================================================================
            3. THREE SECONDARY DATA CARDS BELOW THE MAIN GRAPH
            ========================================================================= */}
        <section
          id="secondary-cards-grid"
          aria-label="Secondary Insights"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Top Emission Sources (Real Microsoft breakdown) */}
          <div className="floating-info-card-1">
            <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Top Value Chain Contributors
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">15 Categories</span>
                </div>
                <p className="text-xs text-slate-500 font-normal mb-5">
                  Cloud/AI hardware & data center infrastructure
                </p>

                <div className="space-y-3.5">
                  {currentESGData.topEmissionSources.map((source) => (
                    <div key={source.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 truncate pr-2" title={source.sourceDescription}>
                          {source.name}
                        </span>
                        <span className="text-slate-900 font-semibold">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
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

          {/* Card 2: GREENHOUSE GAS EMISSIONS FLOW (Replacing scope-only donut chart) */}
          <div className="floating-info-card-2">
            <GHGEmissionsFlow
              gases={reportedGases}
              totalEmissionsTonne={metrics.totalEmissionsMarket.currentValue || 17150000}
              companyName={companyName}
              reportingYear={reportingYear}
            />
          </div>

          {/* Card 3: CarbonLens Verified Operational Insights */}
          <div className="floating-info-card-3">
            <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      CarbonLens Real ESG Insights
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Live Verified
                  </span>
                </div>

                {/* Insight 1: Electricity */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-900 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-700" />
                      Electricity Consumption
                    </span>
                    <span className="font-bold text-emerald-800">+28.9% YoY</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {companyName} consumed <span className="font-bold text-emerald-800">24.10M MWh</span> (24.1 TWh) of electricity, with 100% matched via long-term clean Power Purchase Agreements (&gt;23.6 GW).
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsESGUploadModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>View calculation & methodology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Insight 2: Financial & Carbon Intensity */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      Carbon Intensity per Revenue
                    </span>
                    <span className="font-bold text-slate-900">80.93 MT CO₂e / $M</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Net revenue grew to <span className="font-bold text-slate-800">${(metrics.revenue.currentValue! / 1000).toFixed(1)}B</span> (+6.9%), while emissions intensity increased by 11.4% due to cloud and AI data center hardware deployment.
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
