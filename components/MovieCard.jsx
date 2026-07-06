import React, { useState } from 'react';
import { Play, Plus, Info, Star } from 'lucide-react';

const MovieCard = ({ movie, isLarge = false, onPlay, onAddToWatchlist, onMoreInfo }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative group cursor-pointer transition-transform duration-300 hover:scale-105 ${
        isLarge ? 'min-w-[200px] md:min-w-[320px]' : 'min-w-[120px] md:min-w-[192px]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(movie)}
    >
      <div className="relative">
        <img 
          src={movie.image} 
          alt={movie.title}
          className={`w-full object-cover rounded-lg ${
            isLarge ? 'h-[112px] md:h-[180px]' : 'h-[268px] md:h-[388px]'
          }`}
          loading="lazy"
        />
        {movie.isNew && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 rounded-lg flex items-center justify-center ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}>
          <div className="flex space-x-2 md:space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="bg-white text-black p-2 md:p-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist(movie);
              }}
              className="bg-gray-800 text-white p-2 md:p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              <Plus size={16} className="md:w-5 md:h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMoreInfo(movie);
              }}
              className="bg-gray-800 text-white p-2 md:p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              <Info size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 md:p-4 rounded-b-lg">
          <h3 className="text-white font-semibold text-xs md:text-sm mb-1 truncate">{movie.title}</h3>
          <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-300">
            <span>{movie.release_date}</span>
            <div className="flex items-center">
              <Star className="w-2 h-2 md:w-3 md:h-3 text-yellow-400 fill-current mr-1" />
              <span>{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;