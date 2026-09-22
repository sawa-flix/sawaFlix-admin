'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  PlusCircle,
  ListVideo,
  FolderTree,
  ListMusic,
  Star,
  Users,
  UserCheck,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOutAdmin } from '@/services/authService';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
      { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
      { name: 'Activity', href: '/admin/activity', icon: Activity },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { name: 'Upload Content', href: '/admin/content/upload', icon: PlusCircle },
      { name: 'Uploaded Feed', href: '/admin/content/feed', icon: ListVideo },
      { name: 'Categories', href: '/admin/content/categories', icon: FolderTree },
      { name: 'Playlists', href: '/admin/content/playlists', icon: ListMusic },
      { name: 'Top Artists', href: '/admin/content/top-artists', icon: Star },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Creators', href: '/admin/creators', icon: UserCheck },
      { name: 'Reports', href: '/admin/reports', icon: FileText },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOutAdmin();
    window.location.href = '/login';
  };

  const isItemActive = (item: NavItem) => {
    if (!pathname) return false;
    if (item.exact) {
      return pathname === item.href || pathname.startsWith('/admin/verifications');
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200/80 text-slate-600 select-none">
      {/* Navigation Menu */}
      <nav className="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto scrollbar-none">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={onNavigate}
                    className={`relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition-all duration-150 group font-medium text-xs ${
                      active
                        ? 'bg-red-50/70 text-red-600 font-bold border border-red-100/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-500 rounded-r-full" />
                    )}
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        size={17}
                        className={`shrink-0 transition-colors duration-150 ${
                          active ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate tracking-tight">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Sign Out */}
      <div className="p-3.5 border-t border-slate-100">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all duration-150 text-xs font-semibold cursor-pointer"
        >
          <LogOut size={16} className="text-slate-400 hover:text-red-500 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
