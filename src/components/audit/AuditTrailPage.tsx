import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Clock,
  User,
  History,
  AlertCircle,
  Calculator,
  FileText,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs, business, showToast, currentESGData } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'All' && log.action !== selectedAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRecord = log.record.toLowerCase().includes(q);
        const matchUser = log.user.toLowerCase().includes(q);
        const matchField = (log.fieldChanged || '').toLowerCase().includes(q);
        const matchVal = (log.newValue || '').toLowerCase().includes(q);
        const matchPrev = (log.prevValue || '').toLowerCase().includes(q);
        const matchSrc = (log.source || '').toLowerCase().includes(q);
        const matchCalc = (log.calculationMethod || '').toLowerCase().includes(q);
        if (!matchRecord && !matchUser && !matchField && !matchVal && !matchPrev && !matchSrc && !matchCalc) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, selectedAction, searchQuery]);

  const exportAuditCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Entity,FieldChanged,PreviousValue,NewValue,CalculationPerformed,Source,Category\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.record.replace(/"/g, '""')}","${(l.fieldChanged || '').replace(/"/g, '""')}","${(l.prevValue || '').replace(/"/g, '""')}","${(l.newValue || '').replace(/"/g, '""')}","${(l.calculationMethod || '').replace(/"/g, '""')}","${(l.source || '').replace(/"/g, '""')}","${l.category}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_Audit_Trail_${business.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Exported complete audit trail to CSV', 'success');
  };

  return (
    <div className="relative min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Ambient background blur mesh layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-500/18 blur-[100px]" />
        <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] rounded-full bg-sky-500/15 blur-[90px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-400/12 blur-[110px]" />
        <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-2xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Compliance & Calculation Audit Trail
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ISO 14064-3 / GHG Protocol
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Immutable ledger recording all data inputs, parameter changes, emission factor adjustments, and recalculations.
              </p>
            </div>
          </div>

          <button
            onClick={exportAuditCSV}
            className="px-4 py-2.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-2 shadow-2xs cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>

        {/* Audit Assurance & Protocol Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base block">
                Audit-Proof Data Lineage & Calculation Traceability
              </span>
              <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                Every ESG record modification, period recalculation, or emission factor change is logged with an author stamp, field identifier, prior and subsequent values, source evidence reference, and the mathematical formula applied.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ledger Entries</div>
              <div className="text-xl font-black text-slate-900 font-mono">{auditLogs.length} Events</div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Summary Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user, field changed, activity name, source, or calculation..."
              className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto text-sm shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Actions ({auditLogs.length})</option>
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Recalculation">Recalculation</option>
              <option value="ESG Data Ingested">ESG Data Ingested</option>
              <option value="Factor Changed">Factor Changed</option>
              <option value="CSV Imported">CSV Imported</option>
              <option value="Report Generated">Report Generated</option>
              <option value="Deleted">Deleted</option>
            </select>
          </div>
        </div>

        {/* Functional Audit Trail Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-3">User / Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-4">Field Changed / Entity</th>
                  <th className="py-3 px-4">Old Value → New Value</th>
                  <th className="py-3 px-4">Calculation / Update Performed</th>
                  <th className="py-3 px-4">Source / Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (log.action === 'Created') badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (log.action === 'Updated') badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200';
                  if (log.action === 'Recalculation') badgeStyle = 'bg-orange-50 text-orange-800 border-orange-200';
                  if (log.action === 'ESG Data Ingested') badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200';
                  if (log.action === 'Factor Changed') badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (log.action === 'CSV Imported') badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                  if (log.action === 'Deleted') badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLogForDetail(log)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.user}</span>
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Field Changed / Entity */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {log.fieldChanged || log.record}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Entity: {log.record}
                        </div>
                      </td>

                      {/* Old Value -> New Value */}
                      <td className="py-3.5 px-4 text-xs font-mono">
                        {log.prevValue ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="line-through text-slate-400">{log.prevValue}</span>
                            <span className="font-bold text-slate-900">{log.newValue}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900">{log.newValue}</span>
                        )}
                      </td>

                      {/* Calculation / Update Performed */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs font-mono">
                        <div className="truncate" title={log.calculationMethod}>
                          {log.calculationMethod || 'Quantity × Emission Factor'}
                        </div>
                      </td>

                      {/* Source & Evidence */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs">
                        <div className="truncate font-medium text-slate-700" title={log.source}>
                          {log.source || 'Operational Activity Record'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Detailed Audit Trace Inspection */}
        {selectedLogForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Audit Trace Record Detail</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLogForDetail(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Timestamp</span>
                  <p className="font-mono text-slate-900">{selectedLogForDetail.timestamp}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Actor / User</span>
                  <p className="font-semibold text-slate-900">{selectedLogForDetail.user}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Action & Classification</span>
                  <p className="font-semibold text-slate-900">{selectedLogForDetail.action} ({selectedLogForDetail.category})</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Field Changed</span>
                  <p className="font-bold text-slate-900">{selectedLogForDetail.fieldChanged || selectedLogForDetail.record}</p>
                </div>
                {selectedLogForDetail.prevValue && (
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Previous Value</span>
                    <p className="font-mono text-slate-600 line-through">{selectedLogForDetail.prevValue}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">New Recorded Value</span>
                  <p className="font-mono font-bold text-slate-900">{selectedLogForDetail.newValue}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Calculation / Update Performed</span>
                  <p className="font-mono text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800">
                    {selectedLogForDetail.calculationMethod || 'Direct calculation via Activity Quantity × Emission Factor'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Evidence & Source Reference</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {selectedLogForDetail.source || 'Operational Activity Record'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLogForDetail(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
