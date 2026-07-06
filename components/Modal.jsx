import React from 'react';
import { X, Star, Play, Plus } from 'lucide-react';

const Modal = ({ isOpen, onClose, movie, type = 'info' }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={movie.image} 
            alt={movie.title}
            className="w-full h-40 md:h-48 object-contain rounded-t-lg"
          />
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 bg-black bg-opacity-50 text-white p-1 md:p-2 rounded-full hover:bg-opacity-75"
          >
            <X size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
        <div className="p-4 md:p-6">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-2">{movie.title}</h2>
          <div className="flex items-center space-x-2 md:space-x-4 mb-3 md:mb-4 text-xs md:text-base text-gray-300">
            <div className="flex items-center">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current mr-1" />
              <span>{movie.rating}</span>
            </div>
            <span>{movie.release_date}</span>
            {movie.duration_minutes && <span>{movie.duration_minutes} min</span>}
          </div>
          <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">{movie.plot_summary}</p>
          <div className="flex space-x-2 md:space-x-4 flex-wrap gap-2">
            {type === 'play' ? (
              <div className="text-center w-full">
                <div className="bg-red-600 text-white p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                  <Play size={24} className="mx-auto mb-1 md:mb-2" fill="currentColor" />
                  <p className="text-sm md:text-base">Playing: {movie.title}</p>
                </div>
                <p className="text-gray-400 text-xs md:text-sm">Video player would be implemented here</p>
              </div>
            ) : (
              <>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 md:px-6 md:py-2 rounded-lg flex items-center space-x-1 md:space-x-2 transition-colors text-sm md:text-base">
                  <Play size={14} className="md:w-4 md:h-4" fill="currentColor" />
                  <span>Play</span>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 md:px-6 md:py-2 rounded-lg flex items-center space-x-1 md:space-x-2 transition-colors text-sm md:text-base">
                  <Plus size={14} className="md:w-4 md:h-4" />
                  <span>Add to List</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;