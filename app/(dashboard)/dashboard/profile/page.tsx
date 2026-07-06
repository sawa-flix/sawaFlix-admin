import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';

// The createClient function for server components
import { createClient } from '../../../../utils/supabase/server'; 

import { MusicFeatures } from '../../../../components/MusicFeatures';

// Define a type for the user profile data
type UserProfileData = {
  username: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  bio: string | null;
};

const DEFAULT_PROFILE_IMAGE = '/default-profile-pic.jpg';
const DEFAULT_COVER_IMAGE = '/hero-bg.png';
const DEFAULT_BIO = 'Passionate about discovering new music and sharing great vibes. Love everything from indie rock to electronic beats.';

const MusicProfilePage = async () => {

  const cookieStore = cookies()
  // Await the createClient() call
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const { data: profile } = await supabase
    .from('users')
    .select('username, profile_image_url, cover_image_url, bio')
    .eq('id', user.id)
    .single<UserProfileData>();

  // ... rest of your component code remains the same
  const playlists = [
    { id: 1, name: 'My Favorites', songs: 25, cover: '/avenge.jpg' },
    { id: 2, name: 'Workout Mix', songs: 18, cover: '/r3.jpg' },
    { id: 3, name: 'Chill Vibes', songs: 32, cover: '/music.jpg' },
    { id: 4, name: 'Road Trip', songs: 28, cover: '/mfy4.jpg' }
  ];
  const recommendedSongs = [
    { id: 1, title: 'Avengers', artist: 'Luna Valley', duration: '3:42', cover: '/avenge.jpg' },
    { id: 2, title: 'Black Panther', artist: 'Neon Waves', duration: '4:15', cover: '/black.jpg' },
    { id: 3, title: 'Doctor Strange', artist: 'Coastal Drift', duration: '3:28', cover: '/docstrange.jpg' },
    { id: 4, title: 'Green Light', artist: 'Benylee', duration: '3:56', cover: '/Greenlight.jpg' }
  ];
  const favoriteSongs = [
    { id: 1, title: 'Golden Hour', artist: 'Magasco', duration: '4:22', cover: '/magasco.jpg' },
    { id: 2, title: 'You are you', artist: 'Dejavu', duration: '3:33', cover: '/mfy1.jpg' },
    { id: 3, title: 'Mountain High', artist: 'Valley Echo', duration: '4:01', cover: '/john.jpg' },
    { id: 4, title: 'Ocean Waves', artist: 'Benylee', duration: '3:47', cover: '/Gene.jpg' }
  ];

  return (
    <div className="bg-transparent font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Profile Section with Background - Modern Industrial View */}
        <div className="relative mb-24 group">
          <div
            className="relative h-64 md:h-96 rounded-[3rem] shadow-3xl overflow-hidden bg-[#0B0E14] border border-gray-800/50"
          >
            {profile?.cover_image_url ? (
              <Image 
                src={profile.cover_image_url} 
                alt="Profile Cover" 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(#1a1f29_1px,transparent_1px)] bg-size-[20px_20px] opacity-20" />
            )}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 p-8 flex justify-end items-start">
              <Link href="/dashboard/edit-profile">
                <button className="bg-red-600 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-600/20 border-b-4 border-red-800">
                  Modify Identity
                </button>
              </Link>
            </div>
          </div>
          
          {/* Profile Image - High Contrast Border */}
          <div className="absolute -bottom-16 left-12 md:left-20">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-10 border-[#0f1729] bg-[#1a1f29] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
              <Image 
                src={profile?.profile_image_url || DEFAULT_PROFILE_IMAGE} 
                alt="Profile" 
                width={208} 
                height={208} 
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </div>
        </div>
        
        {/* User Info Section - Industrial Typography */}
        <div className="pl-12 md:pl-20 mt-20 space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              {profile?.username || 'Anonymous <span className="text-red-600">User</span>'}
            </h2>
            {profile?.username && <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" />}
          </div>
          <div className="max-w-3xl">
            <p className="text-gray-400 font-medium text-lg leading-relaxed border-l-4 border-red-600/30 pl-6 py-2 italic bg-red-600/5 rounded-r-2xl">
              {profile?.bio || DEFAULT_BIO}
            </p>
          </div>
        </div>

        {/* Music Ecosystem Sections */}
        <div className="mt-16 bg-[#1a1f29]/30 rounded-[3rem] p-10 border border-gray-800/30">
          <MusicFeatures 
            playlists={playlists} 
            recommendedSongs={recommendedSongs} 
            favoriteSongs={favoriteSongs} 
          />
        </div>
        
      </div>
    </div>
  );
};

export default MusicProfilePage;