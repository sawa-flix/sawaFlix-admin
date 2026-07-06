'use client';

import React, { useState } from 'react';
import ContentUploadForm from '@/components/Admin/ContentUploadForm';
import { useRouter } from 'next/navigation';

export default function UploadContentPage() {
  const router = useRouter();

  const handleSaved = () => {
    router.push('/admin/content/feed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Content</h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload and manage manual video uploads. Auto-merged into user feeds with zero YouTube quota consumption.
        </p>
      </div>
      <ContentUploadForm onSaved={handleSaved} />
    </div>
  );
}
