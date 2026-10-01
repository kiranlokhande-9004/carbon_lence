import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Upload,
  Search,
  Filter,
  Trash2,
  Calculator,
  Download,
  CheckSquare,
  Square,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { formatTonne, getDataQualityBadgeColor, getScopeBadgeColor } from '../../utils/calculationEngine';
import { ScopeType, DataQuality, EmissionRecord } from '../../types';
import { IndustrialIntelligenceHero } from '../common/IndustrialIntelligenceHero';

export const EmissionsDataPage: React.FC = () => {
  const {
    filteredRecords,
    deleteEmissionRecord,
    setIsAddRecordModalOpen,
    setIsCSVImportModalOpen,
    setSelectedRecordForAudit,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [selectedQuality, setSelectedQuality] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'date' | 'co2eTonne' | 'activityName'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    filteredRecords.forEach((r) => set.add(r.category));
    return Array.from(set).sort();
  }, [filteredRecords]);

  // Filtered and searched records
  const displayRecords = useMemo(() => {
    let result = filteredRecords.filter((r) => {
      if (selectedScope !== 'All' && r.scope !== selectedScope) return false;
      if (selectedQuality !== 'All' && r.dataQuality !== selectedQuality) return false;
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.activityName.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        const matchSrc = r.source.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchSrc) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }
      if (sortField === 'co2eTonne') {
        return sortAsc ? a.co2eTonne - b.co2eTonne : b.co2eTonne - a.co2eTonne;
      }
      if (sortField === 'activityName') {
        return sortAsc ? a.activityName.localeCompare(b.activityName) : b.activityName.localeCompare(a.activityName);
      }
      return 0;
    });

    return result;
  }, [filteredRecords, selectedScope, selectedQuality, selectedCategory, searchQuery, sortField, sortAsc]);

  const totalFilteredTonne = displayRecords.reduce((acc, r) => acc + (r.co2eTonne || 0), 0);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === displayRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayRecords.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBatchDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected emission records?`)) {
      selectedIds.forEach((id) => deleteEmissionRecord(id));
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} records`, 'info');
    }
  };

  const handleExportSelectedCSV = () => {
    const target = displayRecords.filter((r) => selectedIds.includes(r.id) || selectedIds.length === 0);
    const headers = 'ID,Date,ActivityName,Scope,Category,Quantity,Unit,FactorValue,FactorUnit,CO2e_kg,CO2e_tonnes,DataQuality,Source\n';
    const rows = target
      .map(
        (r) =>
          `"${r.id}","${r.date}","${r.activityName}","${r.scope}","${r.category}",${r.quantity},"${r.unit}",${r.factorValue},"${r.factorUnit}",${r.co2eKg},${r.co2eTonne},"${r.dataQuality}","${r.source}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `carbonlens_emissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${target.length} records to CSV`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Emissions Activity Data
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete inventory of operational activity records, emission factors, and calculation traces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCSVImportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setIsAddRecordModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity Record</span>
          </button>
        </div>
      </div>

      {/* Industrial Intelligence Visual Showcase */}
      <IndustrialIntelligenceHero
        title="Physical Operations & Emissions Tracking"
        subtitle="Real-time translation of facility energy, fuel combustion, and supply chain activity into verified CO₂e."
        badge="PRIMARY FACILITY • ACTIVE"
        currentEmissions={Number(totalFilteredTonne.toFixed(1)) || 107.2}
        pctChange="↓ 8.4% vs baseline"
        energyImpact={54.7}
        energyPct={42.5}
        imageSrc="/assets/factory_emission_aerial.jpg"
        facilityName="Oakridge Precision Manufacturing Plant"
        statusText="Real-time Activity Stream Synchronized"
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="floating-info-card-1">
          <div className="attractive-info-card p-4 rounded-2xl flex items-center justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Filtered Records</span>
            <span className="text-lg font-bold text-slate-900">{displayRecords.length} entries</span>
          </div>
        </div>
        <div className="floating-info-card-2">
          <div className="attractive-info-card p-4 rounded-2xl flex items-center justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Filtered Carbon Volume</span>
            <span className="text-lg font-bold text-emerald-700">{formatTonne(totalFilteredTonne)}</span>
          </div>
        </div>
        <div className="floating-info-card-3">
          <div className="attractive-info-card p-4 rounded-2xl flex items-center justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Selection State</span>
            <span className="text-xs font-semibold text-slate-700">
              {selectedIds.length > 0 ? `${selectedIds.length} records selected` : 'None selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-900/8 shadow-xs card-hover-lift hover:-translate-y-[2px] transition-all space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity or supplier..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Scope Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Scopes (1, 2, 3)</option>
              <option value="Scope 1">Scope 1 (Direct)</option>
              <option value="Scope 2">Scope 2 (Power)</option>
              <option value="Scope 3">Scope 3 (Value Chain)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Confidence Quality Filter */}
          <div>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Confidence Ratings</option>
              <option value="High">High (Metered invoices)</option>
              <option value="Medium">Medium (Modeled benchmarks)</option>
              <option value="Low">Low (Spend-based)</option>
            </select>
          </div>
        </div>

        {/* Multi-Selection Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs bg-emerald-50/50 p-2 rounded-xl">
            <span className="font-semibold text-emerald-900">
              {selectedIds.length} items selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSelectedCSV}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Selected
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-medium hover:bg-rose-100 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-900/8 rounded-2xl overflow-hidden shadow-xs card-hover-lift hover:-translate-y-[2px] transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="p-0.5">
                    {selectedIds.length === displayRecords.length && displayRecords.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('date');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('activityName');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Activity Description</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Scope & Category</th>
                <th className="py-3 px-3">Activity Data</th>
                <th className="py-3 px-3">Emission Factor</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('co2eTonne');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Carbon (tCO₂e)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Data Quality</th>
                <th className="py-3 px-3 text-right">Audit Trace</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRecords.map((r) => {
                const isSelected = selectedIds.includes(r.id);
                const scopeBadge = getScopeBadgeColor(r.scope);
                const qualityBadge = getDataQualityBadgeColor(r.dataQuality);

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelectRow(r.id)} className="p-0.5">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div>{r.activityName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Source: {r.source}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${scopeBadge.bg} ${scopeBadge.text}`}>
                          {r.scope}
                        </span>
                        <div className="text-[10px] text-slate-500">{r.category}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold whitespace-nowrap">
                      {r.quantity.toLocaleString()} {r.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                      <div>{r.factorValue} {r.factorUnit}</div>
                      <div className="text-[10px] text-slate-400">{r.factorSource} ({r.factorYear})</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {r.co2eTonne.toFixed(3)} tCO₂e
                      <div className="text-[10px] font-normal text-slate-400">({r.co2eKg.toLocaleString()} kg)</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${qualityBadge.bg} ${qualityBadge.border}`}>
                        {r.dataQuality}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecordForAudit(r)}
                        className="px-2 py-1 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-semibold text-[11px] inline-flex items-center gap-1"
                        title="View mathematical calculation audit"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${r.activityName}"?`)) {
                            deleteEmissionRecord(r.id);
                          }
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayRecords.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No emission activities found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No records match your active search or filters. Try adjusting the search or click below to add an activity record.
            </p>
            <button
              onClick={() => setIsAddRecordModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors"
            >
              Add Activity Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
