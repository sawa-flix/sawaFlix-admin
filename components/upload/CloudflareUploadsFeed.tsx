'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getAdminContent, AdminContent, getArtistsDirectory, Artist } from '@/services/adminContentService';
import { 
  Search, 
  Clock, 
  Play, 
  ExternalLink,
  Tag,
  MapPin,
  AlertCircle,
  ArrowUpDown,
  RefreshCw,
  X,
  ShieldCheck,
  FileVideo,
  Music,
  Disc
} from 'lucide-react';

export default function CloudflareUploadsFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Media Modal Player State (Supports Video & Audio)
  const [playingMedia, setPlayingMedia] = useState<{ url: string; title: string; isAudio: boolean; thumbnail?: string } | null>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const [contents, artistsDir] = await Promise.all([
        getAdminContent(),
        getArtistsDirectory()
      ]);
      setContentList(contents);
      setArtists(artistsDir);
    } catch (err: any) {
      console.error("Failed to load Cloudflare media uploads:", err);
      setErrorMsg(err?.message || "Failed to load uploads securely from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const getArtistDetails = (artistId?: string) => {
    if (!artistId) return undefined;
    return artists.find(a => a.id === artistId);
  };

  // Helper to check if a URL is a YouTube link
  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper to determine media type
  const checkIsAudio = (item: AdminContent) => {
    const mediaUrl = ((item as any).media_url || (item as any).audio_url || (item as any).video_url || (item as any).url || item.youtube_url || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const isAudioExt = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.aac') || mediaUrl.endsWith('.flac') || mediaUrl.endsWith('.m4a') || mediaUrl.endsWith('.ogg');
    return isAudioExt || category === 'music' || category === 'audio' || (item as any).media_type === 'audio';
  };

  // Filtered & Sorted items - ALL direct media files (audio & video), excluding YouTube links
  const processedItems = useMemo(() => {
    const cloudflareMediaOnly = contentList.filter(item => {
      const mediaUrl = (item as any).media_url || (item as any).audio_url || (item as any).video_url || (item as any).url || item.youtube_url;
      const isExternalYouTube = isYouTubeUrl(mediaUrl);
      const isCloudflareSource = item.source_type === 'admin' || (item as any).storage_provider === 'cloudflare' || (mediaUrl && !isExternalYouTube);

      return isCloudflareSource && !isExternalYouTube;
    });

    const filtered = cloudflareMediaOnly.filter(item => {
      const artist = getArtistDetails(item.artist_id);
      const searchString = `${item.title || ''} ${artist?.name || ''} ${item.author_name || ''} ${item.genre || ''}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      const matchesCategory = (() => {
        if (categoryFilter === 'All') return true;
        const itemCat = (item.category || '').toLowerCase().trim();
        const filterCat = categoryFilter.toLowerCase().trim();
        const itemGenre = (item.genre || '').toLowerCase().trim();

        if (filterCat === 'music') {
          return itemCat === 'music' || itemCat === 'audio' || checkIsAudio(item);
        }
        if (filterCat === 'video') {
          return itemCat === 'video' || !checkIsAudio(item);
        }
        return itemCat === filterCat || itemCat.includes(filterCat) || itemGenre.includes(filterCat);
      })();

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.created_at || a.published_at || 0).getTime();
      const timeB = new Date(b.created_at || b.published_at || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [contentList, artists, searchTerm, statusFilter, categoryFilter, sortOrder]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 mt-10 pt-8 border-t border-gray-800/80">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc size={22} className="text-red-500 animate-spin-slow" />
            Uploaded Cloudflare Media Files (Audio & Video)
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {processedItems.length} {processedItems.length === 1 ? 'file' : 'files'}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-400 shrink-0" />
            <span>Strictly displaying verified Cloudflare audio & video media files via bearer authenticated <code className="text-red-400 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">/api/admin/content</code></span>
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-red-500' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh List'}</span>
        </button>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-900/80 backdrop-blur-sm p-3.5 border border-gray-800/80 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
          <input
            type="text"
            placeholder="Search by title, artist, genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950/80 border border-gray-800 focus:border-red-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-950/80 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Music">Music (Audio)</option>
            <option value="Video">Video</option>
            <option value="Culture">Culture</option>
            <option value="Sport">Sport</option>
            <option value="Comedy">Comedy</option>
            <option value="News">News</option>
            <option value="Geography/Nature">Geography/Nature</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-950/80 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Date Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-950/80 hover:bg-gray-800 border border-gray-800 text-xs font-medium text-gray-300 transition-all cursor-pointer"
            title="Sort by upload date"
          >
            <ArrowUpDown size={13} className="text-red-500" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Content Grid / Loading / Empty State */}
      {errorMsg ? (
        <div className="text-center py-12 bg-red-950/10 rounded-2xl border border-red-900/30 p-6">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
          <h3 className="text-sm font-semibold text-white">Error Loading Media Files</h3>
          <p className="text-xs text-gray-400 mt-1">{errorMsg}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 animate-pulse h-44"></div>
          ))}
        </div>
      ) : processedItems.length === 0 ? (
        <div className="text-center py-14 bg-gray-900/40 rounded-2xl border border-gray-800 border-dashed p-6">
          <Disc className="mx-auto text-gray-600 mb-3" size={36} />
          <h3 className="text-base font-semibold text-white">No Cloudflare Media Files Found</h3>
          <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto">
            No direct Cloudflare media file uploads (audio or video) match your search query or filter criteria. YouTube links have been excluded.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {processedItems.map((item) => {
            const artist = getArtistDetails(item.artist_id);
            const mediaUrl = (item as any).media_url || (item as any).audio_url || (item as any).video_url || (item as any).url || item.youtube_url;
            const isAudio = checkIsAudio(item);

            return (
              <div 
                key={item.id} 
                className="bg-gray-900/90 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row gap-4 group"
              >
                {/* Thumbnail Preview / Play Button */}
                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black shrink-0 flex items-center justify-center">
                  {!isAudio && mediaUrl && (!item.thumbnail_url || item.thumbnail_url.includes('unsplash.com')) ? (
                    <video
                      src={`${mediaUrl}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  ) : (
                    <img 
                      src={item.thumbnail_url || (isAudio ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&h=180&fit=crop' : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=320&h=180&fit=crop')} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Media Type Badge Overlay */}
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white border border-white/10 backdrop-blur-md flex items-center gap-1">
                    {isAudio ? <Music size={10} className="text-red-400" /> : <FileVideo size={10} className="text-blue-400" />}
                    <span>{isAudio ? 'Audio' : 'Video'}</span>
                  </div>

                  {mediaUrl && (
                    <button
                      onClick={() => setPlayingMedia({ url: mediaUrl, title: item.title, isAudio, thumbnail: item.thumbnail_url })}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/50 hover:scale-110 transition-transform">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Media Info Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Header: Author & Status */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        {artist?.avatar_url && (
                          <img 
                            src={artist.avatar_url} 
                            alt={artist.name} 
                            className="w-4 h-4 rounded-full object-cover border border-gray-700 shrink-0"
                          />
                        )}
                        <span className="text-xs font-semibold text-gray-300 truncate">
                          {artist?.name || item.author_name || 'Admin Curated'}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                        item.status === 'published' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 hover:text-red-400 transition-colors">
                      {mediaUrl ? (
                        <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                          <span>{item.title || 'Untitled Media'}</span>
                          <ExternalLink size={12} className="shrink-0 text-gray-500" />
                        </a>
                      ) : (
                        <span>{item.title || 'Untitled Media'}</span>
                      )}
                    </h4>
                  </div>

                  {/* Metadata Tags & Date Footer */}
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-800/60">
                    <div className="flex flex-wrap gap-1.5">
                      {item.category && (
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 inline-flex items-center gap-1">
                          <Tag size={10} /> {item.category}
                        </span>
                      )}
                      {item.genre && (
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                          {item.genre}
                        </span>
                      )}
                      {item.region && (
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 inline-flex items-center gap-1">
                          <MapPin size={10} /> {item.region}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 pt-0.5">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Clock size={10} /> Uploaded: {formatDate(item.created_at || item.published_at)}
                      </span>
                      <span className="text-green-400/90 font-medium flex items-center gap-1">
                        <ShieldCheck size={10} /> Cloudflare Secured
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HTML5 Direct Media Modal Player (Video / Audio) */}
      {playingMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 truncate pr-4">
                <ShieldCheck size={16} className="text-green-400 shrink-0" />
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300 uppercase">
                  {playingMedia.isAudio ? 'Audio Player' : 'Video Player'}
                </span>
                <h3 className="text-sm font-bold text-white truncate">{playingMedia.title}</h3>
              </div>
              <button
                onClick={() => setPlayingMedia(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content: Video Player or Audio Visualizer Card */}
            <div className="p-6 bg-black flex flex-col items-center justify-center min-h-[220px]">
              {playingMedia.isAudio ? (
                <div className="w-full flex flex-col items-center space-y-4">
                  {playingMedia.thumbnail ? (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border border-gray-800 shadow-xl relative">
                      <img src={playingMedia.thumbnail} alt={playingMedia.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Music size={32} className="text-red-500 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white shadow-lg">
                      <Music size={36} className="animate-pulse" />
                    </div>
                  )}
                  
                  <audio
                    src={playingMedia.url}
                    controls
                    autoPlay
                    className="w-full rounded-xl bg-gray-900 border border-gray-800 p-2"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video">
                  <video
                    src={playingMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


