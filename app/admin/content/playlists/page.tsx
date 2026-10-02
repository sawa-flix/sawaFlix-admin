'use client';

import React, { useState } from 'react';
import { ListMusic, Plus, Play, ExternalLink } from 'lucide-react';

export default function ContentPlaylistsPage() {
  const [playlists] = useState([
    { title: 'Top Hits of Africa 2026', itemsCount: 24, curator: 'SawaFlix Editorial', banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop' },
    { title: 'African Cinema Spotlights', itemsCount: 12, curator: 'Curator Desk', banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=200&fit=crop' },
    { title: 'Laugh Out Loud Comedy Reels', itemsCount: 30, curator: 'Community Team', banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Curated Playlists</h1>
          <p className="text-xs text-slate-500 mt-1">Manage editorial collections and featured mixes shown to users.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">
          <Plus size={15} /> Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {playlists.map((pl, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden group hover:border-slate-300 transition-all">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img src={pl.banner} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{pl.title}</h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>{pl.itemsCount} videos</span>
                <span className="font-medium text-slate-600">{pl.curator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
