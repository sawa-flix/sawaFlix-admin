'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Music,
  User,
  Download,
  FileText,
  Workflow,
  Wallet,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '../../utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import SawaflixLogo from '../SawaflixLogo';

// Define a type for the user profile data from your 'users' table
type UserProfileData = {
  username: string | null;
  email: string | null;
  profile_image_url: string | null;
};

export default function LeftSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  const [verificationStatus, setVerificationStatus] = useState<string>('none');

  // Fetch user session and profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('users')
          .select('username, email, profile_image_url')
          .eq('id', user.id)
          .single<UserProfileData>();

        if (profileData) {
          setUserProfile(profileData);
        }

        // Fetch verification status
        try {
          const res = await fetch('/api/creator/profile');
          if (res.ok) {
            const data = await res.json();
            setVerificationStatus(data.verificationStatus);
          }
        } catch (err) {
          console.error('Error fetching verification status:', err);
        }
      }
    };

    fetchUserData();

    // Poll for status every 5 seconds if none to ensure instant update after submission
    const interval = setInterval(() => {
        if (verificationStatus === 'none') {
            fetchUserData();
        }
    }, 5000);

    return () => clearInterval(interval);
  }, [verificationStatus]);

  const menuItems = [
    { name: 'Feed', icon: Home, id: 'feed', route: '/dashboard', badge: null },
    { name: 'Movies', icon: Film, id: 'movies', route: '/dashboard/movie', badge: null },
    { name: 'Music', icon: Music, id: 'music', route: '/dashboard/musicPage', badge: 'New' },
    { name: 'Artists', icon: User, id: 'artists', route: '/dashboard/artists', badge: null },
    { name: 'Blogs', icon: FileText, id: 'blogs', route: '/dashboard/blogs', badge: null },
    { name: 'Wallet', icon: Wallet, id: 'wallet', route: '/dashboard/wallet', badge: null },
  ];

  // Add "Create Content" link based on verification status
  if (!menuItems.find(item => item.id === 'create-content')) {
    let route = '/creator/verify'; // Default apply
    let badge: string | null = 'Apply';

    if (verificationStatus === 'pending') {
      route = '/creator/pending';
      badge = 'Pending';
    } else if (verificationStatus === 'approved') {
      route = '/creator-dashboard';
      badge = null;
    } else if (verificationStatus === 'rejected') {
      route = '/creator/verify'; // Re-apply
      badge = 'Apply';
    }

    menuItems.push({
      name: 'Create Content',
      icon: Workflow,
      id: 'create-content',
      route: route,
      badge: badge
    });
  }

  const smart = [
    { name: 'SawaSmart', icon: Workflow, id: 'SawaSmart', route: '/dashboard/sawaSmart', badge: null },
  ]

  const handleItemClick = () => {
    // Close sidebar on mobile when navigating
    onNavigate?.();
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0E14] border-r border-white/5">
      {/* Logo Section */}
      {/* <div className="p-6 pb-2">
        <SawaflixLogo />
      </div> */}

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;

          return (
            <Link
              key={item.id}
              href={item.route}
              onClick={handleItemClick}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-red-600/10 text-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-white'}`}
                />
                <span className={`font-semibold text-sm ${isActive ? 'text-red-500' : ''}`}>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${isActive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'bg-white/10 text-gray-400'
                  }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        {smart.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;

          return (
            <Link
              key={item.id}
              href={item.route}
              onClick={handleItemClick}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-red-600/10 text-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-white'}`}
                />
                <span className={`font-semibold text-sm ${isActive ? 'text-red-500' : ''}`}>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${isActive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'bg-white/10 text-gray-400'
                  }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <Link href="/dashboard/profile" onClick={() => onNavigate?.()}>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 mt-4 transition-all cursor-pointer border border-white/10">
            {userProfile?.profile_image_url ? (
              <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden aspect-square border-2 border-white/5">
                <Image
                  src={userProfile.profile_image_url}
                  alt="Profile"
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">
                {userProfile?.username || 'Guest'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userProfile?.email || 'N/A'}
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-red-400 font-bold">128</div>
            <div className="text-gray-400">Movies</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-red-400 font-bold">64</div>
            <div className="text-gray-400">Songs</div>
          </div>
        </div>
      </div>
    </div>
  );
}