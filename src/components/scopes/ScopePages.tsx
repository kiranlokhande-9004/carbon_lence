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
  Building2,
} from 'lucide-react';

// ============================================================================
// SCOPE 1 (DIRECT EMISSIONS FROM COMPANY-OWNED/CONTROLLED SOURCES)
// ============================================================================
export const Scope1Page: React.FC = () => {
  const { filteredRecords, metrics, setIsAddRecordModalOpen, setSelectedRecordForAudit, currentESGData, reportingPeriod } = useApp();

  // Scope 1 represents ONLY direct emissions from company-owned/controlled sources
  const records = filteredRecords.filter((r) => r.scope === 'Scope 1');

  // Breakdown by the 3 standardized GHG Protocol Scope 1 categories:
  // 1. Stationary Combustion (Boilers, furnaces, heaters, onsite generators)
  // 2. Mobile Combustion (Company-owned delivery fleet, transport vehicles)
  // 3. Fugitive Emissions (Refrigerant leaks from chillers & HVAC cooling systems)
  const stationary = records
    .filter((r) => r.category === 'Stationary Combustion')
    .reduce((acc, r) => acc + (r.co2eTonne || 0), 0);

  const mobile = records
    .filter((r) => r.category === 'Mobile Combustion')
    .reduce((acc, r) => acc + (r.co2eTonne || 0), 0);

  const fugitive = records
    .filter((r) => r.category === 'Fugitive Emissions')
    .reduce((acc, r) => acc + (r.co2eTonne || 0), 0);

  // The Scope 1 total MUST equal the sum of the activity-table emissions
  const totalScope1 = stationary + mobile + fugitive;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 1: Direct Greenhouse Gas Emissions
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                Direct Operational Control
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentESGData.companyName} • CY {reportingPeriod}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Direct emissions from company-owned or controlled physical sources: boilers, furnaces, emergency standby generators, vehicles, and direct refrigerant top-ups.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scope 1 Activity</span>
        </button>
      </div>

      {/* Scope 1 GHG Accounting Principle Callout */}
      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-orange-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-900">
            <ShieldCheck className="w-4 h-4 text-orange-700" />
            <span>GHG Protocol Corporate Standard — Chapter 4 Direct Accounting</span>
          </div>
          <p className="text-xs sm:text-sm text-orange-900/90 leading-relaxed">
            Emissions are calculated dynamically as: <span className="font-mono font-bold bg-orange-100/90 px-1.5 py-0.5 rounded text-orange-950">Activity Quantity × Emission Factor ÷ 1,000</span>.
            The total direct volume strictly equals the mathematical sum of the underlying activity table below.
          </p>
        </div>
        <div className="shrink-0 text-right bg-white/90 p-3 rounded-xl border border-orange-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Records</div>
          <div className="text-lg font-black text-slate-900 font-mono">{records.length} Activity Traces</div>
        </div>
      </div>

      {/* Metric Summary Grid: Total Scope 1 + 3 Direct Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scope 1 Card: MUST EQUAL sum of activity-table emissions */}
        <div className="floating-info-card-1">
          <div className="attractive-info-card p-5 rounded-2xl space-y-1.5 h-full flex flex-col justify-between border-2 border-orange-200/80 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Scope 1 Volume</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {totalScope1 >= 10000
                ? totalScope1.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : totalScope1.toFixed(1)}{' '}
              <span className="text-sm font-bold text-slate-500">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>{((totalScope1 / (metrics.totalEmissionsTonne || 1)) * 100).toFixed(1)}% of corporate net total</span>
              <span className="text-orange-700 font-bold">Sum of Table</span>
            </p>
          </div>
        </div>

        {/* Stationary Combustion Card */}
        <div className="floating-info-card-2">
          <div className="attractive-info-card p-5 rounded-2xl space-y-1.5 h-full flex flex-col justify-between bg-white">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Stationary Combustion</span>
            <div className="text-2xl font-black text-orange-600 tracking-tight font-mono">
              {stationary >= 10000
                ? stationary.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : stationary.toFixed(1)}{' '}
              <span className="text-xs font-bold text-slate-500">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
              Campus boilers, heaters & standby generators
            </p>
          </div>
        </div>

        {/* Mobile Combustion Card */}
        <div className="floating-info-card-3">
          <div className="attractive-info-card p-5 rounded-2xl space-y-1.5 h-full flex flex-col justify-between bg-white">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile Combustion</span>
            <div className="text-2xl font-black text-orange-600 tracking-tight font-mono">
              {mobile >= 10000
                ? mobile.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : mobile.toFixed(1)}{' '}
              <span className="text-xs font-bold text-slate-500">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
              Company-owned delivery vans, trucks & fleet
            </p>
          </div>
        </div>

        {/* Fugitive Emissions Card */}
        <div className="floating-info-card-4">
          <div className="attractive-info-card p-5 rounded-2xl space-y-1.5 h-full flex flex-col justify-between bg-white">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fugitive Emissions</span>
            <div className="text-2xl font-black text-orange-600 tracking-tight font-mono">
              {fugitive >= 10000
                ? fugitive.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : fugitive.toFixed(1)}{' '}
              <span className="text-xs font-bold text-slate-500">tCO₂e</span>
            </div>
            <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
              HVAC chillers & datacenter refrigerant top-ups
            </p>
          </div>
        </div>
      </div>

      {/* Scope 1 Activity Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Direct Scope 1 Activity Entries ({records.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every row is computed dynamically as: <span className="font-mono font-semibold">Quantity × Factor Value ÷ 1,000</span>.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Table Sum: <span className="font-mono font-bold text-slate-900">{totalScope1.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tCO₂e</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Direct Activity Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Emission Factor</th>
                <th className="py-3 px-4 text-right">Calculated Emissions</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => {
                let catBadge = 'bg-orange-50 text-orange-800 border-orange-200';
                if (r.category === 'Mobile Combustion') catBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                if (r.category === 'Fugitive Emissions') catBadge = 'bg-purple-50 text-purple-800 border-purple-200';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-sm text-slate-500 whitespace-nowrap">{r.date}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{r.activityName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.source}</div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${catBadge}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 text-right whitespace-nowrap">
                      {r.quantity.toLocaleString()} {r.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 text-right whitespace-nowrap">
                      {r.factorValue} {r.factorUnit}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-right whitespace-nowrap text-sm">
                      {r.co2eTonne >= 1000
                        ? r.co2eTonne.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })
                        : r.co2eTonne.toFixed(3)}{' '}
                      <span className="text-xs font-normal text-slate-500">tCO₂e</span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecordForAudit(r)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold transition-colors cursor-pointer border border-orange-200/60"
                      >
                        Audit Formula
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCOPE 2 (PURCHASED ELECTRICITY & ENERGY)
// ============================================================================
export const Scope2Page: React.FC = () => {
  const { filteredRecords, metrics, setIsAddRecordModalOpen, setSelectedRecordForAudit } = useApp();

  const records = filteredRecords.filter((r) => r.scope === 'Scope 2');
  const totalKWh = records.reduce((acc, r) => acc + (r.unit === 'kWh' ? r.quantity : 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 2: Purchased Electricity & Energy
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
                Indirect Energy
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Emissions from the generation of purchased electricity, steam, heating, and cooling consumed by facilities.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Utility Bill</span>
        </button>
      </div>

      {/* Scope 2 Method Explanation Banner */}
      <div className="p-4 bg-sky-50/80 border border-sky-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs sm:text-sm text-sky-900 shadow-xs">
        <div className="space-y-1">
          <span className="font-bold block text-sm">Dual Reporting: Location-Based vs Market-Based Method</span>
          <p className="leading-relaxed text-xs sm:text-sm text-sky-800">
            Electricity consumption in kWh converted using national / regional grid average factors.
            Market-based accounting recognizes renewable energy power purchase agreements (PPAs) and Energy Attribute Certificates (EACs).
          </p>
        </div>
        <div className="shrink-0 text-right bg-white p-3.5 rounded-xl border border-sky-200/80 shadow-2xs">
          <div className="font-black text-lg text-slate-900 font-mono">{totalKWh.toLocaleString()} kWh</div>
          <div className="text-xs font-semibold text-sky-700">Total Metered Electricity</div>
        </div>
      </div>

      {/* Scope 2 Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Electricity & Utility Records ({records.length})</h3>
          <span className="text-xs sm:text-sm font-bold text-slate-700 font-mono">
            Scope 2 Total: {metrics.scope2Tonne.toLocaleString(undefined, { maximumFractionDigits: 1 })} tCO₂e
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Facility / Meter</th>
                <th className="py-3 px-4 text-right">Units (kWh)</th>
                <th className="py-3 px-4 text-right">Grid Factor</th>
                <th className="py-3 px-4 text-right">Calculated Emissions</th>
                <th className="py-3 px-3">Data Quality</th>
                <th className="py-3 px-4 text-right">Audit Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-sm text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div>{r.activityName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{r.source}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 text-right whitespace-nowrap">
                    {r.quantity.toLocaleString()} kWh
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500 text-right whitespace-nowrap">
                    {r.factorValue} kgCO₂e/kWh
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-right whitespace-nowrap text-sm">
                    {r.co2eTonne.toFixed(3)} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {r.dataQuality}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecordForAudit(r)}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors cursor-pointer border border-sky-200/60"
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
// SCOPE 3 (VALUE CHAIN EMISSIONS)
// ============================================================================
export const Scope3Page: React.FC = () => {
  const { filteredRecords, metrics, setIsAddRecordModalOpen, setSelectedRecordForAudit } = useApp();

  const records = filteredRecords.filter((r) => r.scope === 'Scope 3');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Scope 3: Value Chain & Supply Chain
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Upstream & Downstream
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Supply chain inventory: Purchased Goods & Services (Cat 1), Capital Goods (Cat 2), Upstream Transport (Cat 4), Business Travel (Cat 6), and Employee Commute (Cat 7).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-4 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scope 3 Record</span>
        </button>
      </div>

      {/* Scope 3 Total Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Verified Scope 3 Volume</span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {metrics.scope3Tonne.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
            <span className="text-sm font-bold text-slate-500">tCO₂e</span>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-slate-600 max-w-md">
          Scope 3 typically comprises 90%+ of total corporate carbon footprint in cloud, electronics, and global supply chains.
        </div>
      </div>

      {/* Scope 3 Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Scope 3 Activity Entries ({records.length})</h3>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">GHG Protocol Corporate Value Chain Standard</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Activity / Material</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Emission Factor</th>
                <th className="py-3 px-4 text-right">Calculated Emissions</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-sm text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div>{r.activityName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{r.source}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 text-right whitespace-nowrap">
                    {r.quantity.toLocaleString()} {r.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500 text-right whitespace-nowrap">
                    {r.factorValue} {r.factorUnit}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-right whitespace-nowrap text-sm">
                    {r.co2eTonne.toFixed(3)} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecordForAudit(r)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer border border-emerald-200/60"
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
