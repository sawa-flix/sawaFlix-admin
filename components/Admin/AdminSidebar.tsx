'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Settings,
    ShieldCheck,
    LogOut,
    Bell,
    Video,
    Star,
    PlusCircle,
    ListVideo,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

const contentSubLinks = [
    { name: 'Upload Content', icon: PlusCircle, route: '/admin/content/upload' },
    { name: 'Uploaded Feed',  icon: ListVideo,   route: '/admin/content/feed' },
    { name: 'Top Artists',    icon: Star,         route: '/admin/content/top-artists' },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const isContentActive = pathname?.startsWith('/admin/content');
    const [contentOpen, setContentOpen] = useState(isContentActive);

    const menuItems = [
        { name: 'Verifications', icon: ShieldCheck, id: 'dashboard', route: '/admin' },
    ];

    const handleItemClick = () => {
        onNavigate?.();
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">

            {/* Admin Badge/Header Area */}
            <div className="px-4 py-6 flex items-center space-x-3 border-b border-gray-800/50 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <ShieldCheck className="text-white" size={18} />
                </div>
                <div>
                    <h2 className="text-white font-bold text-sm tracking-wide">ADMIN PORTAL</h2>
                    <p className="text-xs text-gray-500">SawaFlix Management</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {/* Static menu items */}
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.route === '/admin'
                        ? pathname === '/admin'
                        : pathname?.startsWith(item.route);

                    return (
                        <Link
                            key={item.id}
                            href={item.route}
                            onClick={handleItemClick}
                            className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20'
                                : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon
                                    size={20}
                                    className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* Content — expandable */}
                <div>
                    <button
                        onClick={() => setContentOpen(prev => !prev)}
                        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 group ${
                            isContentActive
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20'
                                : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <Video
                                size={20}
                                className={`transition-colors ${isContentActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                            />
                            <span className="font-medium">Content</span>
                        </div>
                        {contentOpen
                            ? <ChevronDown size={16} className="opacity-70" />
                            : <ChevronRight size={16} className="opacity-70" />
                        }
                    </button>

                    {/* Sub-links */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            contentOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="ml-3 pl-4 border-l border-gray-700/60 space-y-0.5">
                            {contentSubLinks.map((sub) => {
                                const SubIcon = sub.icon;
                                const isSubActive = pathname === sub.route;
                                return (
                                    <Link
                                        key={sub.route}
                                        href={sub.route}
                                        onClick={handleItemClick}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                                            isSubActive
                                                ? 'text-white bg-gray-800'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                                        }`}
                                    >
                                        <SubIcon
                                            size={14}
                                            className={isSubActive ? 'text-red-400' : 'text-gray-500'}
                                        />
                                        {sub.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-800">
                <button
                    className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200"
                    onClick={() => console.log('Admin Logout')}
                >
                    <LogOut size={20} />
                    <span className="font-medium hover:cursor-pointer">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
