import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const ScrollableRow = ({ title, movies, isLarge = false, onPlay, onAddToWatchlist, onMoreInfo }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const scrollContainerId = `scroll-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  const scroll = (direction) => {
    const container = document.getElementById(scrollContainerId);
    if (!container) return;
    
    const scrollAmount = isLarge ? 320 : 200;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <div className="mb-8 md:mb-38" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <div className="flex items-center justify-between mb-2 md:mb-4 px-2 md:px-0">
        <h2 className="text-white text-lg md:text-xl font-semibold">{title}</h2>
        {(showControls || window.innerWidth < 768) && (
          <div className="flex space-x-1 md:space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-1 md:p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft className="text-white" size={14} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1 md:p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronRight className="text-white" size={14} />
            </button>
          </div>
        )}
      </div>
      <div 
        id={scrollContainerId}
        className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide px-2 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies?.map((movie, index) => (
          <MovieCard 
            key={index} 
            movie={movie} 
            isLarge={isLarge}
            onPlay={onPlay}
            onAddToWatchlist={onAddToWatchlist}
            onMoreInfo={onMoreInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollableRow;