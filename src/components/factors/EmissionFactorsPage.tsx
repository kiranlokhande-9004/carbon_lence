import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Edit2,
  X,
  Sparkles,
  Info,
  Globe,
  Factory,
  Flame,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { EmissionFactor, ScopeType } from '../../types';
import { getScopeBadgeColor } from '../../utils/calculationEngine';

export const EmissionFactorsPage: React.FC = () => {
  const { factors, addEmissionFactor, updateEmissionFactor, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<EmissionFactor | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [scope, setScope] = useState<ScopeType>('Scope 2');
  const [category, setCategory] = useState('Purchased Electricity');
  const [value, setValue] = useState<number | ''>('');
  const [unit, setUnit] = useState('kWh');
  const [source, setSource] = useState('DEFRA / CEA 2025');
  const [year, setYear] = useState(2025);
  const [version, setVersion] = useState('v2.1');
  const [region, setRegion] = useState('India');
  const [notes, setNotes] = useState('');

  // Regions list
  const regions = useMemo(() => {
    const set = new Set<string>();
    factors.forEach((f) => set.add(f.region));
    return Array.from(set).sort();
  }, [factors]);

  // Filtered factors
  const filteredFactors = useMemo(() => {
    return factors.filter((f) => {
      if (selectedScope !== 'All' && f.scope !== selectedScope) return false;
      if (selectedRegion !== 'All' && f.region !== selectedRegion) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchCat = f.category.toLowerCase().includes(q);
        const matchSrc = f.source.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchSrc) return false;
      }
      return true;
    });
  }, [factors, selectedScope, selectedRegion, searchQuery]);

  const openAddModal = () => {
    setEditingFactor(null);
    setName('');
    setScope('Scope 2');
    setCategory('Purchased Electricity');
    setValue('');
    setUnit('kWh');
    setSource('National Grid / CEA');
    setYear(2025);
    setVersion('v2.1');
    setRegion('India');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (factor: EmissionFactor) => {
    setEditingFactor(factor);
    setName(factor.name);
    setScope(factor.scope);
    setCategory(factor.category);
    setValue(factor.value);
    setUnit(factor.unit);
    setSource(factor.source);
    setYear(factor.year);
    setVersion(factor.version);
    setRegion(factor.region);
    setNotes(factor.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || value === '' || Number(value) <= 0) return;

    if (editingFactor) {
      updateEmissionFactor(editingFactor.id, {
        name,
        scope,
        category,
        value: Number(value),
        unit,
        source,
        year: Number(year),
        version,
        region,
        notes,
      });
    } else {
      addEmissionFactor({
        name,
        scope,
        category,
        value: Number(value),
        unit,
        source,
        year: Number(year),
        version,
        region,
        uncertainty: 'Low (±5%)',
        isDemo: false,
        notes,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Authoritative Emission Factors Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Governing conversion coefficients adhering to IPCC Assessment Reports (AR5/AR6), UK DEFRA, and CEA India.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Factor</span>
        </button>
      </div>

      {/* Industrial Intelligence Factors Showcase Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-900/8 shadow-xs relative overflow-visible transition-all card-hover-lift hover:-translate-y-[2px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                COMBUSTION & PROCESS FACTOR CATALOG • DEFRA / EPA / IPCC
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Deterministic AR6 Standard</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
              Industrial Stationary Combustion & Grid Emission Coefficients
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              High-precision coefficients converting physical fuel, steam, chemical processes, and electricity into verified greenhouse gas equivalents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              IPCC AR6 GWP100
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Deterministic Lineage
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Large Industrial Factory Image Card */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-900/10 shadow-sm min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] aspect-16/10 sm:aspect-16/9">
              <img
                src="/assets/factory_emission_aerial.jpg"
                alt="Industrial Factory Process & Stationary Combustion Plant"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-xs">
                <Factory className="w-3.5 h-3.5 text-emerald-400" />
                <span>Heavy Industry & Thermal Generation Facility</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 font-medium">
                    Continuous Flue & Fuel Monitoring
                  </span>
                  <p className="text-xs font-semibold text-white">
                    Direct stack gas analysis calibrated with DEFRA 2026 chemical combustion metrics
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-slate-300">Factor Confidence</span>
                  <p className="text-xs font-mono font-bold text-emerald-300">Tier 3 (±1.8% Uncertainty)</p>
                </div>
              </div>
            </div>

            {/* Overlapping Small Floating Indicator Card */}
            <div
              className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:right-6 bg-white/98 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-emerald-600/20 shadow-lg z-20 flex items-center gap-3 animate-float-gentle-reverse max-w-xs transition-all hover:shadow-xl"
              style={{
                boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 text-orange-600">
                <Flame className="w-5 h-5" />
              </div>
              <div className="pr-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  PRIMARY HEAVY FUEL
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">2.684</span>
                  <span className="text-[11px] font-medium text-slate-500">kgCO₂e / L</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Stationary diesel & heavy oil combustion
                </p>
              </div>
            </div>
          </div>

          {/* Right: Floating Analytics Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-900/10 shadow-md relative z-10 animate-float-gentle transition-all hover:shadow-xl"
              style={{
                boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(5, 150, 105, 0.08)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    CONVERSION FACTOR REPOSITORY
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {factors.length} Active Coeffs
                </span>
              </div>

              <div className="mt-4 mb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    0.708
                  </span>
                  <span className="text-sm font-semibold text-slate-500 ml-1.5">kgCO₂e / kWh</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200/50">
                  <Zap className="w-3.5 h-3.5" />
                  <span>National Grid Average</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Automated multi-gas global warming potential conversion (CO₂, CH₄, N₂O) compliant with GHG Protocol Scope 1-3 guidelines.
              </p>

              {/* Two Compact Coefficient Tiles */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="attractive-info-card p-3 rounded-xl">
                  <div className="text-xs font-medium text-slate-500">Natural Gas Grid</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">2.02 kg/m³</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">UK DEFRA 2026</div>
                </div>
                <div className="attractive-info-card p-3 rounded-xl">
                  <div className="text-xs font-medium text-slate-500">Fleet Transport</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">0.171 kg/km</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Avg Rigid HGV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Methodology Banner */}
      <div className="floating-info-card-3">
        <div className="attractive-info-card p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm text-emerald-900">Transparent Lineage & Deterministic Calculation</span>
            <p className="mt-0.5 leading-relaxed text-slate-700">
              Every activity logged in CarbonLens is multiplied by a verifiable emission factor to produce kilograms and metric tonnes of CO₂ equivalent (kgCO₂e / tCO₂e). Factors are stamped with published version dates, geographical boundaries, and evidentiary citations.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-900/8 shadow-xs card-hover-lift hover:-translate-y-[2px] transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search factor, gas or source..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Scopes</option>
              <option value="Scope 1">Scope 1 (Direct Fuels)</option>
              <option value="Scope 2">Scope 2 (Electricity)</option>
              <option value="Scope 3">Scope 3 (Supply Chain)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Operating Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Factors Table */}
      <div className="bg-white border border-slate-900/8 rounded-2xl overflow-hidden shadow-xs card-hover-lift hover:-translate-y-[2px] transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Factor Name</th>
                <th className="py-3 px-3">Scope</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Intensity Coefficient</th>
                <th className="py-3 px-3">Source & Year</th>
                <th className="py-3 px-3">Region</th>
                <th className="py-3 px-3">Uncertainty</th>
                <th className="py-3 px-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFactors.map((f) => {
                const scopeBadge = getScopeBadgeColor(f.scope);

                return (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{f.name}</div>
                      {f.notes && <div className="text-[10px] text-slate-400 mt-0.5">{f.notes}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${scopeBadge.bg} ${scopeBadge.text}`}>
                        {f.scope}
                      </span>
                    </td>
                    <td className="py-3 px-3">{f.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {f.value} <span className="font-normal text-slate-500 text-[11px]">kgCO₂e / {f.unit}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{f.source}</span>
                      <div className="text-[10px] text-slate-400">{f.year} ({f.version})</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{f.region}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {f.uncertainty || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openEditModal(f)}
                        className="p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Edit factor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Factor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base">
                {editingFactor ? 'Edit Emission Factor' : 'Add Custom Emission Factor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Factor Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Biodiesel Blend B20"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as ScopeType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Scope 1">Scope 1 (Direct)</option>
                    <option value="Scope 2">Scope 2 (Electricity)</option>
                    <option value="Scope 3">Scope 3 (Value Chain)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Mobile Combustion"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Value (kgCO₂e per unit)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="e.g. 2.15"
                    className="w-full px-3 py-2 text-xs font-mono font-semibold border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. litre, kWh, tonne"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Source</label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. DEFRA"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vintage Year</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Region</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Lineage</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified by internal sustainability advisor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
                >
                  Save Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
