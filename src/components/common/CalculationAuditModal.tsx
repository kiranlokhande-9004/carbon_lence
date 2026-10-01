import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, FileText, Info, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';
import { getDataQualityBadgeColor, getScopeBadgeColor } from '../../utils/calculationEngine';

export const CalculationAuditModal: React.FC = () => {
  const { selectedRecordForAudit, setSelectedRecordForAudit } = useApp();

  if (!selectedRecordForAudit) return null;

  const r = selectedRecordForAudit;
  const qualityBadge = getDataQualityBadgeColor(r.dataQuality);
  const scopeBadge = getScopeBadgeColor(r.scope);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Calculation Audit Trace</h3>
              <p className="text-xs text-slate-500">GHG Protocol Deterministic Formula</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecordForAudit(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Top Activity Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${scopeBadge.bg} ${scopeBadge.text} mb-1.5`}>
                  {r.scope} • {r.category}
                </span>
                <h4 className="font-semibold text-slate-900 text-base">{r.activityName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Reported on {r.date} • {r.source}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">{r.co2eTonne.toFixed(3)} tCO₂e</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${qualityBadge.bg} ${qualityBadge.border} mt-1`}>
                  {r.dataQuality} Confidence
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Formula Walkthrough */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Deterministic Formula
            </h5>
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Activity Data:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {r.quantity.toLocaleString()} {r.unit}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Emission Factor:</span>
                <span className="font-mono font-semibold text-slate-900">
                  × {r.factorValue} {r.factorUnit}
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Subtotal (kgCO₂e):</span>
                <span className="font-mono font-bold text-slate-900">
                  = {r.co2eKg.toLocaleString()} kgCO₂e
                </span>
              </div>

              <div className="flex items-center justify-between text-sm bg-emerald-100/60 p-2 rounded-lg">
                <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" /> Convert to Metric Tonnes (÷ 1,000):
                </span>
                <span className="font-mono font-bold text-emerald-900 text-base">
                  {r.co2eTonne.toFixed(3)} tCO₂e
                </span>
              </div>
            </div>
          </div>

          {/* Factor Metadata & Transparency */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Factor Citation & Lineage
            </h5>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="flex justify-between p-2.5">
                <span className="text-slate-500">Factor Name</span>
                <span className="font-medium text-slate-800">{r.factorName}</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-500">Source Database</span>
                <span className="font-medium text-slate-800">{r.factorSource}</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-500">Vintage & Version</span>
                <span className="font-medium text-slate-800">{r.factorYear} ({r.factorVersion})</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-500">Primary Evidentiary Source</span>
                <span className="font-medium text-slate-800">{r.source}</span>
              </div>
              {r.notes && (
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500">Operational Notes</span>
                  <span className="font-medium text-slate-800 max-w-xs text-right">{r.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Compliance & Verification Statement */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              This emission calculation is completely traceable, deterministic, and aligns with the Greenhouse Gas (GHG) Protocol Corporate Accounting and Reporting Standard.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={() => setSelectedRecordForAudit(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Close Audit Trace
          </button>
        </div>
      </div>
    </div>
  );
};
