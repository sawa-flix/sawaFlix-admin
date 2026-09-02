'use client';

import React from 'react';
import { UserCheck, Sparkles, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminCreatorsPage() {
  const creators = [
    { name: 'DJ Arafat Legacy', category: 'Music Artist', verified: true, videos: 34, followers: '1.2M', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
    { name: 'Abidjan Comedy Club', category: 'Comedy', verified: true, videos: 21, followers: '450K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Sahel Cinematic', category: 'Actor/Filmmaker', verified: true, videos: 15, followers: '280K', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verified Creators</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of verified African artists, producers, and storytellers.</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold border border-red-200 transition-all"
        >
          <UserCheck size={14} /> Review Verification Queue
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {creators.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{c.name}</h3>
                <CheckCircle2 size={13} className="text-red-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">{c.category}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                <span>{c.videos} uploads</span>
                <span>•</span>
                <span>{c.followers} followers</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
