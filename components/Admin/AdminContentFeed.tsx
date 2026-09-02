'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getAdminPublishedContent, 
  AdminContent, 
  getArtistsDirectory, 
  Artist,
  deleteAdminContent
} from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import { getYouTubeThumbnailUrl } from '@/utils/mediaUtils';
import MediaPlayerModal from '@/components/Common/MediaPlayerModal';
import { SawaflixLoader } from '@/components/SawaflixLogo';
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
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function AdminContentFeed({ refreshTrigger }: { refreshTrigger?: number }) {
  const [contentList, setContentList] = useState<AdminContent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Deletion State
  const [deletingItem, setDeletingItem] = useState<AdminContent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Media player modal
  const [playingMedia, setPlayingMedia] = useState<{
    url: string;
    title: string;
    isAudio: boolean;
    thumbnail?: string;
  } | null>(null);

  const { addNotification } = useAdminNotifications();

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

  const checkIsAudio = (item: AdminContent) => {
    const mediaUrl = ((item as any).media_url || (item as any).audio_url || (item as any).video_url || (item as any).url || item.youtube_url || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const isAudioExt = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.aac') || mediaUrl.endsWith('.flac') || mediaUrl.endsWith('.m4a') || mediaUrl.endsWith('.ogg');
    return isAudioExt || category === 'music' || category === 'audio' || (item as any).media_type === 'audio';
  };

  const isYouTubeUrl = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  const getPlayUrl = (item: AdminContent): string => {
    if (!item) return '';
    const url = 
      (item as any).media_url || 
      (item as any).mediaUrl || 
      (item as any).video_url || 
      (item as any).videoUrl || 
      (item as any).audio_url || 
      (item as any).audioUrl || 
      (item as any).hls_url || 
      (item as any).hlsUrl || 
      (item as any).stream_playback_url ||
      (item as any).stream_url || 
      (item as any).playback_url || 
      (item as any).file_url || 
      (item as any).r2_url || 
      (item as any).url || 
      item.youtube_url || 
      '';
    return typeof url === 'string' ? url.trim() : '';
  };

  // Filter logic
  const filteredItems = useMemo(() => contentList.filter(item => {
    const artist = getArtistDetails(item.artist_id || '');
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

    setPlayingMedia({
      url,
      title: item.title || 'Untitled',
      isAudio,
      thumbnail: item.thumbnail_url || undefined
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await deleteAdminContent(deletingItem.id);
      setContentList(prev => prev.filter(c => c.id !== deletingItem.id));
      addNotification({
        type: 'approved',
        title: 'Content Deleted',
        message: `"${deletingItem.title || 'Video'}" was removed from the feed.`
      });
      setDeletingItem(null);
    } catch (err: any) {
      console.error("Failed to delete feed item:", err);
      addNotification({
        type: 'rejected',
        title: 'Delete Failed',
        message: err?.message || 'Could not delete content.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {!loading && contentList.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle size={13} className="text-emerald-600" /> {contentList.length} item{contentList.length !== 1 ? 's' : ''} published
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <Video size={13} className="text-slate-400" /> {contentList.filter(i => !checkIsAudio(i)).length} videos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <Music size={13} className="text-slate-400" /> {contentList.filter(i => checkIsAudio(i)).length} audio
          </span>
        </div>
      )}

      {/* Search & Filters */}
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
          {/* File Type Selector */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">File: All Types</option>
            <option value="video">File: Video</option>
            <option value="audio">File: Audio</option>
          </select>

          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Music">Music</option>
            <option value="Comedy">Comedy</option>
            <option value="Culture">Culture</option>
            <option value="Sport">Sport</option>
            <option value="Video">Video</option>
            <option value="Documentary">Documentary</option>
          </select>
        </div>
      </div>

      {/* Grid of published content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <SawaflixLoader size={54} text="Loading published feed..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <AlertCircle className="mx-auto text-slate-400 mb-3" size={38} />
          <h3 className="text-base font-bold text-slate-900">No Published Content Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {contentList.length === 0
              ? 'Nothing has been published to the feed yet. Upload videos and hit "Publish" to display here.'
              : 'No items match your current search or filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const artist = getArtistDetails(item.artist_id || '');
            const playUrl = getPlayUrl(item);
            const isAudio = checkIsAudio(item);
            const isYT = isYouTubeUrl(playUrl);

            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row gap-4 group"
              >
                {/* Thumbnail / Play Preview */}
                <div 
                  onClick={() => handlePlayItem(item)}
                  className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 cursor-pointer shadow-2xs group/thumb"
                >
                  {(() => {
                    if (isAudio) {
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                          {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover opacity-60" />
                          ) : (
                            <Music size={28} className="text-red-500" />
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        />
                      );
                    }

                    return (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                        <Video size={24} />
                      </div>
                    );
                  })()}

                  {/* Play overlay button */}
                  {playUrl && (
                    <button
                      onClick={() => handlePlayItem(item)}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
                        <Play size={13} fill="currentColor" className="ml-0.5" />
                      </div>
                    </button>
                  )}

                  {/* YouTube badge */}
                  {isYT && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white">YT</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Header: Artist and Status & Delete */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        {artist?.avatar_url && (
                          <img 
                            src={artist.avatar_url} 
                            alt={artist.name} 
                            className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {artist?.name || item.author_name || 'Admin Upload'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                          Published
                        </span>
                        {/* Play Button */}
                        <button
                          onClick={() => handlePlayItem(item)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Play Media"
                        >
                          <Play size={10} className="text-red-600 fill-red-600" />
                          <span>Play</span>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                      <button 
                        onClick={() => handlePlayItem(item)}
                        className="text-left hover:text-red-600 transition-colors flex items-center gap-1.5"
                        disabled={!playUrl}
                      >
                        <span>{item.title || 'Untitled Media'}</span>
                        {playUrl && (
                          isYT 
                            ? <ExternalLink size={12} className="shrink-0 text-slate-400" />
                            : <Play size={10} fill="currentColor" className="shrink-0 text-slate-400" />
                        )}
                      </button>
                    </h4>
                  </div>

                  {/* Badges & Date footer */}
                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {item.category && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-flex items-center gap-1">
                          <Tag size={10} /> {item.category}
                        </span>
                      )}
                      {item.genre && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.genre}
                        </span>
                      )}
                      {isAudio && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-flex items-center gap-1">
                          <Music size={9} /> Audio
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Clock size={10} /> {formatDate(item.created_at)}
                      </span>
                      <span className="text-slate-400 capitalize">{(item as any).source_type || 'native'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-900">Delete Content</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-800">"{deletingItem.title || 'Untitled'}"</span> from the feed? This action will permanently remove it.
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

      {/* Media Player Modal */}
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
