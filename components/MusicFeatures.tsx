'use client';

import React, { useState } from 'react';
import { Heart, MoreHorizontal, Play } from 'lucide-react';
import Image from 'next/image';

// Type definitions (or import from a shared file)
type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
};
type Playlist = {
  id: number;
  name: string;
  songs: number;
  cover: string;
};

type MusicFeaturesProps = {
  playlists: Playlist[]; // Define a proper type later
  recommendedSongs: Song[];
  favoriteSongs: Song[];
};

export function MusicFeatures({ playlists, recommendedSongs, favoriteSongs }: MusicFeaturesProps) {
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (songId: number) => {
    setLiked((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  return (
    <>
      {/* Playlists Section */}
      <div className="bg-gray-800 bg-opacity-10 rounded-lg shadow-sm p-6 mb-8 translate-y-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-red-500">Playlists</h3>
          <button className="text-purple-600 hover:text-purple-700 font-medium">View all</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group cursor-pointer">
              <div className="relative mb-3 rounded-lg overflow-hidden">
                <Image src={playlist.cover} alt={playlist.name} width={300} height={300} className="object-cover w-full aspect-square" />
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/30 transition-all duration-200 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h4 className="font-medium text-white mb-1">{playlist.name}</h4>
              <p className="text-sm text-gray-300">{playlist.songs} songs</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Songs Section */}
      <div className="bg-blue-800 bg-opacity-10 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-red-500">Recommended Songs</h3>
          <button className="text-purple-600 hover:text-purple-700 font-medium">View all</button>
        </div>
        <div className="space-y-4 mb-8">
          {recommendedSongs.map((song) => (
            <div key={song.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-500/20 cursor-pointer group transition-colors">
              <Image src={song.cover} alt={song.title} width={60} height={60} className="rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{song.title}</h4>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{song.duration}</span>
                <button onClick={() => toggleLike(song.id)} className="p-2 transition-colors">
                  <Heart className={`w-5 h-5 ${liked[song.id] ? "text-red-500 fill-red-500" : "text-gray-400"} `} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Songs Section */}
      <div className="bg-gray-800 bg-opacity-10 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-red-500">Favorite</h3>
          <button className="text-purple-600 hover:text-purple-700 font-medium">View all</button>
        </div>
        <div className="space-y-4 mb-8">
          {favoriteSongs.map((song) => (
            <div key={song.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-500/20 cursor-pointer group transition-colors">
              <Image src={song.cover} alt={song.title} width={60} height={60} className="rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{song.title}</h4>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{song.duration}</span>
                <button onClick={() => toggleLike(song.id)} className="p-2 transition-colors">
                  <Heart className={`w-5 h-5 ${liked[song.id] ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}