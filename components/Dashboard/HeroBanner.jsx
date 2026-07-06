'use client';

import React from 'react';
import { PlayCircle, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-12 group">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-purple-600/60 to-pink-600/50 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 400">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1200" height="400" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-12 py-16 md:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">Welcome to SawaFlix</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Your Gateway to <span className="text-yellow-300">Global Culture</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-xl">
            Discover trending music, blockbuster movies, and inspiring stories from creators around the world.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/dashboard/musicPage">
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-black rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 uppercase tracking-wider text-sm">
                <PlayCircle className="w-5 h-5" />
                Explore Now
              </button>
            </Link>

            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 uppercase tracking-wider text-sm">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-yellow-300">10K+</div>
              <div className="text-white/80 text-sm">Creators</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-yellow-300">50M+</div>
              <div className="text-white/80 text-sm">Views Monthly</div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-300" />
              <div className="text-white/80 text-sm">Growing Community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
