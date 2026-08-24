'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getAdminPublishedContent, AdminContent, getArtistsDirectory, Artist } from '@/services/adminContentService';
import { getYouTubeThumbnailUrl } from '@/utils/mediaUtils';
import { 
  Search, 
  Clock, 
  Play,
  ExternalLink,
  Tag,
  MapPin,
  CheckCircle,
  AlertCircle,
  Music,
  Video,
  X,
  Loader2
} from 'lucide-react';

export default function AdminContentFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Media player modal
  const [playingMedia, setPlayingMedia] = useState<{
    url: string;
    title: string;
    isAudio: boolean;
    thumbnail?: string;
  } | null>(null);
  const [playUrlLoading, setPlayUrlLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [contents, artistsDir] = await Promise.all([
          getAdminPublishedContent(),
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

  // Helper to check audio vs video
  const checkIsAudio = (item: AdminContent) => {
    const mediaUrl = ((item as any).media_url || (item as any).audio_url || (item as any).video_url || (item as any).url || item.youtube_url || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const isAudioExt = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.aac') || mediaUrl.endsWith('.flac') || mediaUrl.endsWith('.m4a') || mediaUrl.endsWith('.ogg');
    return isAudioExt || category === 'music' || category === 'audio' || (item as any).media_type === 'audio';
  };

  const isYouTubeUrl = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  // Get best playable URL for an item
  const getPlayUrl = (item: AdminContent): string => {
    return (item as any).media_url || (item as any).video_url || (item as any).audio_url || (item as any).url || item.youtube_url || '';
  };

  // Filter logic
  const filteredItems = useMemo(() => contentList.filter(item => {
    const artist = getArtistDetails(item.artist_id);
    const searchString = `${item.title} ${artist?.name || ''} ${item.genre} ${item.category}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    const isAudio = checkIsAudio(item);
    const matchesFileType = (() => {
      if (fileTypeFilter === 'all') return true;
      if (fileTypeFilter === 'audio') return isAudio;
      if (fileTypeFilter === 'video') return !isAudio;
      return true;
    })();

    const matchesCategory = (() => {
      if (categoryFilter === 'All') return true;
      const itemCat = (item.category || '').toLowerCase().trim();
      const filterCat = categoryFilter.toLowerCase().trim();
      return itemCat === filterCat || itemCat.includes(filterCat);
    })();

    return matchesSearch && matchesFileType && matchesCategory;
  }), [contentList, searchTerm, fileTypeFilter, categoryFilter, artists]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePlayItem = (item: AdminContent) => {
    const url = getPlayUrl(item);
    if (!url) return;
    const isAudio = checkIsAudio(item);

    if (isYouTubeUrl(url)) {
      window.open(url, '_blank');
      return;
    }

    setPlayingMedia({
      url,
      title: item.title || 'Untitled',
      isAudio,
      thumbnail: item.thumbnail_url || undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {!loading && contentList.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <CheckCircle size={12} /> {contentList.length} item{contentList.length !== 1 ? 's' : ''} published
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold">
            <Video size={12} /> {contentList.filter(i => !checkIsAudio(i)).length} videos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold">
            <Music size={12} /> {contentList.filter(i => checkIsAudio(i)).length} audio
          </span>
        </div>
      )}

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
          {/* File Type Selector */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
            className="bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">File: All Types</option>
            <option value="video">File: Video</option>
            <option value="audio">File: Audio</option>
          </select>

          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Culture">Culture</option>
            <option value="Music">Music</option>
            <option value="Sport">Sport</option>
            <option value="Comedy">Comedy</option>
            <option value="News">News</option>
            <option value="Geography/Nature">Geography/Nature</option>
            <option value="Video">Video</option>
            <option value="Documentary">Documentary</option>
          </select>
        </div>
      </div>

      {/* Grid of published content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse h-48"></div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
          <AlertCircle className="mx-auto text-gray-600 mb-4" size={40} />
          <h3 className="text-lg font-semibold text-white">No Published Content Found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto text-sm">
            {contentList.length === 0
              ? 'Nothing has been published to the feed yet. Go to Uploaded Media and hit "Publish to Feed".'
              : 'No items match your current search or filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const artist = getArtistDetails(item.artist_id);
            const playUrl = getPlayUrl(item);
            const isAudio = checkIsAudio(item);
            const isYT = isYouTubeUrl(playUrl);

            return (
              <div 
                key={item.id} 
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col sm:flex-row gap-4 group"
              >
                {/* Thumbnail / Play Preview */}
                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black shrink-0">
                  {(() => {
                    if (isAudio) {
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
                          {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover opacity-50" />
                          ) : (
                            <Music size={32} className="text-red-500" />
                          )}
                        </div>
                      );
                    }

                    const effectiveThumb = item.thumbnail_url && !item.thumbnail_url.includes('unsplash.com')
                      ? item.thumbnail_url
                      : getYouTubeThumbnailUrl(playUrl);

                    if (effectiveThumb) {
                      return (
                        <img 
                          src={effectiveThumb} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      );
                    }

                    if (playUrl) {
                      return (
                        <video
                          src={`${playUrl}#t=0.5`}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                      );
                    }

                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gray-950">
                        <Video size={28} className="text-gray-700" />
                      </div>
                    );
                  })()}

                  {/* Play overlay button */}
                  {playUrl && (
                    <button
                      onClick={() => handlePlayItem(item)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                        {playUrlLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        )}
                      </div>
                    </button>
                  )}

                  {/* YouTube badge */}
                  {isYT && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600/90 text-white">YT</span>
                  )}
                </div>

                {/* Info */}
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
                          {artist?.name || item.author_name || 'Admin Upload'}
                        </span>
                      </div>
                      
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-green-500/10 text-green-500 border-green-500/20 shrink-0">
                        Published
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">
                      <button 
                        onClick={() => handlePlayItem(item)}
                        className="text-left hover:text-red-400 transition-colors flex items-center gap-1.5 group/title"
                        disabled={!playUrl}
                      >
                        {item.title || 'Untitled Media'}
                        {playUrl && (
                          isYT 
                            ? <ExternalLink size={12} className="shrink-0 text-gray-500" />
                            : <Play size={11} fill="currentColor" className="shrink-0 text-gray-600 group-hover/title:text-red-400 transition-colors" />
                        )}
                      </button>
                    </h4>
                  </div>

                  {/* Badges & Date footer */}
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-800/50">
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
                      {isAudio && (
                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 inline-flex items-center gap-1">
                          <Music size={9} /> Audio
                        </span>
                      )}
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
                      <span className="text-gray-600 capitalize">{(item as any).source_type || 'native'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Media Player Modal */}
      {playingMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPlayingMedia(null)}>
          <div 
            className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 truncate pr-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300 uppercase">
                  {playingMedia.isAudio ? 'Audio Player' : 'Video Player'}
                </span>
                <h3 className="text-sm font-bold text-white truncate">{playingMedia.title}</h3>
              </div>
              <button
                onClick={() => setPlayingMedia(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Player Content */}
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
