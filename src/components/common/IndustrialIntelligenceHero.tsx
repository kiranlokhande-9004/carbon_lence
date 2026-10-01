import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  Activity,
  Layers,
  Zap,
  Building2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface IndustrialIntelligenceHeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  currentEmissions?: number;
  pctChange?: string;
  energyImpact?: number;
  energyPct?: number;
  imageSrc?: string;
  facilityName?: string;
  statusText?: string;
  showExploreLink?: boolean;
  onExploreClick?: () => void;
}

export const IndustrialIntelligenceHero: React.FC<IndustrialIntelligenceHeroProps> = ({
  title = 'Industrial Emissions Intelligence',
  subtitle = 'Converting physical facility activity into verified greenhouse gas metrics.',
  badge = 'FACILITY 01 • ACTIVE MONITORING',
  currentEmissions = 107.2,
  pctChange = '↓ 8.4% vs baseline',
  energyImpact = 54.7,
  energyPct = 42.5,
  imageSrc = '/assets/factory_emission_aerial.jpg',
  facilityName = 'Oakridge Precision Plant #4',
  statusText = 'Continuous Activity Feed Active',
  showExploreLink = false,
  onExploreClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // 7-point trend data for the floating card's compact SVG line chart
  const dataPoints = [
    { label: 'Jan', val: 124 },
    { label: 'Feb', val: 121 },
    { label: 'Mar', val: 119 },
    { label: 'Apr', val: 115 },
    { label: 'May', val: 112 },
    { label: 'Jun', val: 109 },
    { label: 'Jul', val: 107.2 },
  ];

  const minVal = 100;
  const maxVal = 130;
  const chartWidth = 260;
  const chartHeight = 70;

  // Compute SVG coordinates
  const coords = dataPoints.map((pt, i) => {
    const x = (i / (dataPoints.length - 1)) * chartWidth;
    const y = chartHeight - ((pt.val - minVal) / (maxVal - minVal)) * (chartHeight - 14) - 7;
    return { x, y, ...pt };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Circular progress ring calculation
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (energyPct / 100) * ringCircumference;

  return (
    <div
      id="industrial-intelligence-showcase"
      className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-900/8 shadow-xs relative overflow-visible transition-all duration-300 card-hover-lift hover:-translate-y-[2px]"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {badge}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{statusText}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
            {title}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">{subtitle}</p>
        </div>

        {showExploreLink && onExploreClick && (
          <button
            onClick={onExploreClick}
            className="self-start sm:self-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-transform hover:translate-x-0.5"
          >
            <span>View All Assets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Composition: Left Factory Image + Right Floating Analytics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
        {/* ===================================================================
            LEFT: LARGE INDUSTRIAL FACTORY VISUAL CARD (7 cols on desktop)
            =================================================================== */}
        <div className="lg:col-span-7 relative group">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-900/10 shadow-sm min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] aspect-16/10 sm:aspect-16/9">
            <img
              src={imageSrc}
              alt={facilityName}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Subtle Gradient Framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

            {/* Overlay Telemetry Metadata */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{facilityName}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-medium">
                  Asset Status
                </span>
                <p className="text-xs font-semibold flex items-center gap-1 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                  Telemetry stream synchronized • GHG Protocol compliant
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-slate-300">Reporting Boundary</span>
                <p className="text-xs font-mono font-semibold text-emerald-300">Operational Control</p>
              </div>
            </div>
          </div>

          {/* =================================================================
              SECOND SMALL FLOATING CARD: Overlapping the Factory Visual
              ================================================================= */}
          <div
            id="floating-energy-card"
            className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:right-6 bg-white/98 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-emerald-600/20 shadow-lg z-20 flex items-center gap-3 animate-float-gentle-reverse max-w-xs transition-all hover:shadow-xl hover:-translate-y-1"
            style={{
              boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
            }}
          >
            {/* SVG Circular Ring Indicator */}
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r={ringRadius}
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={ringRadius}
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <Zap className="w-4 h-4 text-emerald-600 absolute" />
            </div>

            {/* Metric Text */}
            <div className="pr-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  ENERGY IMPACT
                </span>
                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                  Scope 2
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  {energyImpact}
                </span>
                <span className="text-[11px] font-medium text-slate-500">tCO₂e</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                <strong className="text-slate-700">{energyPct}%</strong> of facility inventory
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT: FLOATING EMISSION ANALYTICS CARD (5 cols on desktop)
            =================================================================== */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div
            id="floating-emission-card"
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-900/10 shadow-md relative z-10 animate-float-gentle transition-all hover:shadow-xl"
            style={{
              boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(5, 150, 105, 0.08)',
            }}
          >
            {/* Header of Floating Card */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  CARBON EMISSIONS
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                FY2026 Q3
              </span>
            </div>

            {/* Core Metric Display */}
            <div className="mt-4 mb-3 flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {currentEmissions}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1.5">tCO₂e</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/50">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{pctChange}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Real-time activity aggregates calculated against DEFRA & GHG Protocol 2026 emission factors.
            </p>

            {/* Compact Animated Line / Area Chart */}
            <div className="mt-2 pt-2 bg-slate-50/70 rounded-xl p-3 border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                <span>Emission Run-rate (YTD)</span>
                <span className="text-emerald-700 font-bold">107.2 tCO₂e target met</span>
              </div>

              {/* Clean SVG Area + Line Chart */}
              <div className="relative w-full h-[70px] overflow-hidden">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal clean grid line */}
                  <line
                    x1="0"
                    y1={chartHeight / 2}
                    x2={chartWidth}
                    y2={chartHeight / 2}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />

                  {/* Gradient Area Fill */}
                  <path
                    d={areaD}
                    fill="url(#emissionGradient)"
                    className={`transition-opacity duration-1000 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Smooth animated line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 350,
                      strokeDashoffset: isLoaded ? 0 : 350,
                      transition: 'stroke-dashoffset 1.4s ease-out',
                    }}
                  />

                  {/* Data points */}
                  {coords.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={i === coords.length - 1 ? 4 : 2.5}
                      fill={i === coords.length - 1 ? '#059669' : '#ffffff'}
                      stroke="#059669"
                      strokeWidth={i === coords.length - 1 ? 2.5 : 1.5}
                      className={`transition-all duration-700 delay-${i * 100} ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                    />
                  ))}
                </svg>
              </div>

              {/* Minimal Axis Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-200/50">
                {dataPoints.map((d, i) => (
                  <span key={i}>{d.label}</span>
                ))}
              </div>
            </div>

            {/* Quick Audit Footer Note */}
            <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Audit Trail Active
              </span>
              <span className="text-slate-400">ISO 14064 verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
