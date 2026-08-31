'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminContent, AdminContent, getArtistsDirectory, Artist, publishToMainFeed } from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
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
  Disc,
  Send,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function CloudflareUploadsFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const router = useRouter();
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishingIds, setPublishingIds] = useState<Set<string>>(new Set());

  const { addNotification } = useAdminNotifications();

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'video' | 'audio'>('all');
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

  const handlePublishItemToFeed = async (item: AdminContent) => {
    if (publishingIds.has(item.id)) return;
    setPublishingIds(prev => new Set(prev).add(item.id));

    try {
      await publishToMainFeed(item);
      addNotification({
        type: 'approved',
        title: 'Published to User Feed!',
        message: `"${item.title || 'Video'}" is live! Navigating to Uploaded Feed...`
      });
      loadData(true);
      setTimeout(() => {
        router.push('/admin/content/feed');
      }, 700);
    } catch (err: any) {
      console.error("Publish to feed failed:", err);
      addNotification({
        type: 'rejected',
        title: 'Publishing Failed',
        message: err?.message || 'Failed to publish video to main user feed.'
      });
    } finally {
      setPublishingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
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
    const mediaUrl = ((item as any).media_url || (item as any).mediaUrl || (item as any).audio_url || (item as any).audioUrl || (item as any).video_url || (item as any).videoUrl || (item as any).file_url || (item as any).fileUrl || (item as any).r2_url || (item as any).r2Url || (item as any).url || item.youtube_url || '').toLowerCase();
    const category = (item.category || (item as any).category_name || (item as any).categoryName || '').toLowerCase();
    const isAudioExt = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.aac') || mediaUrl.endsWith('.flac') || mediaUrl.endsWith('.m4a') || mediaUrl.endsWith('.ogg');
    return isAudioExt || category === 'music' || category === 'audio' || (item as any).media_type === 'audio' || (item as any).mediaType === 'audio';
  };

  // Count of published items (for the "view in feed" nudge)
  const publishedCount = useMemo(() => contentList.filter(item => item.status === 'published').length, [contentList]);

  // Filtered & Sorted items - ALL direct media files (audio & video), excluding YouTube links and published items
  const processedItems = useMemo(() => {
    const cloudflareMediaOnly = contentList.filter(item => {
      const mediaUrl = (item as any).media_url || (item as any).mediaUrl || (item as any).audio_url || (item as any).audioUrl || (item as any).video_url || (item as any).videoUrl || (item as any).file_url || (item as any).fileUrl || (item as any).r2_url || (item as any).r2Url || (item as any).stream_url || (item as any).streamUrl || (item as any).url || item.youtube_url || '';
      const isExternalYouTube = isYouTubeUrl(mediaUrl) || (item.youtube_url && isYouTubeUrl(item.youtube_url) && (item as any).source_type === 'youtube');
      
      const sourceType = (item as any).source_type || '';
      const isCloudflareSource = 
        sourceType === 'native' || 
        sourceType === 'admin' || 
        sourceType === 'cloudflare' || 
        sourceType === 'upload' || 
        sourceType === 'direct' || 
        (item as any).storage_provider === 'cloudflare' || 
        (Boolean(mediaUrl) && !isExternalYouTube);

      // Published items move to the Uploaded Feed — hide them here
      const isPublished = item.status === 'published';

      return isCloudflareSource && !isExternalYouTube && !isPublished;
    });

    const filtered = cloudflareMediaOnly.filter(item => {
      const artist = getArtistDetails(item.artist_id || (item as any).artistId || (item as any).creator_id || (item as any).creatorId);
      const titleStr = item.title || (item as any).name || (item as any).video_title || (item as any).videoTitle || '';
      const authorStr = item.author_name || (item as any).authorName || (item as any).creator_name || (item as any).creatorName || '';
      const genreStr = item.genre || (item as any).genre_name || '';
      const searchString = `${titleStr} ${artist?.name || ''} ${authorStr} ${genreStr}`.toLowerCase();
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
        const itemCat = (item.category || (item as any).category_name || (item as any).categoryName || '').toLowerCase().trim();
        const filterCat = categoryFilter.toLowerCase().trim();
        const itemGenre = (item.genre || (item as any).genre_name || '').toLowerCase().trim();

        if (filterCat === 'music') {
          return itemCat === 'music' || itemCat === 'audio' || isAudio;
        }
        if (filterCat === 'video') {
          return itemCat === 'video' || !isAudio;
        }
        return itemCat === filterCat || itemCat.includes(filterCat) || itemGenre.includes(filterCat);
      })();

      return matchesSearch && matchesFileType && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.created_at || (a as any).createdAt || (a as any).uploaded_at || (a as any).uploadedAt || a.published_at || 0).getTime();
      const timeB = new Date(b.created_at || (b as any).createdAt || (b as any).uploaded_at || (b as any).uploadedAt || b.published_at || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [contentList, artists, searchTerm, fileTypeFilter, categoryFilter, sortOrder]);

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
            Uploaded Media
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {processedItems.length} {processedItems.length === 1 ? 'file' : 'files'}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-400 shrink-0" />
            <span>Contains uploaded videos in draft <code className="text-red-400 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">Drafts</code></span>
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
          {/* File Type Filter */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
            className="bg-gray-950/80 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="all">File: All Types</option>
            <option value="video">File: Video</option>
            <option value="audio">File: Audio</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-950/80 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none cursor-pointer"
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
          <h3 className="text-base font-semibold text-white">
            {publishedCount > 0 ? 'All uploads have been published' : 'No Uploaded Media Found'}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto">
            {publishedCount > 0
              ? `${publishedCount} item${publishedCount > 1 ? 's have' : ' has'} been published to the user feed and moved to Uploaded Feed. Upload new content or adjust filters.`
              : 'No direct media uploads (audio or video) match your search query or filter.'}
          </p>
          {publishedCount > 0 && (
            <a
              href="/admin/content/feed"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-semibold transition-all"
            >
              View Uploaded Feed →
            </a>
          )}
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
                      {item.status === 'published' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[10px] shadow-sm">
                          <CheckCircle size={12} className="text-emerald-400" /> Published to Feed
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePublishItemToFeed(item)}
                          disabled={publishingIds.has(item.id)}
                          className="relative group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-950 text-gray-200 hover:text-white text-[11px] font-semibold transition-all duration-200 border border-gray-800 hover:border-red-500 hover:shadow-md hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        >
                          {publishingIds.has(item.id) ? (
                            <>
                              <Loader2 size={12} className="animate-spin text-red-500" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <Send size={11} className="text-gray-400 group-hover/btn:text-red-500 transition-colors group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                              <span>Publish to Feed</span>
                            </>
                          )}
                        </button>
                      )}
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


