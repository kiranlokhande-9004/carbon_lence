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
  const [activeTab, setActiveTab] = useState<'flow' | 'matrix'>('flow');
  const [selectedGas, setSelectedGas] = useState<GHGEmittedGas | null>(null);

  const reportedGasesCount = gases.filter((g) => g.isAvailable).length;

  return (
    <div className="attractive-info-card backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header & Controls */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Greenhouse Gas Emissions Flow
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Filtered & reported physical gases converted to equivalent tCO₂e
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('flow')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Gas Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Gas Matrix
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 mb-4 text-[11px]">
          <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Reported/Available Gases ({reportedGasesCount} of {gases.length})
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            IPCC AR5 100-Year GWP
          </span>
        </div>

        {/* View 1: Interactive Gas Flow Pipeline */}
        {activeTab === 'flow' && (
          <div className="space-y-3">
            {/* Visual Gas Convergence Streams */}
            <div className="space-y-2">
              {gases.map((gas) => {
                const isReported = gas.isAvailable && gas.tco2eEquivalent !== null;
                const isSelected = selectedGas?.formula === gas.formula;

                return (
                  <div
                    key={gas.formula}
                    onMouseEnter={() => setSelectedGas(gas)}
                    onMouseLeave={() => setSelectedGas(null)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs scale-[1.01]'
                        : isReported
                        ? 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-100'
                        : 'bg-slate-50/40 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: gas.color }}
                        />
                        <span className="font-bold text-slate-900 font-mono">
                          {gas.formula}
                        </span>
                        <span className="text-[11px] text-slate-600 truncate max-w-[130px] sm:max-w-[170px]">
                          {gas.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-right">
                        {isReported ? (
                          <>
                            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                              {gas.reportedMass?.toLocaleString()} {gas.reportedMassUnit.split(' ')[0]}
                            </span>
                            <span className="text-[11px] font-bold text-slate-900 font-mono">
                              {gas.tco2eEquivalent! >= 1000000
                                ? `${(gas.tco2eEquivalent! / 1000000).toFixed(2)}M`
                                : `${(gas.tco2eEquivalent! / 1000).toFixed(1)}k`}{' '}
                              <span className="text-[10px] font-normal text-slate-400">tCO₂e</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1 rounded">
                              {gas.percentageOfTotal}%
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] italic text-slate-400 font-medium">
                            Not reported
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Proportional Distribution Bar */}
                    {isReported && (
                      <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(gas.percentageOfTotal || 0, 1.5)}%`,
                            backgroundColor: gas.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Combined Convergence Box */}
            <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Combined Total Footprint
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  <AnimatedCounter
                    value={totalEmissionsTonne / 1000000}
                    decimals={2}
                    suffix="M MT CO₂e"
                  />
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <div>GWP Equivalence Sum</div>
                <div className="text-emerald-400 font-bold">100.0% Accounted</div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Detailed Gas Composition Matrix */}
        {activeTab === 'matrix' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-2">Gas</th>
                  <th className="p-2 text-right">Mass Reported</th>
                  <th className="p-2 text-right">GWP Factor</th>
                  <th className="p-2 text-right">tCO₂e Eq.</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600">
                {gases.map((gas) => (
                  <tr key={gas.formula} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 font-bold text-slate-900 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: gas.color }} />
                        <span>{gas.formula}</span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono text-slate-700">
                      {gas.reportedMass !== null
                        ? `${gas.reportedMass.toLocaleString()} MT`
                        : <span className="italic text-slate-400">N/A</span>}
                    </td>
                    <td className="p-2 text-right font-mono text-slate-500">
                      {gas.gwpFactor.toLocaleString()}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">
                      {gas.tco2eEquivalent !== null
                        ? `${gas.tco2eEquivalent.toLocaleString()}`
                        : <span className="italic text-slate-400">—</span>}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          gas.status === 'Reported'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {gas.status}
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
          <div className="mt-3 p-2.5 bg-slate-900 text-white rounded-xl text-[11px] space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span>{selectedGas.formula} • {selectedGas.name}</span>
              <span>{selectedGas.gwpReference}</span>
            </div>
            <p className="text-slate-300 text-[10px] leading-snug">
              <strong className="text-white">Primary Source:</strong> {selectedGas.primarySource}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
