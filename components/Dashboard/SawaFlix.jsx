'use client'
import React, { useState } from 'react';
import { Play, Star } from 'lucide-react';
import Link from 'next/link';

const SawaFlix = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample data
  const trendingContent = [
    { id: 1, title: "ARCADIAN", type: "movie", rating: 8.5, image: "/0.jpg", genre: "Sci-Fi" },
    { id: 2, title: "Lunar Hits", type: "music", rating: 9.2, image: "/1.jpg", genre: "Electronic" },
    { id: 3, title: "Dune: Part Two", type: "movie", rating: 9.1, image: "/10.jpg", genre: "Action" },
    { id: 4, title: "Midnight Jazz", type: "music", rating: 8.8, image: "/6.jpg", genre: "Jazz" },
    { id: 5, title: "Avatar 3", type: "movie", rating: 9.3, image: "/3.jpg", genre: "Adventure" },
    { id: 6, title: "Summer Beats", type: "music", rating: 8.7, image: "/5.jpg", genre: "Pop" }
  ];

  const movieRecommendations = [
    { id: 1, title: "The Ultimatum 4", rating: 4.5, image: "/movie.jpg", year: "2024" },
    { id: 2, title: "Black Panther", rating: 4.8, image: "/movfy3.jpg", year: "2023" },
    { id: 3, title: "Action Movie", rating: 4.2, image: "/vid.jpg", year: "2024" },
    { id: 4, title: "Thriller Movie", rating: 4.6, image: "/wed-image 1.jpg", year: "2024" }
  ];

  const musicRecommendations = [
    { id: 1, title: "Hit Songs 2024", artist: "Various Artists", image: "/r1.jpg", plays: "1.2M" },
    { id: 2, title: "Midnight Vibes", artist: "DJ Shadow", image: "/r2.jpg", plays: "890K" },
    { id: 3, title: "Pop Classics", artist: "Top Artists", image: "/pic1.jpg", plays: "2.1M" },
    { id: 4, title: "Rock Anthems", artist: "Rock Legends", image: "/r4.jpg", plays: "1.5M" }
  ];

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  const ContentCard = ({ item, type }) => (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="relative">
        <img src={item.image} alt={item.title} className="w-full h-48 sm:h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 cursor-pointer">
          <Play size={20} className="text-white fill-current" />
        </button>
        <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1">
          <div className="flex items-center text-yellow-400 text-sm">
            <Star size={14} className="mr-1 fill-current" />
            <span>{type === 'movie' ? item.rating : '★★★★★'}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm sm:text-base mb-1 truncate">{item.title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm">
          {type === 'movie' ? `${item.year || '2024'} • ${item.genre || 'Movie'}` : `${item.artist} • ${item.plays || 'Music'}`}
        </p>
      </div>
    </div>
  );

  const HeroSection = () => (
    <div className="relative h-72 sm:h-80 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden mb-8 group">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: "url('https://i.ibb.co/N2c9XWpL/Fang-beti-Slider.jpg')" }}
      />
      {/* Multi-layer dark overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      
      {/* Decorative gradient accent */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
      
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6">
        <div className="drop-shadow-2xl w-full max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg whitespace-nowrap">
            Sawa<span className="text-red-500">Flix</span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-2xl text-gray-100 mb-6 sm:mb-8 font-light drop-shadow-md px-2">
            The Ultimate Music And Movies Experience
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard/youtubeVids">
              <button className="group/btn relative bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 px-8 sm:px-10 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-500/50 hover:-translate-y-1 active:scale-95">
                ▶ Play Now
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Animated corner accent */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-red-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
    </div>
  );

  return (
    // Added overflow-x-hidden here to remove horizontal scrollbar
    <div className="min-h-screen bg-gray-900 flex flex-col overflow-x-hidden">
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6">
        <HeroSection />

        {/* Trending Now */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <span className="w-1 h-8 bg-red-600 mr-3 rounded-full"></span>
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingContent.map((item) => (
              <ContentCard key={item.id} item={item} type={item.type} />
            ))}
          </div>
        </section>

        {/* Movies For You */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <span className="w-1 h-8 bg-blue-600 mr-3 rounded-full"></span>
              Movies For You
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-4 sm:gap-6">
            {movieRecommendations.map((movie) => (
              <ContentCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </section>

        {/* Music For You */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <span className="w-1 h-8 bg-purple-600 mr-3 rounded-full"></span>
              Music For You
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-6 sm:gap-6">
            {musicRecommendations.map((music) => (
              <ContentCard key={music.id} item={music} type="music" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SawaFlix;
