'use client';

import React from 'react';
import { Play, Eye, Heart, Star } from 'lucide-react';
import Link from 'next/link';

const FeaturedCard = ({ featured }) => (
  <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-2xl hover:shadow-red-500/30 transition-all duration-300">
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-purple-600/20 to-pink-600/40" />
    
    {/* Overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col justify-between p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Featured Content</p>
          <h2 className="text-4xl font-black text-white mb-2 group-hover:text-red-500 transition-colors">{featured.title}</h2>
          <p className="text-gray-200 max-w-md">{featured.description}</p>
        </div>
        <div className="text-white/60 group-hover:text-red-500 transition-colors">
          <Star className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-red-500" />
            <span>{featured.views}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{featured.likes}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={featured.link}>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-xl shadow-red-600/50 group-hover:scale-105 w-fit">
            <Play className="w-4 h-4 fill-white" />
            Watch Now
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default function FeaturedSection() {
  const featured = {
    title: 'Featured Now',
    description: 'Explore the hottest trending content from around the world',
    views: '2.3M',
    likes: '156K',
    link: '/dashboard/musicPage'
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">What\'s Trending</h2>
        <p className="text-gray-400 font-medium">Don\'t miss out on the latest hits</p>
      </div>
      <FeaturedCard featured={featured} />
    </div>
  );
}
