import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SawaflixLogo from './SawaflixLogo';

const Header = ({ onSearch }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-gray bg-opacity-10 backdrop-blur-sm fixed w-full z-40">
      {/* Logo */}
      <SawaflixLogo />
      
      {/* Search Bar */}
      <div className="flex items center">
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="bg-gray-800 flex-1 text-white  md:px-20 md:py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-32 md:w-auto "             autoFocus
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-2 py-1 md:px-3 md:py-4 rounded-r-lg transition-colors"
            >
              <Search size={20} className="text-white " />
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setSearchOpen(true)}
            className="text-white cursor-pointer hover:text-red-500 transition-colors"
          >
            <Search size={20} />
          </button>
        )  }
      </div>
    </header>
  );
};

export default Header;