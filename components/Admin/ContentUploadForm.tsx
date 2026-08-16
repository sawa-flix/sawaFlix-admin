'use client';

import React, { useState } from 'react';
import { 
  fetchOEmbed, 
  saveAdminContent,
  presignAdminUpload,
  confirmAdminUpload
} from '@/services/adminContentService';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import { 
  Youtube, 
  FileVideo, 
  UploadCloud,
  Check, 
  Loader2, 
  MapPin, 
  Tags,
  Play
} from 'lucide-react';

const REGIONS = [
  'National', 'Douala', 'Yaoundé', 'Bamenda', 'Garoua', 
  'Bafoussam', 'Limbe', 'Buea', 'Maroua', 'Ngaoundéré', 'Kumba'
];

export default function ContentUploadForm({ onSaved }: { onSaved?: () => void }) {
  // Toggle State
  const [uploadType, setUploadType] = useState<'youtube' | 'native'>('youtube');

  // Form State
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
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

  const getYouTubeId = (url: string) => {
    const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[5] : null;
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setTitle(file.name.split('.')[0]); // auto-fill title
      setError(null);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError('Please specify a title.');
      return;
    }
    if (!genre.trim()) {
      setError('Please provide a genre.');
      return;
    }

    if (uploadType === 'youtube') {
      if (!youtubeUrl || !getYouTubeId(youtubeUrl)) {
        setError('Please provide a valid YouTube URL.');
        return;
      }
      
      setSaving(true);
      try {
        await saveAdminContent({
          youtube_url: youtubeUrl,
          title,
          thumbnail_url: youtubePreview?.thumbnail_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=320&h=180&fit=crop',
          author_name: youtubePreview?.author_name || 'Admin Curated',
          category,
          genre,
          region,
          status
        });
        finishSubmit(status);
      } catch (err: any) {
        setError(err.message || 'Failed to save content.');
        setSaving(false);
      }

    } else {
      // Native File Upload Flow
      if (!videoFile) {
        setError('Please select a video file to upload.');
        return;
      }

      setSaving(true);
      try {
        // 1. Get Presigned URL
        addNotification({ type: 'info', title: 'Upload Starting', message: 'Generating secure upload URL...' });
        const { videoId, uploadUrl } = await presignAdminUpload(videoFile.name, videoFile.type);

        // 2. Upload direct to Cloudflare R2
        addNotification({ type: 'info', title: 'Uploading', message: 'Uploading video file to Sawaflix servers...' });
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': videoFile.type },
          body: videoFile
        });

        if (!uploadRes.ok) throw new Error('Direct file upload to Cloudflare failed');

        // 3. Confirm metadata
        await confirmAdminUpload(videoId, {
          title,
          category,
          genre,
          region,
          status,
          source_type: 'native'
        });

        finishSubmit(status);
      } catch (err: any) {
        setError(err.message || 'Upload failed.');
        setSaving(false);
      }
    }
  };

  const finishSubmit = (status: string) => {
    setSuccess(true);
    addNotification({
      type: 'approved',
      title: status === 'published' ? 'Content Published Successfully' : 'Draft Saved Successfully',
      message: `"${title}" has been successfully added to Sawaflix.`
    });

    setYoutubeUrl('');
    setVideoFile(null);
    setTitle('');
    setGenre('');
    setRegion('National');
    setYoutubePreview(null);
    setSaving(false);
    
    if (onSaved) onSaved();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
          <FileVideo size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Upload Curated Content</h2>
          <p className="text-sm text-gray-400">Add YouTube links or upload native video files</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm flex items-start space-x-2">
          <Check className="shrink-0 mt-0.5" size={16} />
          <span>Content has been saved successfully!</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-start space-x-2">
          <span className="shrink-0 mt-0.5 font-bold">Error: </span>
          <span>{error}</span>
        </div>
      )}

      {/* Upload Type Toggle */}
      <div className="flex space-x-4 mb-8 bg-gray-950 p-2 rounded-xl">
        <button
          onClick={() => { setUploadType('youtube'); setError(null); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            uploadType === 'youtube' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Youtube size={18} />
          <span>YouTube Link</span>
        </button>
        <button
          onClick={() => { setUploadType('native'); setError(null); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            uploadType === 'native' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <UploadCloud size={18} />
          <span>Native Upload</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* URL or File Input based on mode */}
        {uploadType === 'youtube' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              1. YouTube URL <span className="text-red-500">*</span>
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
                {oembedLoading ? <Loader2 className="animate-spin" size={18} /> : <Youtube size={18} />}
              </div>
            </div>

            {/* Preview */}
            {youtubePreview && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-800 bg-[#1e1f22] max-w-lg shadow-2xl">
                 <div className="p-4 border-l-[4px] border-l-[#ff0000] flex flex-col gap-3">
                   <div>
                     <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[#00a8fc] hover:underline font-bold text-base block mb-1">
                       {youtubePreview.title}
                     </a>
                     <p className="text-xs text-gray-300">{youtubePreview.author_name}</p>
                   </div>
                   <img src={youtubePreview.thumbnail_url} alt="Thumbnail" className="w-full h-auto aspect-video object-cover rounded-lg" />
                 </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              1. Select Video File (MP4) <span className="text-red-500">*</span>
            </label>
            <div className="w-full bg-gray-950 border border-gray-800 border-dashed hover:border-red-500 rounded-xl px-4 py-8 text-center transition-all">
               <input
                 type="file"
                 accept="video/mp4,video/x-m4v,video/*"
                 onChange={handleFileChange}
                 className="hidden"
                 id="file-upload"
               />
               <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                 <UploadCloud size={32} className="text-gray-400 mb-3" />
                 <span className="text-white font-medium bg-gray-800 px-4 py-2 rounded-lg mb-2 hover:bg-gray-700">Browse Files</span>
                 <span className="text-sm text-gray-500">
                   {videoFile ? videoFile.name : 'No file selected yet'}
                 </span>
               </label>
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
                <span>{uploadType === 'native' ? 'Uploading...' : 'Saving...'}</span>
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
