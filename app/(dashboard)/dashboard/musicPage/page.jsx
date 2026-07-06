'use client';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useMusic } from '@/components/MusicContext';
import { Play, Pause, Search, ChevronDown, ArrowLeft, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import musicData from '@/Data.json';

// Available images to cycle through for cards
const cardImages = [
  '/music2.jpg',
  '/music3.jpg',
  '/music4.jpg',
  '/music5.jpg',
  '/music6.jpg',
  '/Magasco.jpg',
  '/afrobeats.jpg',
  '/Bikutsi.jpg',
  '/Makossa.png',
  '/Hip hop.jpg',
  '/Benylee.jpg',
  '/Gene.jpg',
  '/Greenlight.jpg',
  '/Musicals.jpeg',
  '/Assiko.jpeg',
];

// 1. Calculate genre frequency to identify "rare" genres
const genreCounts = {};
musicData.music_artists.forEach(artist => {
  artist.genre.forEach(g => {
    genreCounts[g] = (genreCounts[g] || 0) + artist.songs.length;
    // Weight by number of songs this artist has, 
    // or just +1 per artist? User said "less songs on that genre".
    // So counting total potential songs is better.
  });
});

// 2. Group songs by their "rarest" genre to balance the list
const songsByGenre = {};

musicData.music_artists.forEach((artist, artistIdx) => {
  // Find the rarest genre for this artist
  // We sort the artist's genres by their total GLOBAL count (asc)
  // and pick the first one.
  const bestGenre = [...artist.genre].sort((a, b) => {
    return (genreCounts[a] || 0) - (genreCounts[b] || 0);
  })[0] || 'Other';

  if (!songsByGenre[bestGenre]) songsByGenre[bestGenre] = [];

  artist.songs.forEach((song, songIdx) => {
    const songId = `${artist.name}-${songIdx}`;

    const songObj = {
      id: songId,
      title: song.title,
      artist: artist.name,
      genre: bestGenre, // Assigned to the rarest genre
      image: cardImages[(artistIdx * 10 + songIdx) % cardImages.length],
      src: song.url,
    };

    songsByGenre[bestGenre].push(songObj);
  });
});

// Re-create simple allSongs for the main grid (unique ID/song based)
const uniqueSongsForGrid = musicData.music_artists.flatMap((artist, artistIdx) =>
  artist.songs.map((song, songIdx) => ({
    id: `${artistIdx}-${songIdx}`,
    title: song.title,
    artist: artist.name,
    genre: artist.genre[0], // Primary genre for main grid
    image: cardImages[(artistIdx * 10 + songIdx) % cardImages.length],
    src: song.url,
  }))
);


// Extract unique genres for section tabs
const genres = [...new Set(musicData.music_artists.flatMap(a => a.genre))];

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function DraggableGenreSection({ genre, songs, isCurrentlyPlaying, currentTrack, togglePlay, handlePlay }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{genre}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Suggested Playlist
          </p>
        </div>
        <span className="text-xs text-red-500 font-medium">
          {songs.length} tracks
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {songs.map((song) => {
          const playing = isCurrentlyPlaying(song);
          // Check by src or title since IDs might differ in these generated lists
          const isActive = currentTrack?.src === song.src;

          return (
            <div
              key={song.id + genre} // unique key for this context
              onClick={(e) => {
                // Prevent click if recently dragging? 
                // Simple drag detection: if mouse didn't move much. 
                // For now, let's assume standard click works.
                if (isActive) {
                  togglePlay();
                } else {
                  handlePlay(song);
                }
              }}
              className="flex-none w-36 group relative"
            >
              <div className="relative w-36 h-36 rounded-xl overflow-hidden mb-2 shadow-md shadow-black/20 transform transition-transform duration-300 group-hover:scale-105">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full h-full object-cover pointer-events-none" // prevent img drag ghost
                />

                {/* Hover Play Button */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-3 transition-opacity ${playing
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase shadow-md transition-all ${playing
                      ? 'bg-red-600 text-white'
                      : 'bg-white/90 text-gray-900'
                      }`}
                  >
                    <Headphones size={11} />
                    {playing ? 'Playing' : 'Listen'}
                  </span>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </div>
              <p
                className={`text-sm font-medium truncate ${isActive ? 'text-red-400' : 'group-hover:text-red-400'
                  } transition-colors`}
              >
                {song.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {song.artist}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MusicPage() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [shuffledSongs, setShuffledSongs] = useState([]);

  // Shuffle songs on mount to reduce repetition
  useEffect(() => {
    const shuffled = [...uniqueSongsForGrid].sort(() => 0.5 - Math.random());
    setShuffledSongs(shuffled);
  }, []);

  // Filter for the main grid
  const filteredSongs = useMemo(() => {
    // If no search and no specific genre, use the shuffled list (or unique if shuffle not ready)
    let baseList = (searchQuery === '' && selectedGenre === 'All' && shuffledSongs.length > 0)
      ? shuffledSongs
      : uniqueSongsForGrid;

    let songs = baseList;

    if (selectedGenre !== 'All') {
      songs = songs.filter(s => s.genre === selectedGenre);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      songs = songs.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q)
      );
    }

    return songs;
  }, [searchQuery, selectedGenre, shuffledSongs]);

  const songsToShow = filteredSongs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSongs.length;

  const handlePlay = (song) => {
    // Play with context of where it was clicked
    playTrack(song, uniqueSongsForGrid);
  };

  const isCurrentlyPlaying = (song) => {
    // Robust check using src
    return currentTrack?.src === song.src && isPlaying;
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_COUNT);
  };

  // Reset visible count when filter changes
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="min-h-full text-white pb-32">
      {/* Header */}
      <div className="mb-8">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Discover the rhythmic soul of Cameroonian music
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Cameroonian songs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(INITIAL_COUNT);
            }}
            className="w-full bg-[#1a2744] border border-gray-700/50 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/30 transition-all"
          />
        </div>
      </div>

      {/* Genre Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => handleGenreChange('All')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedGenre === 'All'
            ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
            : 'bg-[#1a2744] text-gray-400 hover:text-white hover:bg-[#243352]'
            }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedGenre === genre
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
              : 'bg-[#1a2744] text-gray-400 hover:text-white hover:bg-[#243352]'
              }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500 mb-4">
        {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} found
      </p>

      {/* Song Card Grid - MAIN RESULTS */}
      {songsToShow.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {songsToShow.map((song) => {
            const playing = isCurrentlyPlaying(song);
            const isActive = currentTrack?.src === song.src;

            return (
              <div
                key={song.id}
                onClick={() => {
                  if (isActive) {
                    togglePlay();
                  } else {
                    handlePlay(song);
                  }
                }}
                className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isActive ? 'scale-[1.02]' : ''
                  }`}
              >
                {/* Card Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg shadow-black/30">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Listen Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${playing
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                      }`}
                  >
                    <span
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-lg transition-all duration-300 ${playing
                        ? 'bg-red-600 text-white'
                        : 'bg-white/90 text-gray-900 group-hover:bg-white'
                        }`}
                    >
                      <Headphones size={13} />
                      {playing ? 'Playing' : 'Listen'}
                    </span>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />
                  )}

                  {/* Colored bottom border accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${isActive
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-red-600/60 via-green-500/40 to-red-600/60 opacity-0 group-hover:opacity-100'
                      }`}
                  />
                </div>

                {/* Card Info */}
                <h3
                  className={`font-semibold text-sm truncate transition-colors ${isActive
                    ? 'text-red-400'
                    : 'text-white group-hover:text-red-400'
                    }`}
                >
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {song.artist}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No songs found</p>
          <p className="text-gray-600 text-sm mt-1">
            Try a different search or genre
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-red-600/25 active:scale-95"
          >
            Load More
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* GENRE Sections (Draggable) */}
      <div className="mt-16 space-y-12">
        {Object.entries(songsByGenre).map(([genre, songs]) => (
          <DraggableGenreSection
            key={genre}
            genre={genre}
            songs={songs}
            isCurrentlyPlaying={isCurrentlyPlaying}
            currentTrack={currentTrack}
            togglePlay={togglePlay}
            handlePlay={handlePlay}
          />
        ))}
      </div>
    </div>
  );
}