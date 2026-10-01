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
  Upload,
  Zap,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { formatTonne } from '../../utils/calculationEngine';

export const ReportsPage: React.FC = () => {
  const {
    business,
    metrics,
    filteredRecords,
    monthlyTrendData,
    showToast,
    currentESGData,
    setIsESGUploadModalOpen,
    downloadESGStatusPDF,
  } = useApp();

  const [reportType, setReportType] = useState<'esg' | 'ghg' | 'supplier'>('esg');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Metric,Category,PreviousYear,CurrentYear,Unit,PctChange,Type,Source\n';
    const rows = Object.values(currentESGData.metrics)
      .map(
        (m) =>
          `"${m.label}","${m.category}",${m.previousValue ?? '""'},${m.currentValue ?? '""'},"${m.unit}","${m.percentageChange ?? 'N/A'}%","${m.valueType}","${m.source}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_Audited_ESG_${currentESGData.companyName.replace(/\s+/g, '_')}_${currentESGData.reportingYear}.csv`;
    link.click();
    showToast('Exported audited company ESG disclosure to CSV', 'success');
  };

  const handleExportJSON = () => {
    const data = {
      organization: currentESGData.companyName,
      ticker: currentESGData.ticker,
      reportingYear: currentESGData.reportingYear,
      previousYear: currentESGData.previousYear,
      assuranceProvider: currentESGData.assuranceProvider,
      assuranceStandard: currentESGData.assuranceStandard,
      status: currentESGData.verificationStatus,
      metrics: currentESGData.metrics,
      multiYearTrend: currentESGData.multiYearTrend,
      exportTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_Verified_ESG_${currentESGData.companyName.replace(/\s+/g, '_')}.json`;
    link.click();
    showToast('Exported machine-readable JSON ESG schema', 'success');
  };

  const esg = currentESGData;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header & Export Actions (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ESG & Carbon Accounting Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audited emissions inventories, official public disclosures, and third-party verified statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Generate Company ESG Status PDF Button */}
          <button
            onClick={() => downloadESGStatusPDF()}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Company ESG Status PDF</span>
          </button>

          {/* PDF Upload Pipeline */}
          <button
            onClick={() => setIsESGUploadModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-700" />
            <span>Upload ESG PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-sky-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector & Industrial Audit Verification Strip (Hidden during print) */}
      <div className="space-y-4 print:hidden">
        {/* Verified Facility Visual Context Accent Card with Floating Animation */}
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
                  AUDITED BOUNDARY • {esg.ticker}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">•</span>
                <span className="text-[10px] font-semibold text-slate-600 font-mono">
                  {(esg.metrics.totalEmissionsMarket.currentValue! / 1000000).toFixed(2)}M MT CO₂e Net
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{esg.companyName} Global Operations</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {esg.sourceReportTitle} • Assured by {esg.assuranceProvider} under {esg.assuranceStandard}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {esg.verificationStatus}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {esg.assuranceProvider}
            </span>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Report Template:</span>
          <button
            onClick={() => setReportType('esg')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              reportType === 'esg'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Audited Company ESG Status Report
          </button>
          <button
            onClick={() => setReportType('ghg')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              reportType === 'ghg'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            GHG Protocol Scopes 1-3 Inventory
          </button>
          <button
            onClick={() => setReportType('supplier')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
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
                Official Statement
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportType === 'esg'
                ? `${esg.companyName} ESG Status & Verification Report`
                : reportType === 'ghg'
                ? 'Corporate Greenhouse Gas Inventory (Scopes 1-3)'
                : 'Customer Supply Chain ESG Disclosure'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Reporting Periods: {esg.previousYear} (Previous Year) vs {esg.reportingYear} (Latest Year) • Published {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <div className="font-bold text-slate-900 text-sm">{esg.companyName} ({esg.ticker})</div>
            <div>{esg.headquarters}</div>
            <div>Sector: {esg.industry}</div>
            <div>Headcount: {esg.employees.toLocaleString()} FTEs</div>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h3>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified by {esg.assuranceProvider}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="floating-info-card-1">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 block">Total Net Emissions</span>
                  <span className="text-[9px] font-bold text-emerald-700">[Calculated]</span>
                </div>
                <span className="text-2xl font-black text-slate-900 mt-1">
                  {(esg.metrics.totalEmissionsMarket.currentValue! / 1000000).toFixed(2)}M MT
                </span>
                <span className="text-[11px] font-semibold text-amber-700 mt-1">
                  +{esg.metrics.totalEmissionsMarket.percentageChange}% vs {esg.previousYear}
                </span>
              </div>
            </div>

            <div className="floating-info-card-2">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 block">Scope 1 (Direct)</span>
                  <span className="text-[9px] font-bold text-slate-600">[Reported]</span>
                </div>
                <span className="text-xl font-bold text-orange-600 mt-1">
                  {(esg.metrics.scope1.currentValue! / 1000).toFixed(0)}k MT
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 mt-1">
                  {esg.metrics.scope1.percentageChange}% vs {esg.previousYear}
                </span>
              </div>
            </div>

            <div className="floating-info-card-3">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 block">Scope 2 (Market)</span>
                  <span className="text-[9px] font-bold text-slate-600">[Reported]</span>
                </div>
                <span className="text-xl font-bold text-sky-600 mt-1">
                  {(esg.metrics.scope2Market.currentValue! / 1000).toFixed(0)}k MT
                </span>
                <span className="text-[11px] font-semibold text-amber-700 mt-1">
                  +{esg.metrics.scope2Market.percentageChange}% vs {esg.previousYear}
                </span>
              </div>
            </div>

            <div className="floating-info-card-4">
              <div className="attractive-info-card p-4 rounded-xl shadow-2xs h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 block">Scope 3 (Value Chain)</span>
                  <span className="text-[9px] font-bold text-slate-600">[Reported]</span>
                </div>
                <span className="text-xl font-bold text-indigo-600 mt-1">
                  {(esg.metrics.scope3.currentValue! / 1000000).toFixed(2)}M MT
                </span>
                <span className="text-[11px] font-semibold text-amber-700 mt-1">
                  +{esg.metrics.scope3.percentageChange}% vs {esg.previousYear}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Previous vs Current Year ESG Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Public Disclosures ({esg.previousYear} vs {esg.reportingYear})
            </h3>
            <span className="text-xs text-slate-400">All required numeric values ≥ 0</span>
          </div>

          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="p-3">Disclosure Field</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">{esg.previousYear}</th>
                <th className="p-3 text-right">{esg.reportingYear}</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">YoY % Change</th>
                <th className="p-3">Type</th>
                <th className="p-3">Official Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {Object.values(esg.metrics).map((metric) => {
                const isPositive = (metric.percentageChange || 0) > 0;
                return (
                  <tr key={metric.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{metric.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {metric.calculationMethod}
                      </div>
                    </td>
                    <td className="p-3 capitalize text-slate-500">{metric.category}</td>
                    <td className="p-3 text-right font-mono text-slate-700">
                      {metric.previousValue !== null ? metric.previousValue.toLocaleString() : <span className="italic text-slate-400">Not reported</span>}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {metric.currentValue !== null ? metric.currentValue.toLocaleString() : <span className="italic text-slate-400">Not reported</span>}
                    </td>
                    <td className="p-3 text-slate-500">{metric.unit}</td>
                    <td className="p-3 text-right font-semibold">
                      {metric.percentageChange !== null ? (
                        <span className={isPositive ? 'text-amber-700' : 'text-emerald-700'}>
                          {isPositive ? '+' : ''}{metric.percentageChange}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        [{metric.valueType}]
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-500">{metric.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reduction Target & Progress Statement */}
        <div className="floating-info-card-2">
          <div className="p-4 rounded-xl attractive-info-card space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Target Commitment: Climate & Environmental Sustainability Roadmap</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              {esg.companyName} reported {esg.metrics.renewableElectricityPct.currentValue}% matched renewable electricity coverage. Direct Scope 1 emissions changed {esg.metrics.scope1.percentageChange}% YoY, with Scope 2 market emissions changing {esg.metrics.scope2Market.percentageChange}% YoY and Scope 3 supply chain emissions changing {esg.metrics.scope3.percentageChange}% YoY across verified organizational boundaries.
            </p>
          </div>
        </div>

        {/* Audit & Methodology Certification Statement */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Independent Third-Party Limited Assurance Statement</span>
          </div>
          <p className="leading-relaxed">
            {esg.assuranceDetails.opinion} Conducted by {esg.assuranceProvider} under {esg.assuranceStandard}. Global Operational Control boundary verified on {esg.assuranceDetails.statementDate}.
          </p>
        </div>
      </div>
    </div>
  );
};
