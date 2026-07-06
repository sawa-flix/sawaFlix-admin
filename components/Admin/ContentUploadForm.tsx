'use client';

import React, { useState, useEffect } from 'react';
import { 
  fetchOEmbed, 
  saveAdminContent
} from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import { 
  Youtube, 
  FileVideo, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Tags 
} from 'lucide-react';

const REGIONS = [
  'National',
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Garoua',
  'Bafoussam',
  'Limbe',
  'Buea',
  'Maroua',
  'Ngaoundéré',
  'Kumba'
];

export default function ContentUploadForm({ onSaved }: { onSaved?: () => void }) {
  // Form State
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Music' | 'Video' | 'Comedy' | 'Documentary'>('Music');
  const [genre, setGenre] = useState('');
  const [region, setRegion] = useState('National');

  // UI / Logic State
  const [oembedLoading, setOembedLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // YouTube details preview
  const [youtubePreview, setYoutubePreview] = useState<{
    title: string;
    author_name: string;
    thumbnail_url: string;
  } | null>(null);

  const { addNotification } = useAdminNotifications();


  // Validate YouTube URL format
  const getYouTubeId = (url: string) => {
    const regExp = /^^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[5] : null;
  };

  // Auto-fetch oEmbed on paste/change
  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYoutubeUrl(val);
    setError(null);
    setYoutubePreview(null);

    const videoId = getYouTubeId(val);
    if (videoId) {
      setOembedLoading(true);
      try {
        const data = await fetchOEmbed(val);
        setTitle(data.title);
        setYoutubePreview({
          title: data.title,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url
        });
      } catch (err: any) {
        setError(err.message || 'Failed to auto-fetch details. You can still fill title manually.');
      } finally {
        setOembedLoading(false);
      }
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError(null);
    setSuccess(false);

    // Validations
    if (!youtubeUrl || !getYouTubeId(youtubeUrl)) {
      setError('Please provide a valid YouTube URL.');
      return;
    }
    if (!title.trim()) {
      setError('Please specify a title.');
      return;
    }
    if (!genre.trim()) {
      setError('Please provide a genre.');
      return;
    }

    setSaving(true);
    try {
      
      await saveAdminContent({
        artist_id: '', // Artist is automatically resolved via YouTube author name
        youtube_url: youtubeUrl,
        title: title,
        thumbnail_url: youtubePreview?.thumbnail_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop',
        author_name: youtubePreview?.author_name || 'Admin Curated',
        category,
        genre,
        region,
        status
      });

      setSuccess(true);
      addNotification({
        type: 'approved',
        title: status === 'published' ? 'Content Published Successfully' : 'Draft Saved Successfully',
        message: `"${title}" has been successfully added to Sawaflix pipelines.`
      });

      // Clear Form on success
      setYoutubeUrl('');
      setTitle('');
      setGenre('');
      setRegion('National');
      setYoutubePreview(null);
      
      if (onSaved) onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
          <FileVideo size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Upload Curated Content</h2>
          <p className="text-sm text-gray-400">Curate and publish direct feed videos to Sawaflix</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-start space-x-2">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm flex items-start space-x-2">
          <Check className="shrink-0 mt-0.5" size={16} />
          <span>Content has been saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Content URL input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            1. Content URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={handleUrlChange}
              className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {oembedLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Youtube size={18} />
              )}
            </div>
          </div>
        </div>

        {/* oEmbed Autofill Preview */}
        {youtubePreview && (
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2">
            <img 
              src={youtubePreview.thumbnail_url} 
              alt="Thumbnail" 
              className="w-full sm:w-36 h-20 object-cover rounded-lg border border-gray-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-red-500 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/10 inline-flex items-center gap-1 mb-2">
                <Sparkles size={10} /> Auto-fetched oEmbed
              </span>
              <h4 className="text-sm font-bold text-white truncate">{youtubePreview.title}</h4>
              <p className="text-xs text-gray-400 mt-1">Channel: {youtubePreview.author_name}</p>
            </div>
          </div>
        )}

        {/* 2. Title Override */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            2. Content Display Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Display Title on the platform"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        {/* 3. Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
            >
              <option value="Music">Music</option>
              <option value="Video">Video</option>
              <option value="Comedy">Comedy</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Genre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Makossa, Gospel"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Tags size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Region Tag <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              >
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-gray-800">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <span>Publish Now</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
