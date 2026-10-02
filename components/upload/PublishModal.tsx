'use client';

import React, { useState } from 'react';
import { AdminContent } from '@/services/adminContentService';
import { getYouTubeThumbnailUrl } from '@/utils/mediaUtils';
import { X, Send, Sparkles, Film, Music, Tv, ShieldCheck, Tag, Eye, Clock, UserCheck } from 'lucide-react';

interface PublishModalProps {
  item: Partial<AdminContent> & { id?: string };
  isOpen: boolean;
  isPublishing: boolean;
  onClose: () => void;
  onConfirmPublish: (customizedData: Partial<AdminContent>) => Promise<void>;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  item,
  isOpen,
  isPublishing,
  onClose,
  onConfirmPublish
}) => {
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState((item as any).description || '');
  const [category, setCategory] = useState(item.category || 'Video');
  const [format, setFormat] = useState((item as any).format || 'standard');
  const [contentType, setContentType] = useState((item as any).content_type || 'video');
  const [visibility, setVisibility] = useState((item as any).visibility || 'public');
  const [creatorId, setCreatorId] = useState(item.artist_id || (item as any).creator_id || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirmPublish({
      ...item,
      title,
      description,
      category,
      format,
      content_type: contentType,
      visibility,
      artist_id: creatorId,
      creator_id: creatorId
    } as any);
  };

  const mediaUrl = (item as any).media_url || (item as any).video_url || item.youtube_url || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Configure Main Feed Appearance
              </h3>
              <p className="text-xs text-gray-400">
                Customize how Supabase displays this content on the user feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Media Preview Card */}
          <div className="flex gap-4 p-3 rounded-2xl bg-gray-950/80 border border-gray-800/80 items-center">
            <div className="relative w-24 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-gray-800">
              {(() => {
                const effectiveThumb = item.thumbnail_url && !item.thumbnail_url.includes('unsplash.com')
                  ? item.thumbnail_url
                  : getYouTubeThumbnailUrl(mediaUrl);

                if (effectiveThumb) {
                  return <img src={effectiveThumb} alt={title} className="w-full h-full object-cover" />;
                }

                if (mediaUrl) {
                  return (
                    <video
                      src={`${mediaUrl}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  );
                }

                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                    <Film size={20} />
                  </div>
                );
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 inline-block mb-1">
                Supabase Schema Feed Item
              </span>
              <p className="text-xs font-semibold text-white truncate">{title || 'Untitled Upload'}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{mediaUrl || 'No media URL attached'}</p>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <span>Feed Title</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title as it appears on main feed"
              className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Feed Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional summary or caption for feed viewers..."
              className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Grid Selectors: Category & Content Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Tag size={13} className="text-red-400" />
                <span>Feed Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="Video">Video</option>
                <option value="Music">Music</option>
                <option value="Culture">Culture</option>
                <option value="Sport">Sport</option>
                <option value="Comedy">Comedy</option>
                <option value="News">News</option>
                <option value="Geography/Nature">Geography/Nature</option>
                <option value="Documentary">Documentary</option>
                <option value="Reel">Reel / Short</option>
              </select>
            </div>

            {/* Content Type Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                {contentType === 'audio' ? <Music size={13} className="text-purple-400" /> : <Film size={13} className="text-blue-400" />}
                <span>Content Type</span>
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="video">Video Media</option>
                <option value="audio">Audio Track</option>
              </select>
            </div>

          </div>

          {/* Grid Selectors: Format & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Format Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Tv size={13} className="text-amber-400" />
                <span>Display Format</span>
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="standard">Standard (Horizontal 16:9)</option>
                <option value="reel">Reel / Vertical (TikTok 9:16)</option>
                <option value="short">Short Clip (&lt; 60s)</option>
              </select>
            </div>

            {/* Visibility Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Eye size={13} className="text-green-400" />
                <span>Visibility</span>
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="public">Public (Visible to all users)</option>
                <option value="unlisted">Unlisted (Link only)</option>
                <option value="private">Private (Admin only)</option>
              </select>
            </div>

          </div>

          {/* Creator / Artist ID Optional Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <UserCheck size={13} className="text-teal-400" />
              <span>Creator / Artist UUID (Supabase Constraint)</span>
            </label>
            <input
              type="text"
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              placeholder="Auto-assigned from session if left blank"
              className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-950 text-white text-xs font-bold transition-all border border-gray-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <span>Publishing to Main Feed...</span>
              ) : (
                <>
                  <Send size={13} className="text-red-500" />
                  <span>Confirm & Publish to Feed</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
