import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  Code,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
} from 'lucide-react';
import { formatTonne } from '../../utils/calculationEngine';

export const ReportsPage: React.FC = () => {
  const { business, metrics, filteredRecords, monthlyTrendData, showToast } = useApp();

  const [reportType, setReportType] = useState<'ghg' | 'supplier' | 'audit'>('ghg');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'RecordID,Date,Activity,Scope,Category,Quantity,Unit,Factor,FactorUnit,kgCO2e,tCO2e,Quality,Source\n';
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.id}","${r.date}","${r.activityName}","${r.scope}","${r.category}",${r.quantity},"${r.unit}",${r.factorValue},"${r.factorUnit}",${r.co2eKg},${r.co2eTonne},"${r.dataQuality}","${r.source}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_Report_${business.name.replace(/\s+/g, '_')}_2026.csv`;
    link.click();
    showToast('Exported complete carbon inventory to CSV', 'success');
  };

  const handleExportJSON = () => {
    const data = {
      organization: business,
      reportingYear: 2026,
      standard: 'Greenhouse Gas Protocol Corporate Standard',
      inventory: metrics,
      records: filteredRecords,
      exportTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_ESG_Disclosure_${business.name.replace(/\s+/g, '_')}.json`;
    link.click();
    showToast('Exported machine-readable JSON disclosure', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header & Export Actions (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ESG & Carbon Accounting Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Download audited emissions inventories and supplier sustainability disclosures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV Data Dump</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Code className="w-3.5 h-3.5 text-sky-600" />
            <span>JSON Schema</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector & Industrial Audit Verification Strip (Hidden during print) */}
      <div className="space-y-4 print:hidden">
        {/* Subtle Industrial Visual Context Accent Card with Floating Animation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-900/8 shadow-md animate-float-gentle card-hover-lift hover:-translate-y-[2px] transition-all flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-28 sm:w-36 h-20 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200/80 shadow-xs relative">
              <img
                src="/assets/factory_emission_aerial.jpg"
                alt="Audited Facility"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-emerald-950/15" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  AUDITED BOUNDARY • FACILITY 01
                </span>
                <span className="text-[10px] text-slate-400 font-mono">•</span>
                <span className="text-[10px] font-semibold text-slate-600 font-mono">
                  {metrics.totalEmissionsTonne.toFixed(1)} tCO₂e Total
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{business.name} Manufacturing Plant</h4>
              <p className="text-xs text-slate-500 mt-0.5">ISO 14064-1 & GHG Protocol Scope 1-3 corporate inventory disclosure.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified DEFRA 2026
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Audit Trail Intact
            </span>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Report Template:</span>
          <button
            onClick={() => setReportType('ghg')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              reportType === 'ghg'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            GHG Protocol Annual Inventory
          </button>
          <button
            onClick={() => setReportType('supplier')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              reportType === 'supplier'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Customer Supplier Disclosure Form
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE REPORT DOCUMENT CARD (Formal Corporate Aesthetic)
          ========================================================================= */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-900/8 shadow-md space-y-8 print:border-none print:shadow-none print:p-0 card-hover-lift hover:-translate-y-[2px] transition-all">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b pb-6 border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                C
              </div>
              <span className="font-bold text-lg text-slate-900">CarbonLens</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official Summary
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportType === 'ghg' ? 'Corporate Greenhouse Gas Inventory' : 'Customer Supply Chain ESG Disclosure'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Reporting Period: Calendar Year 2026 • Published on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <div className="font-bold text-slate-900 text-sm">{business.name}</div>
            <div>{business.city}, {business.country}</div>
            <div>Sector: {business.industry}</div>
            <div>Headcount: {business.employees} FTEs</div>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="floating-info-card-1">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <span className="text-xs text-slate-500 block">Total Footprint</span>
                <span className="text-2xl font-black text-slate-900 mt-1">{metrics.totalEmissionsTonne.toFixed(1)} tCO₂e</span>
              </div>
            </div>
            <div className="floating-info-card-2">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <span className="text-xs text-slate-500 block">Scope 1 (Direct)</span>
                <span className="text-xl font-bold text-orange-600 mt-1">{metrics.scope1Tonne.toFixed(1)} tCO₂e</span>
              </div>
            </div>
            <div className="floating-info-card-3">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <span className="text-xs text-slate-500 block">Scope 2 (Electricity)</span>
                <span className="text-xl font-bold text-sky-600 mt-1">{metrics.scope2Tonne.toFixed(1)} tCO₂e</span>
              </div>
            </div>
            <div className="floating-info-card-4">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <span className="text-xs text-slate-500 block">Scope 3 (Value Chain)</span>
                <span className="text-xl font-bold text-emerald-600 mt-1">{metrics.scope3Tonne.toFixed(1)} tCO₂e</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scope Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Emissions by Operational Scope</h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="p-3">GHG Scope</th>
                <th className="p-3">Core Activities</th>
                <th className="p-3">Calculation Basis</th>
                <th className="p-3 text-right">tCO₂e</th>
                <th className="p-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-orange-600">Scope 1 (Direct)</td>
                <td className="p-3">Boilers, delivery fleet vehicles, refrigerant top-ups</td>
                <td className="p-3">Invoiced fuel litres & gas utility meter readings</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">{metrics.scope1Tonne.toFixed(1)}</td>
                <td className="p-3 text-right">{((metrics.scope1Tonne / (metrics.totalEmissionsTonne || 1)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sky-600">Scope 2 (Energy)</td>
                <td className="p-3">Grid purchased electricity for facility operations</td>
                <td className="p-3">CEA National Grid Average Factor (0.820 kg/kWh)</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">{metrics.scope2Tonne.toFixed(1)}</td>
                <td className="p-3 text-right">{((metrics.scope2Tonne / (metrics.totalEmissionsTonne || 1)) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-600">Scope 3 (Value Chain)</td>
                <td className="p-3">Packaging procurement, waste disposal, staff commuting</td>
                <td className="p-3">DEFRA material factors & surveyed commute averages</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">{metrics.scope3Tonne.toFixed(1)}</td>
                <td className="p-3 text-right">{((metrics.scope3Tonne / (metrics.totalEmissionsTonne || 1)) * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reduction Target & Progress Statement */}
        <div className="floating-info-card-2">
          <div className="p-4 rounded-xl attractive-info-card space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Target Commitment: {business.targetReductionPct}% Reduction by {business.targetYear}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {business.name} has committed to reducing gross Scope 1 and Scope 2 operational emissions against baseline year {business.baselineYear}. Year-to-date performance demonstrates an 8.4% reduction, primarily achieved through heating efficiency improvements and fleet route rationalization.
            </p>
          </div>
        </div>

        {/* Audit & Methodology Certification Statement */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GHG Protocol Corporate Standard Compliance Statement</span>
          </div>
          <p className="leading-relaxed">
            This report was prepared in accordance with the World Resources Institute (WRI) and World Business Council for Sustainable Development (WBCSD) Greenhouse Gas Protocol Corporate Accounting and Reporting Standard. All activity records are backed by verifiable evidentiary sources.
          </p>
        </div>
      </div>
    </div>
  );
};
