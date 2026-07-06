'use client';
import React from 'react';
import { 
    Home,
    LayoutGrid, 
    Upload, 
    Film, 
    BarChart2, 
    MessageSquare, 
    Bell, 
    HelpCircle, 
    Settings, 
    LogOut 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/app/(auth)/actions';
import SawaflixLogo from '../SawaflixLogo';

const CreatorSidebar = ({ userProfile }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Feed', icon: Home, href: '/dashboard' },
        { name: 'Dashboard', icon: LayoutGrid, href: '/creator-dashboard' },
        { name: 'Upload New', icon: Upload, href: '/creator-dashboard/post' },
        { name: 'My Content', icon: Film, href: '/creator-dashboard/content' },
        { name: 'Analytics', icon: BarChart2, href: '/creator-dashboard/analytics' },
        { name: 'Comments', icon: MessageSquare, href: '/dashboard/comments' },
        { name: 'Notifications', icon: Bell, href: '/dashboard/notification' },
        { name: 'Help', icon: HelpCircle, href: '/dashboard/help' },
    ];

    return (
        <div className="h-full flex flex-col bg-[#0B0E14] border-r border-white/5 w-64">
            {/* Logo Section */}
            <div className="p-6 pb-2">
                <SawaflixLogo />
            </div>
            <div className="p-6 border-b border-white/5">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-600 mb-3 shrink-0 aspect-square">
                        <img 
                            src={userProfile?.profileImage || "/0.jpg"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-white font-black text-lg tracking-tight">{userProfile?.displayName || "Creator"}</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{userProfile?.category || "Artist"}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                isActive 
                                ? 'bg-red-600 text-white' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className="font-semibold text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 space-y-2 border-t border-white/5">
                <Link 
                    href="/dashboard/edit-profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <Settings className="w-5 h-5 group-hover:text-white" />
                    <span className="font-semibold text-sm">Settings</span>
                </Link>
                <form action={handleSignOut}>
                    <button 
                        type="submit"
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatorSidebar;
