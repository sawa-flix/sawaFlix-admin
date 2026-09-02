'use client';

import React from 'react';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    { title: 'Weekly Streaming Summary', date: 'Aug 28, 2026', type: 'PDF', size: '2.4 MB' },
    { title: 'Creator Monetization & Royalties', date: 'Aug 24, 2026', type: 'CSV', size: '1.1 MB' },
    { title: 'Content Safety & Moderation Audit', date: 'Aug 20, 2026', type: 'PDF', size: '890 KB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Media Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Export platform metrics, audit reports, and billing data.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {reports.map((r, i) => (
          <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{r.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{r.date} • {r.type} • {r.size}</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all">
              <Download size={13} /> Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
