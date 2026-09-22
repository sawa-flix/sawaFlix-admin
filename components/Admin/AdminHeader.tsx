'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, User, Settings, ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';
import { signOutAdmin } from '@/services/authService';
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
          .maybeSingle<UserProfileData>();

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
    await signOutAdmin();
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between h-full pl-4 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 mr-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-red-500"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-2 group">
            <Link href="/admin" className="flex items-center gap-2">
              <SawaflixLogo />
              <span className="text-xs font-bold text-red-500 ml-1">
                Admin
              </span>
            </Link>
          </div>
        </div>

        {/* Center Search Pill */}
        <div className="hidden md:flex items-center w-72 lg:w-96 bg-slate-50/80 border border-slate-200/80 rounded-full px-4 py-1.5 text-xs text-slate-500 gap-2.5 shadow-xs focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500/40 transition-all">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search creators, content, tickets..." 
            className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Admin Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 ? (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-none divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                      No notifications yet
                    </div>
                  ) : (notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (!n.read) markRead(n.id);
                        }}
                        className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group ${!n.read ? 'bg-red-50/30' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            n.type === 'approved' ? 'bg-emerald-500' : 
                            n.type === 'rejected' ? 'bg-red-500' : 
                            n.type === 'new_submission' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold leading-snug mb-0.5 ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">
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

          {/* Settings Button */}
          <button className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Settings">
            <Settings size={19} />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="User profile menu"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-200 shadow-xs flex-shrink-0">
                {userProfile?.profile_image_url ? (
                  <Image
                    src={userProfile.profile_image_url}
                    alt="User Avatar"
                    fill
                    className="object-cover aspect-square"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                    {(userProfile?.username || currentUser?.email || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.email || userProfile?.username || 'iwstechnical7@gmail.com'}
                </span>
                <span className="text-[10px] font-semibold text-red-500 leading-tight">
                  Super Admin
                </span>
              </div>
              <ChevronDown size={13} className={`hidden sm:block text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{userProfile?.username || 'Super Admin'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'authenticated'}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
