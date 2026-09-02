'use client';

import React from 'react';
import TopArtistsManagement from '@/components/Admin/TopArtistsManagement';

export default function TopArtistsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Top Artists</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage featured and top-ranked artists displayed across the platform.
        </p>
      </div>
      <TopArtistsManagement />
    </div>
  );
}
