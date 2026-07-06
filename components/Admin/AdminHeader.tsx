'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, User, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client'; 
import { User as SupabaseUser } from '@supabase/supabase-js'; 
import SawaflixLogo from '../SawaflixLogo';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';

type UserProfileData = {
  username: string | null;
  email: string | null;
  profile_image_url: string | null;
};

const AdminHeader = ({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean; toggleSidebar: () => void }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { notifications, unreadCount, markRead, markAllRead } = useAdminNotifications();

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from('users')
          .select('username, email, profile_image_url')
          .eq('id', user.id)
          .single<UserProfileData>();

        if (error) {
          console.error('Error fetching user profile:', error.message);
        } else if (profileData) {
          setUserProfile(profileData);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="flex items-center justify-between h-full pl-4 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 mr-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-3 group">
            <Link href="/admin" className="flex items-center gap-3">
              <SawaflixLogo />
              <span className="hidden sm:block text-sm font-semibold text-gray-400 border-l border-gray-700 pl-3">
                Admin
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Admin Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 border-2 border-gray-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-red-500 hover:text-red-400 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-none">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (!n.read) markRead(n.id);
                        }}
                        className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors cursor-pointer group ${!n.read ? 'bg-red-500/5' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            n.type === 'approved' ? 'bg-green-500' : 
                            n.type === 'rejected' ? 'bg-red-500' : 
                            n.type === 'new_submission' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-none mb-1 ${!n.read ? 'text-white' : 'text-gray-400'}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-600 mt-1">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="hidden sm:block p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer">
            <Settings size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
              aria-label="User profile menu"
            >
              {userProfile?.profile_image_url ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 shadow-sm flex-shrink-0">
                  <Image
                    src={userProfile.profile_image_url}
                    alt="User Avatar"
                    fill
                    className="object-cover aspect-square"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 shadow-sm flex-shrink-0">
                  <User size={14} className="text-gray-400" />
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium">
                {userProfile?.username || currentUser?.email || 'Admin'}
              </span>
              <ChevronDown size={14} className={`hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{userProfile?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{currentUser?.email || 'authenticated'}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors rounded-b-xl"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;
