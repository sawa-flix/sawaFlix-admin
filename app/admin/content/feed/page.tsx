'use client';

import React, { useState } from 'react';
import AdminContentFeed from '@/components/Admin/AdminContentFeed';

export default function UploadedFeedPage() {
  const [refreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Uploaded Feed</h1>
        <p className="text-xs text-slate-500 mt-1">
          Browse and manage all uploaded content in the curated pipeline.
        </p>
      </div>
      <AdminContentFeed refreshTrigger={refreshKey} />
    </div>
  );
}
