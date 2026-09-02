'use client';

import React, { useState } from 'react';
import { FolderTree, Plus, Music, Film, Smile, Compass, Radio, BookOpen, MoreVertical } from 'lucide-react';

export default function ContentCategoriesPage() {
  const [categories] = useState([
    { name: 'Music', count: 48, icon: Music, color: 'text-red-500 bg-red-50' },
    { name: 'Comedy', count: 32, icon: Smile, color: 'text-amber-500 bg-amber-50' },
    { name: 'Culture', count: 19, icon: Compass, color: 'text-purple-500 bg-purple-50' },
    { name: 'Film & Cinema', count: 26, icon: Film, color: 'text-blue-500 bg-blue-50' },
    { name: 'Podcasts & Radio', count: 14, icon: Radio, color: 'text-emerald-500 bg-emerald-50' },
    { name: 'Documentary', count: 9, icon: BookOpen, color: 'text-rose-500 bg-rose-50' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Organize and classify media catalogs, genres, and browse tags.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-slate-300 transition-all">
              <div className="flex items-center space-x-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  <span className="text-xs text-slate-500">{cat.count} items active</span>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                <MoreVertical size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
