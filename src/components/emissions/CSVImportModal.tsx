import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Download, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ScopeType, DataQuality, EmissionRecord } from '../../types';

const SAMPLE_CSV = `Date,ActivityName,Scope,Category,Quantity,Unit,FactorValue,Source,DataQuality
2026-03-01,Bakery Oven Natural Gas,Scope 1,Stationary Combustion,850,m³,1.98,Gas Utility Bill #882,High
2026-03-05,Main Warehouse Electricity,Scope 2,Purchased Electricity,12400,kWh,0.82,Electricity Board Inv #942,High
2026-03-10,Delivery Fleet Biodiesel,Scope 1,Mobile Combustion,450,litres,2.68,Fleet Fuel Cards,High
2026-03-15,Cardboard Packaging Supply,Scope 3,Purchased Goods & Services,1800,kg,0.95,Supplier Packing Slip,Medium
2026-03-20,Municipal Solid Waste Landfill,Scope 3,Waste Generated in Operations,950,kg,0.48,Municipal Waste Manifest,Medium`;

export const CSVImportModal: React.FC = () => {
  const { isCSVImportModalOpen, setIsCSVImportModalOpen, batchImportRecords, factors } = useApp();

  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  if (!isCSVImportModalOpen) return null;

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'carbonlens_activity_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvText(text);
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      setParseErrors(['CSV file must have a header row and at least one data row.']);
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const dateIdx = headers.findIndex((h) => h.includes('date'));
    const nameIdx = headers.findIndex((h) => h.includes('activity') || h.includes('name'));
    const scopeIdx = headers.findIndex((h) => h.includes('scope'));
    const catIdx = headers.findIndex((h) => h.includes('cat'));
    const qtyIdx = headers.findIndex((h) => h.includes('quant') || h.includes('amount'));
    const unitIdx = headers.findIndex((h) => h.includes('unit'));
    const factorIdx = headers.findIndex((h) => h.includes('factor'));
    const srcIdx = headers.findIndex((h) => h.includes('source'));
    const qualIdx = headers.findIndex((h) => h.includes('quality'));

    const rows: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length < 5) continue;

      const date = dateIdx >= 0 ? cols[dateIdx] : '2026-01-01';
      const name = nameIdx >= 0 ? cols[nameIdx] : `Activity Entry ${i}`;
      let scope: ScopeType = 'Scope 2';
      if (scopeIdx >= 0) {
        const rawScope = cols[scopeIdx].toLowerCase();
        if (rawScope.includes('1')) scope = 'Scope 1';
        else if (rawScope.includes('3')) scope = 'Scope 3';
      }

      const category = catIdx >= 0 ? cols[catIdx] : 'Operational Energy';
      const qty = qtyIdx >= 0 ? parseFloat(cols[qtyIdx]) : 0;
      const unit = unitIdx >= 0 ? cols[unitIdx] : 'units';
      const factorVal = factorIdx >= 0 ? parseFloat(cols[factorIdx]) : 0.82;
      const source = srcIdx >= 0 ? cols[srcIdx] : 'Batch CSV Import';
      const quality: DataQuality = qualIdx >= 0 && (cols[qualIdx] === 'High' || cols[qualIdx] === 'Low') ? cols[qualIdx] : 'Medium';

      if (isNaN(qty) || qty <= 0) {
        errors.push(`Row ${i} (${name}): Invalid quantity "${cols[qtyIdx]}"`);
      }

      rows.push({
        date,
        activityName: name,
        scope,
        category,
        quantity: qty || 1,
        unit,
        factorValue: factorVal || 0.82,
        factorUnit: `kgCO₂e/${unit}`,
        factorName: `${category} Factor`,
        factorSource: 'Regional CEA / DEFRA Standard',
        factorYear: 2025,
        factorVersion: 'v2.1',
        source,
        dataQuality: quality,
        isValid: !isNaN(qty) && qty > 0,
      });
    }

    setParsedRows(rows);
    setParseErrors(errors);
    setIsParsed(true);
  };

  const handleExecuteImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    batchImportRecords(validRows);
    setIsCSVImportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Batch Import Activity Data</h3>
              <p className="text-xs text-slate-500">Upload CSV file or paste raw activity logs</p>
            </div>
          </div>
          <button
            onClick={() => setIsCSVImportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-600">
              Need standard headers? Download the template file:
            </div>
            <button
              onClick={downloadTemplate}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template CSV</span>
            </button>
          </div>

          {/* File Upload / Drag Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors">
            <input
              type="file"
              id="csv-file-input"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-slate-600"
            >
              <FileText className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Click to browse CSV file or drag and drop here
              </span>
              <span className="text-[11px] text-slate-400">Supports standard comma-delimited files</span>
            </label>
          </div>

          {/* Or Paste Raw Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700">
                Or review / edit CSV text below:
              </label>
              <button
                type="button"
                onClick={() => parseCSV(csvText)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parse & Validate</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setIsParsed(false);
              }}
              className="w-full font-mono text-[11px] p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Paste comma separated values here..."
            />
          </div>

          {/* Validation Feedback & Preview */}
          {isParsed && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Validation Result: {parsedRows.filter((r) => r.isValid).length} of {parsedRows.length} rows valid</span>
                </span>
                {parseErrors.length > 0 && (
                  <span className="text-rose-600 font-medium text-[11px]">
                    {parseErrors.length} validation issues flagged
                  </span>
                )}
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Activity</th>
                      <th className="p-2">Scope</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className={r.isValid ? '' : 'bg-rose-50/60'}>
                        <td className="p-2">{r.date}</td>
                        <td className="p-2 font-sans font-medium">{r.activityName}</td>
                        <td className="p-2">{r.scope}</td>
                        <td className="p-2">{r.quantity} {r.unit}</td>
                        <td className="p-2">
                          {r.isValid ? (
                            <span className="text-emerald-700 font-sans font-semibold">Valid</span>
                          ) : (
                            <span className="text-rose-600 font-sans font-semibold">Invalid Qty</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isParsed ? `${parsedRows.filter((r) => r.isValid).length} records ready to import` : 'Click Parse to validate data'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCSVImportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={isParsed ? handleExecuteImport : () => parseCSV(csvText)}
              className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors"
            >
              {isParsed ? 'Confirm & Import Records' : 'Parse & Validate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
