'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const RecommendationCard = ({ rec, index }) => (
  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
    {/* Image Placeholder */}
    <div className={`h-40 bg-gradient-to-br ${rec.gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
    </div>

    {/* Content */}
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">{rec.type}</p>
          <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-red-500 transition-colors">{rec.title}</h3>
        </div>
        <div className="text-white/40 group-hover:text-red-500 transition-colors">
          {index + 1}
        </div>
      </div>
      
      <p className="text-gray-400 text-xs line-clamp-2">{rec.description}</p>

      <Link href={rec.link}>
        <button className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
          Explore
          <ArrowRight className="w-3 h-3" />
        </button>
      </Link>
    </div>
  </div>
);

export default function RecommendationSection() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const mockRecs = [
      {
        title: 'Afrobeats Collection',
        description: 'Latest hits from African artists',
        type: 'Music',
        link: '/dashboard/musicPage',
        gradient: 'from-purple-600 to-pink-600'
      },
      {
        title: 'New Releases',
        description: 'Fresh movies just dropped',
        type: 'Movie',
        link: '/dashboard/movie',
        gradient: 'from-blue-600 to-cyan-600'
      },
      {
        title: 'Artist Stories',
        description: 'Behind the scenes tales',
        type: 'Blog',
        link: '/dashboard/blogs',
        gradient: 'from-orange-600 to-red-600'
      },
      {
        title: 'Cultural Vibes',
        description: 'Celebrating traditions',
        type: 'Music',
        link: '/dashboard/musicPage',
        gradient: 'from-green-600 to-emerald-600'
      },
    ];
    setRecommendations(mockRecs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2 className="text-3xl font-black text-white">Recommended For You</h2>
          </div>
          <p className="text-gray-400 font-medium">Personalized picks based on your interests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} rec={rec} index={index} />
        ))}
      </div>
    </div>
  );
}
