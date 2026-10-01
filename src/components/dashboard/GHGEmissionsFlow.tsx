import React, { useState } from 'react';
import {
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Wind,
  ShieldCheck,
  Flame,
  Activity,
  Gauge,
} from 'lucide-react';
import { GHGEmittedGas } from '../../data/microsoftESGData';
import { AnimatedCounter } from './AnimatedCounter';

interface GHGEmissionsFlowProps {
  gases: GHGEmittedGas[];
  totalEmissionsTonne: number;
  companyName: string;
  reportingYear: number;
}

export const GHGEmissionsFlow: React.FC<GHGEmissionsFlowProps> = ({
  gases,
  totalEmissionsTonne,
  companyName,
  reportingYear,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'ghg' | 'air_quality' | 'matrix'>('all');
  const [selectedGas, setSelectedGas] = useState<GHGEmittedGas | null>(null);

  // Filtered gases list based on mode
  const displayedGases = gases.filter((g) => {
    if (filterMode === 'ghg') return g.gasCategory === 'ghg';
    if (filterMode === 'air_quality') return g.gasCategory === 'air_quality';
    return true; // 'all' or 'matrix'
  });

  const reportedGasesCount = gases.filter((g) => g.isAvailable).length;

  return (
    <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Emissions & Monitored Gases Flow
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Filtered & reported physical gases: GHGs (tCO₂e) and Monitored Combustion (CO, NOx, SOx)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Gases
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('ghg')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMode === 'ghg'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              GHG Scopes
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('air_quality')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMode === 'air_quality'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              CO / NOx / SOx
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('matrix')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                filterMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Matrix Table
            </button>
          </div>
        </div>

        {/* Status Badge & Monitoring Standard */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 mb-4 text-xs">
          <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Reported/Available Gases ({reportedGasesCount} of {gases.length} Monitored)
          </span>
          <span className="text-[11px] text-slate-600 font-mono">
            IPCC AR5 GWP & EPA Title V
          </span>
        </div>

        {/* View 1: Interactive Gas Flow Pipeline */}
        {filterMode !== 'matrix' && (
          <div className="space-y-3">
            {/* Visual Gas Convergence Streams */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {displayedGases.map((gas) => {
                const isReported = gas.isAvailable;
                const isSelected = selectedGas?.formula === gas.formula;
                const isGHG = gas.gasCategory === 'ghg';

                return (
                  <div
                    key={gas.formula}
                    onMouseEnter={() => setSelectedGas(gas)}
                    onMouseLeave={() => setSelectedGas(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 shadow-2xs scale-[1.01]'
                        : isReported
                        ? 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/70'
                        : 'bg-slate-50/40 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: gas.color }}
                        />
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {gas.formula}
                        </span>
                        <span className="text-xs text-slate-700 font-medium truncate max-w-[120px] sm:max-w-[180px]">
                          {gas.name}
                        </span>
                        {!isGHG && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Air Quality
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-right">
                        {isReported ? (
                          <>
                            <span className="text-xs font-mono text-slate-600 hidden sm:inline">
                              {gas.reportedMass?.toLocaleString()} {gas.reportedMassUnit.split(' ')[0]}
                            </span>
                            {isGHG && gas.tco2eEquivalent !== null ? (
                              <>
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  {gas.tco2eEquivalent >= 1000000
                                    ? `${(gas.tco2eEquivalent / 1000000).toFixed(2)}M`
                                    : `${(gas.tco2eEquivalent / 1000).toFixed(1)}k`}{' '}
                                  <span className="text-xs font-normal text-slate-500">tCO₂e</span>
                                </span>
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                  {gas.percentageOfTotal}%
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                Monitored Stack
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs italic text-slate-500 font-medium">
                            Not reported
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Proportional Distribution Bar */}
                    {isReported && (
                      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              isGHG
                                ? Math.max(gas.percentageOfTotal || 0, 1.5)
                                : Math.min(((gas.reportedMass || 10) / 200) * 100, 100)
                            }%`,
                            backgroundColor: gas.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Combined Footprint Footer */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Combined GHG Carbon Footprint
                </div>
                <div className="text-lg font-black text-white mt-0.5">
                  <AnimatedCounter
                    value={totalEmissionsTonne / 1000000}
                    decimals={2}
                    suffix="M MT CO₂e"
                  />
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>GWP Equivalence Sum</div>
                <div className="text-emerald-400 font-bold">100.0% Disclosed</div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Detailed Gas Composition Matrix */}
        {filterMode === 'matrix' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs max-h-[320px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Gas Formula</th>
                  <th className="p-2.5 text-right">Mass Reported</th>
                  <th className="p-2.5 text-right">GWP / Standard</th>
                  <th className="p-2.5 text-right">tCO₂e Eq.</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {gases.map((gas) => (
                  <tr key={gas.formula} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-bold text-slate-900 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gas.color }} />
                        <span>{gas.formula}</span>
                        <span className="text-[11px] font-normal text-slate-500">({gas.name.split(' ')[0]})</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-800">
                      {gas.reportedMass !== null
                        ? `${gas.reportedMass.toLocaleString()} MT`
                        : <span className="italic text-slate-400">Not reported</span>}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-600">
                      {gas.gwpFactor > 0 ? gas.gwpFactor.toLocaleString() : gas.gwpReference.split(' ')[0]}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      {gas.tco2eEquivalent !== null
                        ? `${gas.tco2eEquivalent.toLocaleString()}`
                        : <span className="italic text-slate-400">—</span>}
                    </td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {gas.gasCategory === 'ghg' ? 'GHG' : 'Air Quality'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          gas.status === 'Reported'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        [{gas.status}]
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected Gas Inspection Tooltip */}
        {selectedGas && (
          <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span className="text-sm">{selectedGas.formula} • {selectedGas.name}</span>
              <span className="text-xs font-mono">{selectedGas.gwpReference}</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong className="text-white">Operational Source:</strong> {selectedGas.primarySource}
            </p>
            <p className="text-slate-400 text-[11px]">
              <strong className="text-slate-300">Accounting Boundary:</strong> {selectedGas.operationalBoundary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
