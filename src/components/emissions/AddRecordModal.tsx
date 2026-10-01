import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calculator, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { calculateEmissions } from '../../utils/calculationEngine';
import { ScopeType, DataQuality } from '../../types';

export const AddRecordModal: React.FC = () => {
  const { isAddRecordModalOpen, setIsAddRecordModalOpen, factors, addEmissionRecord, business } = useApp();

  const [scope, setScope] = useState<ScopeType>('Scope 2');
  const [category, setCategory] = useState('Purchased Electricity');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('kWh');
  const [selectedFactorId, setSelectedFactorId] = useState<string>('');
  const [source, setSource] = useState('');
  const [dataQuality, setDataQuality] = useState<DataQuality>('High');
  const [notes, setNotes] = useState('');

  // Available factors for selected scope
  const availableFactors = factors.filter((f) => f.scope === scope);

  // Auto-select first matching factor when scope changes
  useEffect(() => {
    if (availableFactors.length > 0 && !availableFactors.some((f) => f.id === selectedFactorId)) {
      setSelectedFactorId(availableFactors[0].id);
      setUnit(availableFactors[0].unit);
      setCategory(availableFactors[0].category);
    }
  }, [scope, factors]);

  // When factor is selected, update unit & category
  const activeFactor = factors.find((f) => f.id === selectedFactorId) || availableFactors[0];

  useEffect(() => {
    if (activeFactor) {
      setUnit(activeFactor.unit);
      setCategory(activeFactor.category);
    }
  }, [selectedFactorId]);

  if (!isAddRecordModalOpen) return null;

  // Real-time calculation
  const factorVal = activeFactor ? activeFactor.value : 0;
  const factorUnit = activeFactor ? activeFactor.unit : '';
  const numQty = Number(quantity) || 0;
  const calculation = calculateEmissions(numQty, factorVal, unit, `kgCO₂e/${factorUnit}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFactor || numQty <= 0) return;

    addEmissionRecord({
      businessId: business.id,
      date,
      activityName: activityName || `${activeFactor.name} usage`,
      category,
      scope,
      quantity: numQty,
      unit,
      factorId: activeFactor.id,
      factorName: activeFactor.name,
      factorValue: activeFactor.value,
      factorUnit: `kgCO₂e/${activeFactor.unit}`,
      factorSource: activeFactor.source,
      factorYear: activeFactor.year,
      factorVersion: activeFactor.version,
      source: source || 'Utility Bill / Operational Log',
      dataQuality,
      notes,
      status: 'Verified',
    });

    setIsAddRecordModalOpen(false);
    // Reset form
    setQuantity('');
    setActivityName('');
    setSource('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Log Activity Data</h3>
              <p className="text-xs text-slate-500">Enter operational data for automatic carbon calculation</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddRecordModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Scope Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Greenhouse Gas Scope
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Scope 1', 'Scope 2', 'Scope 3'] as ScopeType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                    scope === s
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                  <span className="block text-[10px] font-normal opacity-80">
                    {s === 'Scope 1' ? 'Direct' : s === 'Scope 2' ? 'Electricity' : 'Value Chain'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Factor Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Activity & Emission Factor
            </label>
            <select
              value={selectedFactorId}
              onChange={(e) => setSelectedFactorId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            >
              {availableFactors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.value} kgCO₂e/{f.unit} ({f.source})
                </option>
              ))}
            </select>
            {activeFactor && (
              <p className="text-[11px] text-slate-500 mt-1">
                Source: <span className="font-semibold">{activeFactor.source}</span> ({activeFactor.year}, {activeFactor.region}) • {activeFactor.notes}
              </p>
            )}
          </div>

          {/* Activity Description & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Activity Name / Label
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="e.g. Factory Main Substation Bill"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reporting Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Activity Consumption Quantity
              </label>
              <input
                type="number"
                step="any"
                required
                min="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 14500"
                className="w-full px-3 py-2 text-xs font-mono font-semibold border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Unit of Measure
              </label>
              <input
                type="text"
                disabled
                value={unit}
                className="w-full px-3 py-2 text-xs font-mono font-semibold border border-slate-200 rounded-xl bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Real-time Calculation Preview Callout */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Real-time Calculation Preview
              </span>
              <span className="font-mono text-sm font-bold text-emerald-800">
                {calculation.co2eTonne.toFixed(3)} tCO₂e
              </span>
            </div>
            <p className="text-[11px] font-mono text-emerald-800/80">
              {calculation.formula} = {calculation.co2eKg.toLocaleString()} kgCO₂e
            </p>
          </div>

          {/* Source Document & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Evidentiary Source Reference
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Utility Inv #40928 / Fuel Receipt"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data Quality Confidence
              </label>
              <select
                value={dataQuality}
                onChange={(e) => setDataQuality(e.target.value as DataQuality)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="High">High (Metered, invoiced actuals)</option>
                <option value="Medium">Medium (Modeled, fleet averages)</option>
                <option value="Low">Low (Spend-based, rough estimate)</option>
              </select>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Audit Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shift 1 production hours included"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={numQty <= 0}
              className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
            >
              Save Record & Recalculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
