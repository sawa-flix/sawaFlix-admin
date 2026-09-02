'use client';

import React from 'react';
import { Activity, Upload, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

export default function AdminActivityPage() {
  const activities = [
    { title: 'Video Published', desc: 'Live Verified Admin Video was published to the main feed', time: '10 mins ago', icon: Upload, color: 'text-red-500 bg-red-50' },
    { title: 'Creator Verified', desc: 'DJ Arafat Legacy application was approved', time: '1 hour ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
    { title: 'Content Flagged', desc: 'A comedy clip was reviewed for content guidelines', time: '3 hours ago', icon: ShieldAlert, color: 'text-amber-500 bg-amber-50' },
    { title: 'Direct Upload Confirmed', desc: 'Behind The Scenes video uploaded to Cloudflare catalog', time: '5 hours ago', icon: Activity, color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit & Activity Log</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time trail of administrative actions, moderation, and media changes.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="divide-y divide-slate-100">
          {activities.map((act, i) => {
            const Icon = act.icon;
            return (
              <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{act.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
                  <Clock size={12} /> {act.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
