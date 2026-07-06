'use client'
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        setNotificationCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setNotificationCount(0);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Handle search logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Desktop Navigation (768px+) */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
        <div className="px-5">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section- logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V9a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">
                Sawa<span className="text-red-500">Flix</span>
              </span>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search movies, music and more..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Right Section - User Actions  */}
            <div className="flex items-center gap-2">
              
              {/* Notifications - Always show when logged in */}
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-3.5-4V8a5.5 5.5 0 00-11 0v5L2 17h5m8 0v1a3 3 0 01-6 0v-1m6 0H9" />
                    </svg>
                    
                    {/* Notification Badge */}
                    {notificationCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </div>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold">Notifications</h3>
                          <button 
                            onClick={() => setNotificationCount(0)}
                            className="text-sm text-red-500 hover:text-red-400"
                          >
                            Mark all read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notificationCount > 0 ? (
                          Array.from({ length: Math.min(notificationCount, 5) }).map((_, i) => (
                            <div key={i} className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <p className="text-white text-sm">New content available</p>
                                  <p className="text-gray-400 text-xs mt-1">2 minutes ago</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Avatar - Always show when logged in */}
              {isLoggedIn && (
                <div className="relative ml-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all">
                    JD
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Below 768px) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
        <div className="px-3">
          {/* Single Row - Logo and Actions */}
          <div className="flex items-center justify-between h-14">
            {/* Logo (YouTube-style mobile positioning) */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V9a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Sawa<span className="text-red-500">Flix</span>
              </span>
            </div>

            {/* Right Actions (YouTube-style compact mobile spacing) */}
            <div className="flex items-center gap-1">
              {/* Search Icon - Always visible */}
              <button
                onClick={handleSearch}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Show user elements only when logged in */}
              {isLoggedIn && (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={handleNotificationClick}
                      className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-3.5-4V8a5.5 5.5 0 00-11 0v5L2 17h5m8 0v1a3 3 0 01-6 0v-1m6 0H9" />
                      </svg>
                      
                      {/* Notification Badge */}
                      {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </div>
                      )}
                    </button>

                    {/* Mobile Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                        <div className="p-3 border-b border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-sm">Notifications</h3>
                            <button 
                              onClick={() => setNotificationCount(0)}
                              className="text-xs text-red-500 hover:text-red-400"
                            >
                              Mark all read
                            </button>
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {notificationCount > 0 ? (
                            Array.from({ length: Math.min(notificationCount, 3) }).map((_, i) => (
                              <div key={i} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <div>
                                    <p className="text-white text-xs">New content available</p>
                                    <p className="text-gray-400 text-xs mt-0.5">2 minutes ago</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400 text-sm">
                              No new notifications
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs ml-1">
                    WJ
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Overlay for mobile notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default Navbar;