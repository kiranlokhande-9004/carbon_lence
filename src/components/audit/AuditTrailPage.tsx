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
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs, business, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'All' && log.action !== selectedAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRecord = log.record.toLowerCase().includes(q);
        const matchUser = log.user.toLowerCase().includes(q);
        const matchVal = (log.newValue || '').toLowerCase().includes(q);
        if (!matchRecord && !matchUser && !matchVal) return false;
      }
      return true;
    });
  }, [auditLogs, selectedAction, searchQuery]);

  const exportAuditCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Subject,PreviousValue,NewValue,Category\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.record}","${l.prevValue || ''}","${l.newValue || ''}","${l.category}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonLens_Audit_Trail_${business.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    showToast('Exported audit trail to CSV', 'success');
  };

  return (
    <div className="relative min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Ambient background blur mesh layer specifically for Audit Trail section */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient atmospheric color orbs that create the rich background blur lighting */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-500/18 blur-[100px]" />
        <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] rounded-full bg-sky-500/15 blur-[90px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-400/12 blur-[110px]" />
        {/* Full viewport frosted glass backdrop blur */}
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-2xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Compliance & Calculation Audit Trail
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Immutable operational log tracking all data inputs, factor changes, and inventory modifications.
              </p>
            </div>
          </div>

          <button
            onClick={exportAuditCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur-xs hover:bg-white border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Audit Log</span>
          </button>
        </div>

        {/* Trust & Assurance Callout */}
        <div className="floating-info-card-1">
          <div className="p-4 rounded-2xl attractive-info-card backdrop-blur-md flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Audit-Proof Assurance</span>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                External auditors, enterprise customers, and ESG verifiers require proof that carbon disclosures are backed by authentic activity records rather than retroactive estimations. Every event in this ledger includes author stamps, before-and-after values, and calculation formula identifiers.
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="floating-info-card-2">
          <div className="p-4 rounded-2xl attractive-info-card backdrop-blur-md flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by user, activity name, or value..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300/80 rounded-xl bg-white/90 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-3 py-2 border border-slate-300/80 rounded-xl bg-white/90 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Actions</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
                <option value="Factor Changed">Factor Changed</option>
                <option value="CSV Imported">CSV Imported</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 backdrop-blur-xs text-slate-600 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Activity Record</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Modifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  let badgeStyle = 'bg-slate-100 text-slate-700';
                  if (log.action === 'Created') badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  if (log.action === 'Updated') badgeStyle = 'bg-sky-50 text-sky-700 border border-sky-200';
                  if (log.action === 'Deleted') badgeStyle = 'bg-rose-50 text-rose-700 border border-rose-200';
                  if (log.action === 'CSV Imported') badgeStyle = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                  if (log.action === 'Factor Changed') badgeStyle = 'bg-amber-50 text-amber-700 border border-amber-200';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${badgeStyle}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">{log.record}</td>
                      <td className="py-3 px-3 text-slate-500">{log.category}</td>
                      <td className="py-3 px-3 text-xs">
                        {log.prevValue ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="line-through text-slate-400">{log.prevValue}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-semibold text-slate-900">{log.newValue}</span>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] font-medium text-slate-900">{log.newValue}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
