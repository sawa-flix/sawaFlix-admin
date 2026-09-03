'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getAdminContent, 
  AdminContent, 
  getArtistsDirectory, 
  Artist, 
  publishToMainFeed,
  deleteAdminContent
} from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import MediaPlayerModal from '@/components/Common/MediaPlayerModal';
import { SawaflixLoader } from '@/components/SawaflixLogo';
import { 
  Search, 
  Clock, 
  Play, 
  ExternalLink,
  Calendar,
  RefreshCw,
  X,
  FileVideo,
  Music,
  Send,
  Loader2,
  Trash2,
  Edit2,
  MoreVertical,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

export default function CloudflareUploadsFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const router = useRouter();
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Publishing & Deleting States
  const [publishingIds, setPublishingIds] = useState<Set<string>>(new Set());
  const [deletingItem, setDeletingItem] = useState<AdminContent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selection & Dropdowns
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { addNotification } = useAdminNotifications();

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Media Modal Player State (Supports Video & Audio)
  const [playingMedia, setPlayingMedia] = useState<{ 
    url: string; 
    title: string; 
    isAudio: boolean; 
    thumbnail?: string 
  } | null>(null);

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
      console.error("Failed to load media uploads:", err);
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

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getMediaUrl = (item: any): string => {
    if (!item) return '';

    // Collect ALL candidate URLs from every possible field
    const candidates: string[] = [
      item.media_url, item.mediaUrl,
      item.video_url, item.videoUrl,
      item.audio_url, item.audioUrl,
      item.hls_url, item.hlsUrl,
      item.stream_playback_url, item.streamPlaybackUrl,
      item.stream_url, item.streamUrl,
      item.playback_url, item.playbackUrl,
      item.file_url, item.fileUrl,
      item.url,
      item.youtube_url, item.youtubeUrl,
    ].filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
     .map(u => u.trim());

    // Helper: is this a truly broken URL (empty R2 credentials or raw S3 endpoint without signing)?
    const isBrokenR2 = (u: string) =>
      u.includes('X-Amz-Credential=%2F') || // empty access key
      (u.includes('r2.cloudflarestorage.com') && !u.includes('X-Amz-'));  // raw R2 endpoint without any signing

    // 0th pass: backend stream endpoints are always best (generate fresh presigned URLs on-demand)
    const streamUrl = candidates.find(u => u.includes('/api/admin/upload/stream/'));
    if (streamUrl) return streamUrl;

    // 1st pass: prefer Cloudinary or YouTube (known to stream reliably)
    const best = candidates.find(u => u.includes('cloudinary.com') || u.includes('youtube.com') || u.includes('youtu.be'));
    if (best) return best;

    // 2nd pass: any HTTP URL that isn't broken
    const playable = candidates.find(u => u.startsWith('http') && !isBrokenR2(u));
    if (playable) return playable;

    // 3rd pass: last resort, return the first candidate
    return candidates[0] || '';
  };

  const checkIsAudio = (item: AdminContent) => {
    const mediaUrl = getMediaUrl(item).toLowerCase();
    const category = (item.category || (item as any).category_name || (item as any).categoryName || '').toLowerCase();
    const contentType = ((item as any).content_type || (item as any).contentType || '').toLowerCase();
    const isAudioExt = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.aac') || mediaUrl.endsWith('.flac') || mediaUrl.endsWith('.m4a') || mediaUrl.endsWith('.ogg');
    return isAudioExt || category === 'music' || category === 'audio' || (item as any).media_type === 'audio' || (item as any).mediaType === 'audio' || contentType === 'audio';
  };

  // Helper to format video duration (e.g. 02:45)
  const formatDuration = (item: AdminContent) => {
    const duration = (item as any).duration;
    if (typeof duration === 'number' && duration > 0) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return '00:38';
  };

  const handlePublishItemToFeed = async (item: AdminContent) => {
    if (publishingIds.has(item.id)) return;
    setPublishingIds(prev => new Set(prev).add(item.id));

    try {
      await publishToMainFeed(item);
      addNotification({
        type: 'approved',
        title: 'Published to User Feed!',
        message: `"${item.title || 'Video'}" is now live!`
      });
      loadData(true);
      setTimeout(() => {
        router.push('/admin/content/feed');
      }, 600);
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

  // Video Deletion Handler
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await deleteAdminContent(deletingItem.id);
      
      // Update local state immediately
      setContentList(prev => prev.filter(c => c.id !== deletingItem.id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deletingItem.id);
        return next;
      });

      addNotification({
        type: 'approved',
        title: 'Video Deleted',
        message: `"${deletingItem.title || 'Video'}" was successfully deleted.`
      });

      setDeletingItem(null);
    } catch (err: any) {
      console.error("Failed to delete video:", err);
      addNotification({
        type: 'rejected',
        title: 'Delete Failed',
        message: err?.message || 'Could not delete video. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted items (Includes all uploaded & catalog media)
  const processedItems = useMemo(() => {
    const filtered = contentList.filter(item => {
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

        if (filterCat === 'music') return itemCat === 'music' || itemCat === 'audio' || isAudio;
        if (filterCat === 'video') return itemCat === 'video' || !isAudio;
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

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedItems.slice(startIndex, startIndex + pageSize);
  }, [processedItems, currentPage]);

  const totalPages = Math.ceil(processedItems.length / pageSize) || 1;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Aug 22, 2026 10:30 AM';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Aug 22, 2026 10:30 AM';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map(i => i.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900">Uploaded Media</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              {processedItems.length} {processedItems.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Contains uploaded videos in draft</span>
            <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[11px] border border-red-100">Drafts</span>
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin text-red-500' : 'text-slate-400'} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3.5 border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by title, artist, genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* File Type Filter */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">File: All Types</option>
            <option value="video">File: Video</option>
            <option value="audio">File: Audio</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Music">Music</option>
            <option value="Comedy">Comedy</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Culture">Culture</option>
            <option value="Sport">Sport</option>
            <option value="Video">Video</option>
            <option value="Documentary">Documentary</option>
          </select>

          {/* Date Sort Toggle */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <SawaflixLoader size={54} text="Loading catalog media..." />
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-16 p-6">
            <FileVideo className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-sm font-bold text-slate-900">No media found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No uploaded media matches your filter criteria. Drag and drop a new video above to add to the catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedItems.length && paginatedItems.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 w-36">PREVIEW</th>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">UPLOADED</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.map((item, idx) => {
                  const isAudio = checkIsAudio(item);
                  const mediaUrl = getMediaUrl(item);
                  const isSelected = selectedIds.has(item.id);
                  const isPublishing = publishingIds.has(item.id);
                  const duration = formatDuration(item);
                  const isPublished = item.status === 'published';

                  const handlePlay = () => {
                    if (mediaUrl) {
                      setPlayingMedia({
                        url: mediaUrl,
                        title: item.title || 'Live Verified Media',
                        isAudio,
                        thumbnail: item.thumbnail_url || undefined
                      });
                    }
                  };

                  return (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admin/content/${item.id}`)}
                      className={`hover:bg-slate-50/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-red-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
                        />
                      </td>

                      {/* Preview Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div 
                          className="relative w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 group/thumb cursor-pointer shadow-xs"
                        >
                          {item.thumbnail_url && !item.thumbnail_url.includes('unsplash.com') ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                            />
                          ) : !isAudio && mediaUrl ? (
                            <video
                              src={`${mediaUrl}#t=0.5`}
                              preload="metadata"
                              muted
                              playsInline
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 pointer-events-none"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                              {isAudio ? <Music size={18} className="text-purple-400" /> : <FileVideo size={18} />}
                            </div>
                          )}

                          {/* Duration Badge */}
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[9px] font-semibold tracking-tight">
                            {duration}
                          </div>

                          {/* Play Button Overlay */}
                          {mediaUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingMedia({ url: mediaUrl, title: item.title, isAudio, thumbnail: item.thumbnail_url });
                              }}
                              className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            >
                              <div className="w-7 h-7 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                <Play size={10} fill="currentColor" className="ml-0.5 text-slate-900" />
                              </div>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Title & Metadata */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/content/${item.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate hover:underline"
                            >
                              {item.title || 'Live Verified Admin Video'}
                            </Link>
                            {mediaUrl && (
                              <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {item.author_name || 'Admin Upload'}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                              {isAudio ? 'Audio' : 'Video'}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/50">
                              {item.genre || (idx % 2 === 0 ? 'General' : 'BTS')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 text-xs">
                          {item.category || (idx === 0 ? 'Music' : idx === 1 ? 'Comedy' : 'Entertainment')}
                        </span>
                      </td>

                      {/* Uploaded Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isPublished
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                : idx === 1
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                            }`}
                          >
                            {isPublished ? 'Published' : idx === 1 ? 'Ready' : 'Draft'}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {isPublished ? 'Live on feed' : idx === 1 ? 'Updated 1h ago' : 'Updated 2m ago'}
                          </p>
                        </div>
                      </td>

                      {/* Action: Play, Publish & DELETE */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Play Button */}
                          <button
                            onClick={handlePlay}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            title="Play media in preview player"
                          >
                            <Play size={10} fill="currentColor" className="text-slate-600" />
                            <span>Play</span>
                          </button>

                          {!isPublished && (
                            <button
                              onClick={() => handlePublishItemToFeed(item)}
                              disabled={isPublishing}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isPublishing ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <span>Publish</span>
                              )}
                            </button>
                          )}

                          {/* Direct Delete Button */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Three Dots Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenActionMenuId(openActionMenuId === item.id ? null : item.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical size={15} />
                            </button>

                            {openActionMenuId === item.id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    router.push(`/admin/content/${item.id}`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <ExternalLink size={13} /> View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    if (mediaUrl) setPlayingMedia({ url: mediaUrl, title: item.title, isAudio, thumbnail: item.thumbnail_url });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye size={13} /> Preview
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setDeletingItem(item);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={13} /> Delete Video
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer / Pagination */}
        {!loading && processedItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, processedItems.length)} to{' '}
              {Math.min(currentPage * pageSize, processedItems.length)} of {processedItems.length} results
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isCurrent = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-900">Delete Video</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{deletingItem.title || 'Untitled Media'}"</span>? This will permanently remove the video from the Cloudflare media catalog and the feed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Direct Media Modal Player */}
      <MediaPlayerModal
        isOpen={Boolean(playingMedia)}
        onClose={() => setPlayingMedia(null)}
        url={playingMedia?.url || ''}
        title={playingMedia?.title || ''}
        isAudio={playingMedia?.isAudio}
        thumbnail={playingMedia?.thumbnail}
      />
    </div>
  );
}
