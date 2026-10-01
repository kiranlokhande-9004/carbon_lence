import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Zap,
  Truck,
  Plus,
  Calculator,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatTonne, getDataQualityBadgeColor } from '../../utils/calculationEngine';

// ============================================================================
// SCOPE 1 (DIRECT EMISSIONS)
// ============================================================================
export const Scope1Page: React.FC = () => {
  const { filteredRecords, metrics, setIsAddRecordModalOpen, setSelectedRecordForAudit } = useApp();

  const records = filteredRecords.filter((r) => r.scope === 'Scope 1');

  // Breakdown by subcategories
  const stationary = records
    .filter((r) => r.category === 'Stationary Combustion')
    .reduce((acc, r) => acc + r.co2eTonne, 0);
  const mobile = records
    .filter((r) => r.category === 'Mobile Combustion')
    .reduce((acc, r) => acc + r.co2eTonne, 0);
  const fugitive = records
    .filter((r) => r.category === 'Fugitive Emissions')
    .reduce((acc, r) => acc + r.co2eTonne, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 1: Direct Greenhouse Gas Emissions
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                Direct Control
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Emissions from company-owned furnaces, boilers, vehicles, and direct refrigerant leakages.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scope 1 Activity</span>
        </button>
      </div>

      {/* Industrial Visual Context + Metric Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Industrial Equipment / Boiler Facility Visual */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-slate-900 border border-slate-900/8 shadow-xs relative group min-h-[220px] flex flex-col justify-end p-5">
          <img
            src="/assets/factory_modern.jpg"
            alt="Industrial Combustion Facility"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-orange-200 bg-orange-950/70 border border-orange-500/30 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              DIRECT THERMAL ASSETS
            </span>
            <h4 className="text-white text-sm font-semibold">Boilers, Stationary Heat & Fleet</h4>
            <p className="text-xs text-slate-200">Continuous emissions telemetry for onsite fossil fuel combustion.</p>
          </div>
        </div>

        {/* Right: 4 Subcategory Metric Cards (7 cols on lg) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="floating-info-card-1">
            <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scope 1 Volume</span>
              <div className="text-2xl font-black text-slate-900">{metrics.scope1Tonne.toFixed(1)} tCO₂e</div>
              <p className="text-[11px] text-slate-400 font-medium">
                {((metrics.scope1Tonne / (metrics.totalEmissionsTonne || 1)) * 100).toFixed(0)}% of corporate total
              </p>
            </div>
          </div>

          <div className="floating-info-card-2">
            <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stationary Combustion</span>
              <div className="text-2xl font-black text-orange-600">{stationary.toFixed(1)} tCO₂e</div>
              <p className="text-[11px] text-slate-400 font-medium">Boilers, ovens & gas</p>
            </div>
          </div>

          <div className="floating-info-card-3">
            <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile Combustion</span>
              <div className="text-2xl font-black text-orange-600">{mobile.toFixed(1)} tCO₂e</div>
              <p className="text-[11px] text-slate-400 font-medium">Delivery fleet & diesel</p>
            </div>
          </div>

          <div className="floating-info-card-4">
            <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fugitive Emissions</span>
              <div className="text-2xl font-black text-orange-600">{fugitive.toFixed(1)} tCO₂e</div>
              <p className="text-[11px] text-slate-400 font-medium">HVAC refrigerant leakages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scope 1 Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Scope 1 Activity Entries ({records.length})</h3>
          <span className="text-xs text-slate-500">Regulated under GHG Protocol Chapter 4</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Activity Description</th>
                <th className="py-2.5 px-3">Subcategory</th>
                <th className="py-2.5 px-3">Fuel / Fluid</th>
                <th className="py-2.5 px-3">Factor Applied</th>
                <th className="py-2.5 px-3">Emissions</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-slate-500">{r.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{r.activityName}</td>
                  <td className="py-3 px-3">{r.category}</td>
                  <td className="py-3 px-3 font-mono font-semibold">{r.quantity.toLocaleString()} {r.unit}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{r.factorValue} {r.factorUnit}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{r.co2eTonne.toFixed(3)} tCO₂e</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedRecordForAudit(r)}
                      className="px-2 py-1 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 text-[11px] font-semibold transition-colors"
                    >
                      Audit Formula
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCOPE 2 (ELECTRICITY & STEAM)
// ============================================================================
export const Scope2Page: React.FC = () => {
  const { filteredRecords, metrics, business, setIsAddRecordModalOpen, setSelectedRecordForAudit } = useApp();

  const records = filteredRecords.filter((r) => r.scope === 'Scope 2');
  const totalKWh = records.reduce((acc, r) => acc + (r.unit === 'kWh' ? r.quantity : 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 2: Purchased Electricity & Energy
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-700">
                Indirect Energy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Emissions from the generation of purchased electricity, steam, heating, and cooling consumed by your facility.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Utility Bill</span>
        </button>
      </div>

      {/* Scope 2 Method Explanation Banner */}
      <div className="p-4 bg-sky-50/80 border border-sky-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-sky-900 shadow-xs">
        <div className="space-y-1">
          <span className="font-bold block text-sm">Location-Based Accounting Method Applied</span>
          <p className="leading-relaxed">
            Calculated using India Central Electricity Authority (CEA) grid average factor: <span className="font-mono font-semibold">0.820 kgCO₂e/kWh</span>.
            If your facility purchases Energy Attribute Certificates (EACs) or green tariffs, you can also report a market-based figure of 0.0 tCO₂e.
          </p>
        </div>
        <div className="floating-info-card-2 shrink-0">
          <div className="attractive-info-card text-right p-3.5 rounded-xl border border-sky-200/70">
            <div className="font-black text-lg text-slate-900">{totalKWh.toLocaleString()} kWh</div>
            <div className="text-[11px] font-semibold text-sky-700">Total Metered Electricity</div>
          </div>
        </div>
      </div>

      {/* Scope 2 Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Electricity & Utility Bills ({records.length})</h3>
          <span className="text-xs text-slate-500">Scope 2 Total: {metrics.scope2Tonne.toFixed(1)} tCO₂e</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Facility / Meter</th>
                <th className="py-2.5 px-3">Units (kWh)</th>
                <th className="py-2.5 px-3">Grid Emission Factor</th>
                <th className="py-2.5 px-3">Calculated (tCO₂e)</th>
                <th className="py-2.5 px-3">Data Quality</th>
                <th className="py-2.5 px-3 text-right">Audit Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-slate-500">{r.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">
                    <div>{r.activityName}</div>
                    <div className="text-[10px] text-slate-400">{r.source}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">{r.quantity.toLocaleString()} kWh</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{r.factorValue} kg/kWh</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{r.co2eTonne.toFixed(3)} tCO₂e</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.dataQuality}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedRecordForAudit(r)}
                      className="px-2 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-semibold transition-colors"
                    >
                      Audit Formula
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCOPE 3 (VALUE CHAIN)
// ============================================================================
export const Scope3Page: React.FC = () => {
  const { filteredRecords, metrics, setIsAddRecordModalOpen, setSelectedRecordForAudit } = useApp();

  const records = filteredRecords.filter((r) => r.scope === 'Scope 3');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 3: Value Chain & Supply Chain
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                Upstream & Downstream
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Selected categories: Purchased Goods & Services, Waste in Operations, Business Travel, and Employee Commute.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scope 3 Record</span>
        </button>
      </div>

      {/* Scope 3 Categories breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="floating-info-card-1">
          <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scope 3</span>
            <div className="text-2xl font-black text-slate-900">{metrics.scope3Tonne.toFixed(1)} tCO₂e</div>
            <p className="text-[11px] text-slate-400 font-medium">Value chain inventory</p>
          </div>
        </div>

        <div className="floating-info-card-2">
          <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Purchased Goods (Cat 1)</span>
            <div className="text-2xl font-black text-emerald-600">18.6 tCO₂e</div>
            <p className="text-[11px] text-slate-400 font-medium">Coffee beans & packaging</p>
          </div>
        </div>

        <div className="floating-info-card-3">
          <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Flights (Cat 6)</span>
            <div className="text-2xl font-black text-emerald-600">3.8 tCO₂e</div>
            <p className="text-[11px] text-slate-400 font-medium">Domestic & short-haul flights</p>
          </div>
        </div>

        <div className="floating-info-card-4">
          <div className="attractive-info-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Commute (Cat 7)</span>
            <div className="text-2xl font-black text-emerald-600">12.4 tCO₂e</div>
            <p className="text-[11px] text-slate-400 font-medium">42 staff daily transit</p>
          </div>
        </div>
      </div>

      {/* Scope 3 Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Scope 3 Activity Entries ({records.length})</h3>
          <span className="text-xs text-slate-500">GHG Protocol Corporate Value Chain Standard</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Activity / Material</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Emission Factor</th>
                <th className="py-2.5 px-3">Emissions (tCO₂e)</th>
                <th className="py-2.5 px-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-slate-500">{r.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{r.activityName}</td>
                  <td className="py-3 px-3">{r.category}</td>
                  <td className="py-3 px-3 font-mono">{r.quantity.toLocaleString()} {r.unit}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{r.factorValue} {r.factorUnit}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{r.co2eTonne.toFixed(3)} tCO₂e</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedRecordForAudit(r)}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
