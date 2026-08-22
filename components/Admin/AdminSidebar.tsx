'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ShieldCheck,
    LogOut,
    Video,
    Star,
    PlusCircle,
    ListVideo,
    ChevronDown,
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
        { name: 'Verifications', icon: ShieldCheck, id: 'verifications', route: '/admin' },
    ];

    const handleItemClick = () => {
        onNavigate?.();
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800/80 text-gray-300">
            {/* Header Badge */}
            <div className="px-5 py-5 flex items-center space-x-3.5 border-b border-gray-800/60">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-900/30">
                    <ShieldCheck className="text-white" size={19} />
                </div>
                <div>
                    <h2 className="text-white font-bold text-xs tracking-wider uppercase">ADMIN PORTAL</h2>
                    <p className="text-[11px] text-gray-500 font-medium">SawaFlix Management</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto scrollbar-none">
                <div className="px-3 pb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                    Main Menu
                </div>

                {/* Primary Nav Links */}
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
                            className={`relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${
                                isActive
                                    ? 'bg-gray-800/80 text-white font-semibold shadow-inner'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                            }`}
                        >
                            {/* Left active indicator bar */}
                            {isActive && (
                                <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-600 rounded-r-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                            )}
                            <div className="flex items-center space-x-3">
                                <Icon
                                    size={18}
                                    className={`transition-colors duration-200 ${
                                        isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'
                                    }`}
                                />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* Collapsible Content Section */}
                <div className="pt-1">
                    <button
                        onClick={() => setContentOpen(prev => !prev)}
                        className={`relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${
                            isContentActive
                                ? 'bg-gray-800/80 text-white font-semibold shadow-inner'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                        }`}
                    >
                        {isContentActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-600 rounded-r-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                        )}
                        <div className="flex items-center space-x-3">
                            <Video
                                size={18}
                                className={`transition-colors duration-200 ${
                                    isContentActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'
                                }`}
                            />
                            <span>Content</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 text-gray-400 ${
                                contentOpen ? 'rotate-180 text-white' : ''
                            }`}
                        />
                    </button>

                    {/* Sub-links */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            contentOpen ? 'max-h-52 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="ml-4 pl-3.5 border-l border-gray-800 space-y-1">
                            {contentSubLinks.map((sub) => {
                                const SubIcon = sub.icon;
                                const isSubActive = pathname === sub.route;
                                return (
                                    <Link
                                        key={sub.route}
                                        href={sub.route}
                                        onClick={handleItemClick}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                                            isSubActive
                                                ? 'text-white bg-gray-800/90 font-semibold shadow-sm'
                                                : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/40'
                                        }`}
                                    >
                                        <SubIcon
                                            size={15}
                                            className={isSubActive ? 'text-red-500' : 'text-gray-500'}
                                        />
                                        <span>{sub.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Actions Footer */}
            <div className="p-3 border-t border-gray-800/80">
                <button
                    className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-red-400 transition-all duration-200 text-sm font-medium cursor-pointer"
                    onClick={() => {
                        console.log('Admin Logout');
                    }}
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
