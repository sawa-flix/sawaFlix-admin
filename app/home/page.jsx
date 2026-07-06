'use client'
import React, { useState } from 'react';
import { Play, Star } from 'lucide-react';

const SawaFlix = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample data
  const trendingContent = [
    { id: 1, title: "ARCADIAN", type: "movie", rating: 8.5, image: "/api/placeholder/300/400", genre: "Sci-Fi" },
    { id: 2, title: "Lunar Hits", type: "music", rating: 9.2, image: "/api/placeholder/300/400", genre: "Electronic" },
    { id: 3, title: "Dune: Part Two", type: "movie", rating: 9.1, image: "/api/placeholder/300/400", genre: "Action" },
    { id: 4, title: "Midnight Jazz", type: "music", rating: 8.8, image: "/api/placeholder/300/400", genre: "Jazz" },
    { id: 5, title: "Avatar 3", type: "movie", rating: 9.3, image: "/api/placeholder/300/400", genre: "Adventure" },
    { id: 6, title: "Summer Beats", type: "music", rating: 8.7, image: "/api/placeholder/300/400", genre: "Pop" }
  ];

  const movieRecommendations = [
    { id: 1, title: "The Ultimatum 4", rating: 4.5, image: "/api/placeholder/200/300", year: "2024" },
    { id: 2, title: "Black Panther", rating: 4.8, image: "/api/placeholder/200/300", year: "2023" },
    { id: 3, title: "Action Movie", rating: 4.2, image: "/api/placeholder/200/300", year: "2024" },
    { id: 4, title: "Thriller Movie", rating: 4.6, image: "/api/placeholder/200/300", year: "2024" }
  ];

  const musicRecommendations = [
    { id: 1, title: "Hit Songs 2024", artist: "Various Artists", image: "/api/placeholder/200/200", plays: "1.2M" },
    { id: 2, title: "Midnight Vibes", artist: "DJ Shadow", image: "/api/placeholder/200/200", plays: "890K" },
    { id: 3, title: "Pop Classics", artist: "Top Artists", image: "/api/placeholder/200/200", plays: "2.1M" },
    { id: 4, title: "Rock Anthems", artist: "Rock Legends", image: "/api/placeholder/200/200", plays: "1.5M" }
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
    <div className="relative h-64 sm:h-80 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849323-2429c9b59ec8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4">
            Sawa<span className="text-red-500">Flix</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl">
            The Ultimate Music And Movies Experience
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold transition-colors duration-200 cursor-pointer">
              Watch Now
            </button>
            <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black active:bg-gray-200 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold transition-all duration-200 cursor-pointer">
              Listen Now
            </button>
          </div>
        </div>
      </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
