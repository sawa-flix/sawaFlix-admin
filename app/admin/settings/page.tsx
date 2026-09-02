'use client';

import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Cloud } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure Cloudflare media pipeline, upload restrictions, and notification webhooks.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Cloud size={16} className="text-red-500" /> Cloudflare Media Storage
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Upload Max File Size (MB)</label>
              <input
                type="number"
                defaultValue={40}
                className="w-full max-w-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Duration (Minutes)</label>
              <input
                type="number"
                defaultValue={3}
                className="w-full max-w-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Save size={15} /> {saved ? 'Saved Successfully!' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
