'use client';
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, RefreshCw, VolumeX } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// Helper to ensure YouTube URLs are detected correctly
const normalizeUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/watch?v=${id}`;
  }
  return url;
};

// Format time helper
const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    playerRef,
    currentTime,
    duration,
    setDuration,
    setCurrentTime,
    volume,
    setVolume,
    muted,
    toggleMute,
    seekTo
  } = useMusic();

  // If no track is loaded, don't render the player
  if (!currentTrack) return null;

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f1729]/95 backdrop-blur-md border-t border-gray-800 text-white px-4 py-3 z-50 transition-all duration-300">
      {/* Hidden React Player */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={normalizeUrl(currentTrack.src)}
          playing={isPlaying}
          volume={volume}
          muted={muted}
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
          onDuration={(d) => setDuration(d)}
          onEnded={playNext}
          width="0"
          height="0"
          config={{
            youtube: {
              playerVars: { showinfo: 0, controls: 0, autoplay: 1 }
            },
            file: {
              errorMessage: 'Error playing file'
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-800 flex-shrink-0 shadow-lg">
            {currentTrack.image ? (
              <img
                src={currentTrack.image}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-xs text-gray-400">No Img</span>
              </div>
            )}
          </div>
          <div className="overflow-hidden min-w-0">
            <h3 className="font-semibold text-sm truncate hover:underline cursor-pointer text-white">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-gray-400 truncate hover:text-white cursor-pointer transition-colors block">
              {currentTrack.artist}
            </p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0">
            <Heart size={18} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4 max-w-xl px-4">
          <div className="flex items-center gap-6 mb-1">
            <button className="text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={16} />
            </button>
            <button
              onClick={playPrev}
              className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/20"
            >
              {isPlaying ? (
                <Pause size={24} fill="black" />
              ) : (
                <Play size={24} fill="black" className="ml-1" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <span className="text-xs border border-currentColor rounded px-1">HD</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full text-xs text-gray-400 font-medium">
            <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all accent-red-600 focus:outline-none focus:ring-0"
            />
            <span className="w-10 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-0">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white flex-shrink-0">
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all accent-red-600 focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}
