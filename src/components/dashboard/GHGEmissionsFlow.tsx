import React, { useState } from 'react';
import {
  Wind,
  ShieldCheck,
  Flame,
  Activity,
  Gauge,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { GHGEmittedGas } from '../../data/microsoftESGData';
import { AnimatedCounter } from './AnimatedCounter';

interface GHGEmissionsFlowProps {
  gases: GHGEmittedGas[];
  totalEmissionsTonne: number;
  companyName: string;
  reportingYear: number;
}

// User-specified simplified gas display names
const SIMPLIFIED_GAS_NAMES: Record<string, string> = {
  'CO₂': 'CO₂ – Carbon Dioxide',
  'CH₄': 'CH₄ – Methane',
  'N₂O': 'N₂O – Nitrous Oxide',
  'HFCs': 'HFCs – Refrigerants',
  'PFCs': 'PFCs – Industrial gases',
  'SF₆': 'SF₆ – Sulfur Hexafluoride',
  'NF₃': 'NF₃ – Nitrogen Trifluoride',
  'CO': 'CO – Carbon Monoxide',
  'NOx': 'NOx – Nitrogen Oxides',
  'SOx': 'SOx – Sulfur Oxides',
};

export const GHGEmissionsFlow: React.FC<GHGEmissionsFlowProps> = ({
  gases,
  totalEmissionsTonne,
  companyName,
  reportingYear,
}) => {
  const [viewTab, setViewTab] = useState<'all' | 'ghg' | 'pollutants' | 'matrix'>('all');
  const [hoveredGas, setHoveredGas] = useState<GHGEmittedGas | null>(null);

  // Strictly separate Greenhouse Gases (7 Kyoto/GHG Protocol gases) and Air Pollutants
  const greenhouseGases = gases.filter((g) => g.gasCategory === 'ghg');
  const airPollutants = gases.filter((g) => g.gasCategory === 'air_quality');

  const reportedGHGCount = greenhouseGases.filter((g) => g.isAvailable).length;
  const reportedPollutantsCount = airPollutants.filter((g) => g.isAvailable).length;

  return (
    <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full bg-white border border-slate-200">
      <div className="space-y-4">
        {/* Header & Section Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Greenhouse Gas Emissions & Monitored Gases Flow
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Physical gas streams, GWP equivalence, and monitored combustion criteria pollutants.
                </p>
              </div>
            </div>
          </div>

          {/* Section View Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Sections
            </button>
            <button
              type="button"
              onClick={() => setViewTab('ghg')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'ghg'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              GHGs ({reportedGHGCount}/7)
            </button>
            <button
              type="button"
              onClick={() => setViewTab('pollutants')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'pollutants'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Air Pollutants ({reportedPollutantsCount})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Matrix Table
            </button>
          </div>
        </div>

        {/* View: Standard Matrix Table */}
        {viewTab === 'matrix' ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm max-h-[440px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3">Gas Stream</th>
                  <th className="p-3 text-right">Reported Mass</th>
                  <th className="p-3 text-right">GWP Standard</th>
                  <th className="p-3 text-right">tCO₂e Equivalent</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {gases.map((gas) => (
                  <tr key={gas.formula} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: gas.color }} />
                        <span>{SIMPLIFIED_GAS_NAMES[gas.formula] || `${gas.formula} – ${gas.name}`}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-right text-slate-800 font-semibold">
                      {gas.isAvailable && gas.reportedMass !== null
                        ? `${gas.reportedMass.toLocaleString()} ${gas.reportedMassUnit}`
                        : '—'}
                    </td>
                    <td className="p-3 font-mono text-right text-xs text-slate-500">
                      {gas.gwpFactor > 0 ? `AR5 GWP = ${gas.gwpFactor.toLocaleString()}` : 'Excluded (GWP = 0)'}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 text-right">
                      {gas.tco2eEquivalent !== null
                        ? `${gas.tco2eEquivalent.toLocaleString()} tCO₂e`
                        : 'N/A (Criteria Air Pollutant)'}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        gas.gasCategory === 'ghg'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {gas.gasCategory === 'ghg' ? 'Greenhouse Gas' : 'Air Pollutant'}
                      </span>
                    </td>
                    <td className="p-3">
                      {gas.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Reported
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Not Reported</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            {/* =========================================================================
                SECTION 1: GREENHOUSE GASES (GHG PROTOCOL / KYOTO 7 GASES)
                ========================================================================= */}
            {(viewTab === 'all' || viewTab === 'ghg') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Reported Greenhouse Gases ({reportedGHGCount} of 7 Available)</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-900 hidden sm:inline">
                    IPCC AR5 100-Year Global Warming Potential (GWP)
                  </span>
                </div>

                {/* Greenhouse Gases Cards */}
                <div className="space-y-2">
                  {greenhouseGases.map((gas) => {
                    const isReported = gas.isAvailable;
                    const isHovered = hoveredGas?.formula === gas.formula;
                    const displayName = SIMPLIFIED_GAS_NAMES[gas.formula] || `${gas.formula} – ${gas.name}`;

                    return (
                      <div
                        key={gas.formula}
                        onMouseEnter={() => setHoveredGas(gas)}
                        onMouseLeave={() => setHoveredGas(null)}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isHovered
                            ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs scale-[1.008]'
                            : isReported
                            ? 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/80'
                            : 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                              style={{ backgroundColor: gas.color }}
                            />
                            <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                              {displayName}
                            </span>
                            <span className="text-xs text-slate-500 font-mono hidden md:inline">
                              (GWP: {gas.gwpFactor.toLocaleString()})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            {isReported ? (
                              <>
                                <span className="font-mono text-xs sm:text-sm text-slate-600">
                                  {gas.reportedMass?.toLocaleString()} {gas.reportedMassUnit}
                                </span>
                                {gas.tco2eEquivalent !== null && (
                                  <>
                                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                                      {gas.tco2eEquivalent >= 1000000
                                        ? `${(gas.tco2eEquivalent / 1000000).toFixed(2)}M`
                                        : `${(gas.tco2eEquivalent / 1000).toFixed(1)}k`}{' '}
                                      <span className="text-xs font-normal text-slate-500">tCO₂e</span>
                                    </span>
                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                      {gas.percentageOfTotal}%
                                    </span>
                                  </>
                                )}
                              </>
                            ) : (
                              <span className="text-xs italic text-slate-400 font-medium">
                                Not reported in boundary
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Proportional Distribution Bar */}
                        {isReported && gas.percentageOfTotal !== null && (
                          <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden mt-2.5">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.max(gas.percentageOfTotal, 1.5)}%`,
                                backgroundColor: gas.color,
                              }}
                            />
                          </div>
                        )}

                        {/* Interactive Scope & Source Details */}
                        {isHovered && isReported && (
                          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                            <span><strong className="text-slate-800">Source:</strong> {gas.primarySource}</span>
                            <span className="font-mono text-slate-500">{gas.operationalBoundary}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Combined GHG Footprint Footer */}
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Combined GHG Carbon Footprint (Kyoto Protocol Basket)
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white mt-0.5 font-mono">
                      <AnimatedCounter
                        value={totalEmissionsTonne / 1000000}
                        decimals={2}
                        suffix="M MT CO₂e"
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>100-Year GWP Equivalence Total</div>
                    <div className="text-emerald-400 font-bold text-sm">100.0% Disclosed Inventory</div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                SECTION 2: AIR POLLUTANTS (SEPARATE SECTION — NOT MIXED WITH GHGs!)
                ========================================================================= */}
            {(viewTab === 'all' || viewTab === 'pollutants') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Flame className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Air Pollutants (Non-GHG Criteria Pollutants: CO, NOx, SOx)</span>
                  </div>
                  <span className="font-mono text-xs text-amber-900 hidden sm:inline">
                    EPA Clean Air Act Title V Point-Source Monitoring
                  </span>
                </div>

                <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                  <strong>Notice on Air Pollutants:</strong> Carbon Monoxide (CO), Nitrogen Oxides (NOx), and Sulfur Oxides (SOx) are monitored point-source criteria air pollutants produced during onsite fuel combustion and backup generator testing. They are measured directly in physical mass (MT) and are <em>not</em> greenhouse gases (GWP = 0, excluded from corporate tCO₂e totals).
                </div>

                {/* Air Pollutants Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {airPollutants.map((pollutant) => {
                    const displayName = SIMPLIFIED_GAS_NAMES[pollutant.formula] || `${pollutant.formula} – ${pollutant.name}`;

                    return (
                      <div
                        key={pollutant.formula}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pollutant.color }}
                          />
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Criteria Pollutant
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {displayName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{pollutant.chemicalClass}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 font-medium">Monitored Mass:</span>
                          <span className="font-mono font-bold text-slate-900 text-base">
                            {pollutant.reportedMass?.toLocaleString()} MT
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg leading-tight">
                          {pollutant.primarySource}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
