'use client';

import React, { useState, useEffect } from 'react';
import { Play, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ReelCard = ({ reel, index }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
    {/* Image Container */}
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Placeholder with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-purple-600/20 to-pink-600/20" />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Trending Badge */}
      {index < 3 && (
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
          <TrendingUp className="w-3 h-3" />
          Trending
        </div>
      )}

      {/* Duration Badge */}
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">
        2:45
      </div>
    </div>

    {/* Content */}
    <div className="p-4 space-y-3">
      <div>
        <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
          Reel Title {index + 1}
        </h3>
        <p className="text-gray-400 text-xs mt-1">Creator Name • 2.3M views</p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-gray-400 text-xs border-t border-white/5 pt-3">
        <button className="flex items-center gap-1 hover:text-red-500 transition-colors group/btn">
          <Heart className="w-4 h-4 group-hover/btn:fill-red-500" />
          <span className="group-hover/btn:text-red-500">1.2K</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors group/btn">
          <MessageCircle className="w-4 h-4" />
          <span>234</span>
        </button>
        <button className="flex items-center gap-1 hover:text-green-500 transition-colors group/btn">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default function ReelsSection() {
  const [reels, setReels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Generate mock reels data
    const mockReels = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Reel Title ${i + 1}`,
      creator: 'Creator Name',
      views: Math.floor(Math.random() * 10000000),
      likes: Math.floor(Math.random() * 100000),
      category: ['music', 'movie', 'blog'][i % 3],
      image: `/reel${(i % 6) + 1}.jpg`,
    }));
    setReels(mockReels);
  }, []);

  const categories = [
    { id: 'all', label: 'All Reels' },
    { id: 'music', label: '🎵 Music' },
    { id: 'movie', label: '🎬 Movies' },
    { id: 'blog', label: '📖 Blogs' },
  ];

  const filteredReels = activeCategory === 'all' 
    ? reels 
    : reels.filter(reel => reel.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Discover Reels</h2>
        <p className="text-gray-400 font-medium">Trending content from your favorite creators</p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredReels.map((reel, index) => (
          <ReelCard key={reel.id} reel={reel} index={index} />
        ))}
      </div>

      {/* View More */}
      <div className="flex justify-center pt-6">
        <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full border border-white/10 transition-all hover:border-red-600/50 hover:text-red-500">
          Load More Reels
        </button>
      </div>
    </div>
  );
}
