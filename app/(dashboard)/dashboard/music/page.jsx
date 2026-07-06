// @ts-check
'use client';

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, RotateCcw, Volume2, Download, Shuffle, Repeat } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import musicData from '@/Data.json';

const placeholderImages = [
  "/music4.jpg",
  "/music2.jpg",
  "/music3.jpg",
  "/pic4.jpeg",
  "/music5.jpg",
  "/music6.jpg"
];

export default function MusicPage() {
  const {
    currentTrack: globalTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    playTrack,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume
  } = useMusic();

  // Local UI state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');

  // Fallback data if nothing is playing
  const defaultTrack = {
    id: 0,
    title: "Select a Song",
    artist: "Sawaflix Music",
    image: "/music4.jpg",
    src: "",
  };

  const currentTrack = globalTrack || defaultTrack;

  const handleSeek = (e) => {
    if (!duration) return;
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    seekTo(newTime);
  };

  const handleReplay = () => {
    seekTo(0);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    setRepeatMode(prev => modes[(modes.indexOf(prev) + 1) % modes.length]);
  };

  const handleDownload = () => {
    if (!currentTrack.src) return;
    // For YouTube links, direct download isn't simple without a backend service.
    // We'll just open the link for now or disable if it's a stream.
    window.open(currentTrack.src, '_blank');
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate a list for "Trending Now" / "Recently Played" based on Data.json
  const displayList = musicData.music_artists.flatMap((artist, artistIdx) =>
    artist.songs.map((song, songIdx) => ({
      id: `${artistIdx}-${songIdx}`, // Consistent ID format with other pages
      title: song.title,
      artist: artist.name,
      image: placeholderImages[(artistIdx + songIdx) % placeholderImages.length],
      src: song.url,
      plays: "New",
      trending: "new",
      rank: 0,
      duration: "3:00"
    }))
  );

  const popularAlbums = displayList.slice(0, 3);
  const recentlyPlayed = displayList.slice(3, 9);

  return (
    // General container with mobile-first padding
    <div className="min-h-full bg-gray-900 text-white p-2 xs:p-3 sm:p-6 lg:p-8 pb-32">
      {/* Visualizer bars logic for background or header? Keeping separate */}

      {/* Header section with responsive layout */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-0.5 xs:mb-1 sm:mb-2 truncate">Music</h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-400 truncate">Discover and enjoy your favorite tracks</p>
          </div>
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 xs:p-2 rounded-lg transition-colors ${isShuffled ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              title="Shuffle"
            >
              <Shuffle size={16} className="xs:w-5 xs:h-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`relative p-1.5 xs:p-2 rounded-lg transition-colors ${repeatMode !== 'off' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={16} className="xs:w-5 xs:h-5" />
              {repeatMode === 'one' && <span className="absolute -top-1 -right-1 xs:top-0 xs:right-0 text-xs font-bold">1</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">

          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 mb-4 sm:mb-8 border border-red-800/20">
            <div className="flex flex-col md:flex-row items-center gap-3 xs:gap-4 sm:gap-6">

              <div className="relative w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
                <div
                  className="w-full h-full bg-gray-700 rounded-lg xs:rounded-xl shadow-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentTrack.image})` }}
                />
              </div>

              {/* Track Info & Controls */}
              <div className="flex-1 text-center md:text-left w-full min-w-0">
                <p className="text-orange-400 text-xs xs:text-sm sm:text-base mb-0.5 xs:mb-1 font-medium">Now Playing</p>
                <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold mb-0.5 xs:mb-1 sm:mb-2 truncate">{currentTrack.title}</h2>
                <p className="text-xs xs:text-sm sm:text-lg text-gray-300 mb-2 xs:mb-3 sm:mb-6 truncate">{currentTrack.artist}</p>

                {/* Control buttons with a more responsive gap */}
                <div className="flex items-center justify-center md:justify-start gap-1.5 xs:gap-2 sm:gap-4 mb-3 xs:mb-4 sm:mb-6">
                  <button onClick={handleReplay} className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors" title="Replay">
                    <RotateCcw size={16} className="xs:w-5 xs:h-5" />
                  </button>
                  <button onClick={playPrev} className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors" title="Previous">
                    <SkipBack size={16} className="xs:w-5 xs:h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-white text-black rounded-full p-2 xs:p-2.5 sm:p-3 hover:bg-gray-200 transition-colors shadow-lg"
                  >
                    {isPlaying ? <Pause size={20} className="xs:w-6 xs:h-6" /> : <Play size={20} className="xs:w-6 xs:h-6" />}
                  </button>
                  <button onClick={playNext} className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors" title="Next">
                    <SkipForward size={16} className="xs:w-5 xs:h-5" />
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-white'
                      }`}
                  >
                    <Heart size={16} className="xs:w-5 xs:h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors hidden xs:block"
                    title="Open on YouTube"
                  >
                    <Download size={16} className="xs:w-5 xs:h-5" />
                  </button>
                </div>

                {/* Progress bar and volume controls */}
                <div className="max-w-xl w-full mx-auto md:mx-0">
                  <div className="flex items-center gap-1.5 xs:gap-2 mb-2 xs:mb-3">
                    <span className="text-xs text-gray-300 w-6 xs:w-8 text-right">{formatTime(currentTime)}</span>
                    <div
                      className="flex-1 bg-gray-700 rounded-full h-1 xs:h-1.5 cursor-pointer group"
                      onClick={handleSeek}
                    >
                      <div
                        className="bg-orange-500 h-full rounded-full relative transition-all duration-100"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 xs:w-3 xs:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 w-6 xs:w-8 text-left">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 xs:gap-2">
                    <Volume2 size={14} className="xs:w-4 xs:h-4" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-0.5 xs:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visualizer bars */}
            <div className="flex items-end justify-center gap-0.5 xs:gap-1 h-8 xs:h-10 sm:h-16 mt-3 xs:mt-4 sm:mt-6 overflow-hidden">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-all duration-300 ${isPlaying ? 'bg-orange-500' : 'bg-gray-600'}`}
                  style={{
                    width: '2px',
                    height: isPlaying ? `${Math.random() * 20 + 8}px` : '8px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Trending Now section */}
          <div className="mb-4 sm:mb-8">
            <div className="flex justify-between items-center mb-3 xs:mb-4">
              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold">Trending Now</h3>
              <button className="text-orange-500 hover:text-orange-400 transition-colors text-xs xs:text-sm sm:text-base">See All →</button>
            </div>
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              {popularAlbums.map((album, index) => (
                <div key={album.id} onClick={() => playTrack(album)} className="flex items-center gap-2 xs:gap-3 sm:gap-4 p-2 xs:p-3 sm:p-4 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 w-8 xs:w-10 sm:w-16 flex-shrink-0">
                    <span className={`text-xs xs:text-sm sm:text-lg font-bold ${album.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {album.rank}
                    </span>
                    <span className={`text-xs xs:text-sm ${album.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {album.trending === 'up' ? '▲' : '▼'}
                    </span>
                  </div>
                  <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 flex-shrink-0">
                    <div
                      className="w-full h-full bg-gray-700 rounded-md xs:rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${album.image})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate text-xs xs:text-sm sm:text-base group-hover:text-orange-400 transition-colors">{album.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">{album.artist}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-300">{album.plays} plays</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0">
                    {isPlaying && globalTrack?.id === album.id ? <Pause size={14} className="xs:w-4 xs:h-4" /> : <Play size={14} className="xs:w-4 xs:h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column for smaller screens */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6 lg:space-y-8">
          {/* Recently Played section */}
          <div>
            <h3 className="text-lg xs:text-xl font-bold mb-2 xs:mb-3">Recently Played</h3>
            <div className="space-y-2 xs:space-y-3">
              {recentlyPlayed.map((track, index) => (
                <div key={track.id} onClick={() => playTrack(track)} className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
                  <div className="relative w-8 h-8 xs:w-10 xs:h-10 flex-shrink-0">
                    <div
                      className="w-full h-full bg-gray-700 rounded-md xs:rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${track.image})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-xs xs:text-sm group-hover:text-orange-400 transition-colors">{track.title}</p>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1.5 xs:gap-2 text-xs text-gray-500 flex-shrink-0">
                    <span className="hidden xs:inline">{track.duration}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all">
                      {isPlaying && globalTrack?.id === track.id ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 xs:p-4">
            <h3 className="font-semibold mb-2 xs:mb-3 text-sm xs:text-base">Your Stats</h3>
            <div className="space-y-2 xs:space-y-3">
              <div className="flex justify-between text-xs xs:text-sm"><span className="text-gray-400">Songs played</span><span className="font-semibold">1,247</span></div>
              <div className="flex justify-between text-xs xs:text-sm"><span className="text-gray-400">Hours listened</span><span className="font-semibold">83.2h</span></div>
              <div className="flex justify-between text-xs xs:text-sm"><span className="text-gray-400">Favorite genre</span><span className="font-semibold text-orange-400">Afrobeat</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
