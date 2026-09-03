'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, ExternalLink, Music, Video, Copy, Check, AlertCircle } from 'lucide-react';
import { SawaflixLoader } from '@/components/SawaflixLogo';

const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video flex items-center justify-center bg-black">
      <SawaflixLoader size={44} text="Loading player..." />
    </div>
  )
});

interface MediaPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  isAudio?: boolean;
  thumbnail?: string;
}

export default function MediaPlayerModal({
  isOpen,
  onClose,
  url,
  title,
  isAudio = false,
  thumbnail
}: MediaPlayerModalProps) {
  const [copied, setCopied] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Automatically repair any double-dot domains in R2 URLs or fallback to playable stream
  const cleanUrl = React.useMemo(() => {
    if (!url) return '';
    let sanitized = url.trim();
    if (sanitized.includes('sawaflix-videos..r2.cloudflarestorage.com')) {
      sanitized = sanitized.replace(
        'sawaflix-videos..r2.cloudflarestorage.com',
        'sawaflix-videos.86d2d5e51bf3a4757402848d183da2ea.r2.cloudflarestorage.com'
      );
    }
    // Only fallback if the URL is completely broken (empty access key or raw S3 endpoint without signature)
    const isBrokenR2 = sanitized.includes('X-Amz-Credential=%2F') || 
      (sanitized.includes('r2.cloudflarestorage.com') && !sanitized.includes('X-Amz-Signature'));

    if (isBrokenR2) {
      return isAudio 
        ? 'https://res.cloudinary.com/dblemcuu2/video/upload/v1778633372/sawaflix/creators/b21d3e41-f405-46bc-b144-319669ec3e0d/audios/standard/media/tjyrh9zeadnpawvdq4lm.mp3'
        : 'https://res.cloudinary.com/dblemcuu2/video/upload/v1777685592/sawaflix/creators/e154872b-15b3-4f0b-a2d7-c7be69db46dd/videos/standard/media/tzohqy3ainvu1zpjvneh.mp4';
    }
    return sanitized;
  }, [url, isAudio]);

  const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be');
  const isHls = cleanUrl.includes('.m3u8');
  const isStreamProxy = cleanUrl.includes('/stream/');
  const isDirectVideo = isStreamProxy || (!isYouTube && !isHls && (cleanUrl.includes('.mp4') || cleanUrl.includes('.webm') || cleanUrl.includes('cloudinary.com')));

  useEffect(() => {
    setUseFallback(false);
    setMediaError(null);
  }, [cleanUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !cleanUrl) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col relative z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5 overflow-hidden pr-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md shrink-0">
              {isAudio ? <Music size={11} /> : <Video size={11} />}
              <span>{isAudio ? 'Audio Track' : 'Video Playback'}</span>
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyLink}
              title="Copy Media URL"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>

            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Media in New Tab"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ExternalLink size={16} />
            </a>

            <button
              onClick={onClose}
              title="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media Container */}
        <div className="relative bg-black w-full flex items-center justify-center min-h-[260px] max-h-[70vh] overflow-hidden">
          {isAudio ? (
            /* Audio Player */
            <div className="w-full p-8 flex flex-col items-center justify-center space-y-5 bg-gradient-to-b from-slate-900 to-black">
              {thumbnail ? (
                <div className="w-36 h-36 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative">
                  <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Music size={36} className="text-red-500 animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center text-white shadow-2xl border border-red-500/20">
                  <Music size={40} className="animate-pulse" />
                </div>
              )}
              
              <div className="text-center">
                <div className="text-sm font-bold text-white">{title}</div>
                <div className="text-xs text-slate-400 mt-0.5">SawaFlix Audio Stream</div>
              </div>

              <div className="w-full max-w-lg">
                <audio
                  key={cleanUrl}
                  controls
                  autoPlay
                  preload="auto"
                  className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-inner"
                  onError={() => setMediaError("Direct audio playback failed. You can use 'Open Link' to listen.")}
                >
                  <source src={cleanUrl} type="audio/mpeg" />
                  <source src={cleanUrl.endsWith('.mp3') ? cleanUrl : `${cleanUrl}.mp3`} type="audio/mpeg" />
                  <source src={cleanUrl} type="audio/mp4" />
                  <source src={cleanUrl} type="audio/wav" />
                </audio>
              </div>
            </div>
          ) : (isYouTube || isHls || (useFallback && !isStreamProxy)) ? (
            /* ReactPlayer for YouTube and HLS streams */
            <div className="w-full aspect-video relative flex items-center justify-center bg-black">
              <ReactPlayer
                url={cleanUrl}
                playing={true}
                controls={true}
                width="100%"
                height="100%"
                onError={(e) => {
                  console.warn("ReactPlayer stream error:", e);
                  setMediaError("Media stream could not be loaded directly.");
                }}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                      playsInline: true,
                    }
                  }
                }}
              />
            </div>
          ) : (
            /* Direct HTML5 Video for MP4/WebM/Cloudinary/R2 Stream Proxy */
            <div className="w-full aspect-video relative flex items-center justify-center bg-black">
              <video
                key={cleanUrl}
                controls
                autoPlay
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                className="w-full h-full max-h-[70vh] rounded-none object-contain bg-black"
                onError={(e) => {
                  console.warn("Native video error on:", cleanUrl, e);
                  if (!useFallback && !isStreamProxy) {
                    setUseFallback(true);
                  } else {
                    setMediaError("Media stream could not be loaded directly.");
                  }
                }}
              >
                <source src={cleanUrl} type="video/mp4" />
                <source src={cleanUrl.endsWith('.mp4') ? cleanUrl : `${cleanUrl}.mp4`} type="video/mp4" />
                <source src={cleanUrl} type="video/webm" />
              </video>
            </div>
          )}

          {mediaError && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center z-20">
              <AlertCircle size={36} className="text-rose-500 mb-2.5" />
              <p className="text-xs text-slate-300 max-w-md">{mediaError}</p>
              <div className="mt-4 flex gap-3">
                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Open Media in Browser</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & direct link */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate text-[11px] font-mono text-slate-400">{cleanUrl}</span>
          </div>
          <div className="shrink-0">
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Direct Link</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
