'use client';

import React, { useState, useEffect } from 'react';
import { getAdminContent, AdminContent, getArtistsDirectory, Artist } from '@/services/adminContentService';
import { 
  Search, 
  Filter, 
  Clock, 
  Play, 
  ExternalLink,
  Tag,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminContentFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [contents, artistsDir] = await Promise.all([
          getAdminContent(),
          getArtistsDirectory()
        ]);
        setContentList(contents);
        setArtists(artistsDir);
      } catch (err) {
        console.error("Failed to load admin content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  const getArtistDetails = (artistId: string) => {
    return artists.find(a => a.id === artistId);
  };

  // Filter logic
  const filteredItems = contentList.filter(item => {
    const artist = getArtistDetails(item.artist_id);
    const searchString = `${item.title} ${artist?.name || ''} ${item.genre}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900 p-4 border border-gray-800 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by title, artist, genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Music">Music</option>
            <option value="Video">Video</option>
            <option value="Comedy">Comedy</option>
            <option value="Documentary">Documentary</option>
          </select>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Grid of uploaded content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse h-48"></div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
          <AlertCircle className="mx-auto text-gray-600 mb-4" size={40} />
          <h3 className="text-lg font-semibold text-white">No Content Found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto text-sm">
            We couldn't find any curated upload content matching your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const artist = getArtistDetails(item.artist_id);
            return (
              <div 
                key={item.id} 
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col sm:flex-row gap-4"
              >
                {/* Video Preview / Thumbnail */}
                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black shrink-0 group">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a 
                    href={item.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                  </a>
                </div>

                {/* Video Info details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Header: Artist and Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {artist?.avatar_url && (
                          <img 
                            src={artist.avatar_url} 
                            alt={artist.name} 
                            className="w-5 h-5 rounded-full object-cover border border-gray-700 shrink-0"
                          />
                        )}
                        <span className="text-xs font-semibold text-gray-300 truncate">
                          {artist?.name || item.author_name}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.status === 'published' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 hover:text-red-500 transition-colors">
                      <a href={item.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                        {item.title}
                        <ExternalLink size={12} className="shrink-0 text-gray-500" />
                      </a>
                    </h4>
                  </div>

                  {/* Badges & Date footer */}
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-800/50">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 inline-flex items-center gap-1">
                        <Tag size={10} /> {item.category}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                        {item.genre}
                      </span>
                      {item.region && (
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 inline-flex items-center gap-1">
                          <MapPin size={10} /> {item.region}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} /> {formatDate(item.created_at)}
                      </span>
                      <span className="text-gray-600">Source: {item.source_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
