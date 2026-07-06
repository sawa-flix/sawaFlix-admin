'use client';
import React from 'react';
import Image from 'next/image';

const RightSidebar = () => {
  const trendingMusic = {
    title: 'Top Trending Music of the Week',
    image: 'https://i.ibb.co/HTg91sqB/Whats-App-Image-2026-03-19-at-7-26-55-AM.jpg',
    likes: 2300,
    views: 5400,
    comments: 120,
  };

  const aiRecommendations = [
    { id: 1, title: 'AI Mix 1', image: '/music1.jpg' },
    { id: 2, title: 'AI Mix 2', image: '/music2.jpg' },
    { id: 3, title: 'AI Mix 3', image: '/music3.jpg' },
    { id: 4, title: 'AI Mix 4', image: '/music4.jpg' },
    { id: 5, title: 'AI Mix 5', image: '/music5.jpg' },
    { id: 6, title: 'AI Mix 6', image: '/music6.jpg' },
  ];

  return (
    <div className="w-full h-full p-6 flex flex-col space-y-6 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-y-auto scrollbar-none border-l border-white/5">
      {/* Trending Music Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-all duration-300 group">
        <h2 className="text-lg font-bold mb-4 text-white">
          {trendingMusic.title}
        </h2>
        <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-inner">
          <Image
            src={trendingMusic.image}
            alt="Trending Music"
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-300">
          <button className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold text-white text-sm\">
            <span>❤️</span>
            <span>{trendingMusic.likes.toLocaleString()}</span>
          </button>
          <span className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg\">
            <span>👁</span>
            <span>{trendingMusic.views.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg\">
            <span>💬</span>
            <span>{trendingMusic.comments}</span>
          </span>
        </div>
        <button className="mt-4 w-full px-4 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-white/100 transition-all duration-200\">
          ➕ Follow Artist
        </button>
      </div>

      {/* AI Recommended Versions */}
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-4 text-yellow-600\">
          AI Recommended Versions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:bg-white/8 transition-all duration-300 cursor-pointer group\"
            >
              <div className="relative w-full h-24">
                <Image
                  src={rec.image}
                  alt={rec.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-xs text-center p-3 text-gray-200 font-medium group-hover:text-white transition-colors">
                {rec.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/8 transition-all duration-300">
        <h3 className="text-md font-bold mb-3 text-white">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
            🎵 Create Playlist
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
            📥 Import Music
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
            🔄 Shuffle All
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
