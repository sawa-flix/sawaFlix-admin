'use client';

import React, { useState } from 'react';
import ContentUploadForm from '@/components/Admin/ContentUploadForm';
import AdminContentFeed from '@/components/Admin/AdminContentFeed';
import TopArtistsManagement from '@/components/Admin/TopArtistsManagement';
import { PlusCircle, ListVideo, Star } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'feed' | 'top-artists'>('upload');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    // Increment key to trigger reloading in feed component
    setRefreshKey(prev => prev + 1);
    setActiveTab('feed');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Curated Content Pipeline</h1>
          <p className="text-sm text-gray-400">
            Upload and view manual video uploads. Auto-merged into user feeds with zero YouTube quota consumption.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="bg-gray-900 p-1 border border-gray-800 rounded-xl flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PlusCircle size={14} />
            <span>Upload Content</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ListVideo size={14} />
            <span>Uploaded Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('top-artists')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'top-artists'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Star size={14} />
            <span>Top Artists</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      <div className="transition-all duration-300">
        {activeTab === 'upload' && <ContentUploadForm onSaved={handleSaved} />}
        {activeTab === 'feed' && <AdminContentFeed refreshTrigger={refreshKey} />}
        {activeTab === 'top-artists' && <TopArtistsManagement />}
      </div>
    </div>
  );
}
