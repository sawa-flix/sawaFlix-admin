'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { handleSignOut } from '@/app/(auth)/actions';

export default function UserDropdown({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = profile?.displayName
    ? profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition-colors group focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border border-gray-700 group-hover:border-red-500/50 transition-colors">
          {profile?.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={profile.username || 'User'}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <span className="text-xs font-bold text-gray-400">{initials}</span>
          )}
        </div>
        <ChevronDown size={14} className={`text-gray-400 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1A2335] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-gray-800 mb-2">
            <p className="text-sm font-bold text-white truncate">{profile?.displayName || profile?.username}</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{profile?.category || 'Creator'}</p>
          </div>

          <Link
            href={`/creator/${profile?.username}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} className="text-red-500" />
            My Profile
          </Link>

          <Link
            href="/creator-dashboard/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="text-red-500" />
            Settings
          </Link>

          <div className="border-t border-gray-800 mt-2 pt-2">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
