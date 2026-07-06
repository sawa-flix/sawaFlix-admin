

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Info, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = ({ movies = [], onPlay, onMoreInfo, onAddToWatchlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);

  // Smooth transition function
  const transitionToSlide = useCallback((newIndex) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    setNextIndex(newIndex);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 800);
  }, [currentIndex, isTransitioning]);

  // Auto-slide functionality with seamless infinite loop
  useEffect(() => {
    if (!isAutoPlay || movies.length <= 1) return;

    const interval = setInterval(() => {
      const nextIdx = (currentIndex + 1) % movies.length;
      transitionToSlide(nextIdx);
    }, 3000); // 3 seconds for better viewing experience

    return () => clearInterval(interval);
  }, [isAutoPlay, movies.length, currentIndex, transitionToSlide]);

  // Preload next image for smoother transitions
  useEffect(() => {
    if (movies.length > 1) {
      const nextIdx = (currentIndex + 1) % movies.length;
      const img = new Image();
      img.src = movies[nextIdx].image;
    }
  }, [currentIndex, movies]);

  // Pause auto-play on hover with smooth transition
  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  // Navigation functions
  const goToSlide = (index) => {
    transitionToSlide(index);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    transitionToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIdx = (currentIndex + 1) % movies.length;
    transitionToSlide(nextIdx);
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[nextIndex % movies.length];

  return (
    <div 
      className="relative h-[45vh] md:h-[75vh] pt-5 mx-5 overflow-hidden rounded-2xl shadow-2xl group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images with Fade Transition */}
      <div className="relative w-full h-full">
        {/* Current Image */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
        >
          <img 
            src={currentMovie.image}
            alt={currentMovie.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out"
            loading="eager"
          />
          {/* Dynamic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Next Image (for smooth transition) */}
        {isTransitioning && (
          <div 
            className="absolute inset-0 transition-all duration-1000 ease-in-out opacity-100 scale-100"
          >
            <img 
              src={nextMovie.image}
              alt={nextMovie.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </div>
        )}
      </div>

      {/* Content Overlay with Smooth Animations */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-4 md:p-8">
          <div className="max-w-md md:max-w-3xl">
            {/* Title with Slide-in Animation */}
            <h1 
              key={`title-${currentIndex}`}
              className="text-white text-3xl md:text-6xl font-bold mb-3 md:mb-6 line-clamp-2 
                         transform transition-all duration-1000 ease-out
                         animate-fade-in-up"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                animation: `fadeInUp 1s ease-out ${isTransitioning ? '0.3s' : '0s'} both`
              }}
            >
              {(isTransitioning ? nextMovie : currentMovie).title}
            </h1>
            
            {/* Plot Summary with Delayed Animation */}
            <p 
              key={`plot-${currentIndex}`}
              className="text-gray-200 text-sm md:text-xl mb-4 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-4
                         transform transition-all duration-1000 ease-out delay-200"
              style={{
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                animation: `fadeInUp 1s ease-out ${isTransitioning ? '0.5s' : '0.2s'} both`
              }}
            >
              {(isTransitioning ? nextMovie : currentMovie).plot_summary}
            </p>
            
            {/* Movie Stats with Staggered Animation */}
            <div 
              key={`stats-${currentIndex}`}
              className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8 text-sm md:text-base
                         transform transition-all duration-1000 ease-out delay-300"
              style={{
                animation: `fadeInUp 1s ease-out ${isTransitioning ? '0.7s' : '0.4s'} both`
              }}
            >
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current mr-2" />
                <span className="text-white font-semibold">
                  {(isTransitioning ? nextMovie : currentMovie).rating}
                </span>
              </div>
              <span className="text-gray-200 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {(isTransitioning ? nextMovie : currentMovie).release_date}
              </span>
              {(isTransitioning ? nextMovie : currentMovie).duration_minutes && (
                <span className="text-gray-200 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {(isTransitioning ? nextMovie : currentMovie).duration_minutes} min
                </span>
              )}
            </div>
            
            {/* Action Buttons with Enhanced Styling */}
            <div 
              key={`buttons-${currentIndex}`}
              className="flex space-x-3 md:space-x-4 flex-wrap gap-2
                         transform transition-all duration-1000 ease-out delay-500"
              style={{
                animation: `fadeInUp 1s ease-out ${isTransitioning ? '0.9s' : '0.6s'} both`
              }}
            >
              <button 
                onClick={() => onPlay(isTransitioning ? nextMovie : currentMovie)}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 md:px-10 md:py-4 
                           rounded-xl flex items-center space-x-2 md:space-x-3 
                           transition-all duration-300 ease-out text-sm md:text-lg font-semibold
                           hover:scale-105 hover:shadow-2xl backdrop-blur-sm
                           group/button"
              >
                <Play size={18} className="md:w-6 md:h-6 fill-current group-hover/button:scale-110 transition-transform" />
                <span>Watch Now</span>
              </button>
              
              <button 
                onClick={() => onMoreInfo(isTransitioning ? nextMovie : currentMovie)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white 
                           px-6 py-3 md:px-10 md:py-4 rounded-xl 
                           transition-all duration-300 ease-out text-sm md:text-lg font-semibold
                           hover:scale-105 hover:shadow-xl border border-white/20 hover:border-white/40"
              >
                <Info size={18} className="md:w-6 md:h-6 mr-2 inline" />
                More Info
              </button>
              
              <button 
                onClick={() => onAddToWatchlist(isTransitioning ? nextMovie : currentMovie)}
                className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white 
                           px-6 py-3 md:px-10 md:py-4 rounded-xl flex items-center space-x-2 
                           transition-all duration-300 ease-out text-sm md:text-lg font-semibold
                           hover:scale-105 hover:shadow-xl border border-white/10 hover:border-white/30"
              >
                <Plus size={18} className="md:w-6 md:h-6" />
                <span>My List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 
                       bg-black/40 hover:bg-black/70 backdrop-blur-md text-white 
                       p-3 md:p-4 rounded-full transition-all duration-300 ease-out
                       opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-white/20 hover:border-white/40"
          >
            <ChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 
                       bg-black/40 hover:bg-black/70 backdrop-blur-md text-white 
                       p-3 md:p-4 rounded-full transition-all duration-300 ease-out
                       opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-white/20 hover:border-white/40"
          >
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Stylish Pagination Dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-500 ease-out rounded-full backdrop-blur-sm
                         disabled:cursor-not-allowed ${
                index === currentIndex 
                  ? 'w-8 md:w-12 h-3 md:h-4 bg-white shadow-lg' 
                  : 'w-3 md:w-4 h-3 md:h-4 bg-white/50 hover:bg-white/80 hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Elegant Movie Counter */}
      {movies.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md text-white 
                        px-4 py-2 rounded-full text-sm md:text-base font-semibold
                        border border-white/20 shadow-lg">
          {currentIndex + 1} / {movies.length}
        </div>
      )}

      CSS Keyframes
      {/* <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out both;
        }
      `}</style> */}
    </div>
  );
};
1
export default HeroSection;