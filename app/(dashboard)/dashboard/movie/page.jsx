"use client"

import React, { useState, useEffect } from 'react';
import HeroSection from '../../../../components/HeroSection';
import ScrollableRow from '../../../../components/ScrollableRow';
import Modal from '../../../../components/Modal';
import Toast from '../../../../components/Toast';
// import companies from '../../components/company';
import mockData from '../../../data/mockdata.json';

export default function MovieStreamingSite() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [modalState, setModalState] = useState({ isOpen: false, movie: null, type: 'info' });
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // Process the mock data to match expected structure
    const processedData = {
      featuredMovie: mockData[0], // Use first movie as featured
      ourSeries: mockData.slice(0, 5),
      popularMovies: mockData.slice(5, 10),
      trendingNow: mockData.slice(10, 15),
      newReleases: mockData.slice(15, 20),
      mustWatch: mockData.slice(20, 25)
    };
    setData(processedData);
  }, []);

  const showToast = (message) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  const handlePlay = (movie) => {
    setModalState({ isOpen: true, movie, type: 'play' });
    showToast(`Playing: ${movie.title}`);
  };

  const handleMoreInfo = (movie) => {
    setModalState({ isOpen: true, movie, type: 'info' });
  };

  const handleAddToWatchlist = (movie) => {
    if (!watchlist.find(item => item.title === movie.title)) {
      setWatchlist([...watchlist, movie]);
      showToast(`Added "${movie.title}" to your watchlist`);
    } else {
      showToast(`"${movie.title}" is already in your watchlist`);
    }
  };

  const handleSearch = (query) => {
    showToast(`Searching for: ${query}`);
  };

  const handleMenuClick = () => {
    showToast('Mobile menu opened');
  };

  const handleGetStarted = () => {
    showToast('Redirecting to sign up page...');
  };

  const closeModal = () => {
    setModalState({ isOpen: false, movie: null, type: 'info' });
  };

  if (!data) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading MovieFlix...</div>
      </div>
    );
  }

  return (
    <div className="bg-red min-h-screen">
      
      <main className="pt-16">
      <HeroSection 
        movies={mockData.slice(0, 5)}   // 5 featured movies for carousel
        onPlay={handlePlay}
        onMoreInfo={handleMoreInfo}
        onAddToWatchlist={handleAddToWatchlist}
      />
      <companies/>

        
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-8 md:py-12 space-y-8 md:space-y-12">
          <ScrollableRow 
            title="Our Series" 
            movies={data.ourSeries}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Popular Top 10 in Games" 
            movies={data.popularMovies}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Trending Now" 
            movies={data.trendingNow}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="New Releases" 
            movies={data.newReleases}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Must - Watch Movies" 
            movies={data.mustWatch}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          
          {watchlist.length > 0 && (
            <ScrollableRow 
              title="My Watchlist" 
              movies={watchlist}
              onPlay={handlePlay}
              onMoreInfo={handleMoreInfo}
              onAddToWatchlist={handleAddToWatchlist}
            />
          )}
          
          {/* Repeat sections */}
          <ScrollableRow 
            title="Our Series" 
            movies={data.ourSeries}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Popular Top 10 in Games" 
            movies={data.popularMovies}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Trending Shows Now" 
            movies={data.trendingNow}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="New Released Shows" 
            movies={data.newReleases}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <ScrollableRow 
            title="Must - Watch Shows" 
            movies={data.mustWatch}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
            onAddToWatchlist={handleAddToWatchlist}
          />
        </div>
      </main>
      
      {/* <Footer onGetStarted={handleGetStarted} /> */}
      
      <Modal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        movie={modalState.movie}
        type={modalState.type}
      />
      
      <Toast 
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}