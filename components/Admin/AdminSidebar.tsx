'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Users,
    LogOut,
    Bell
} from 'lucide-react';

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const [active, setActive] = useState('dashboard');

    const menuItems = [
        { name: 'Verifications', icon: ShieldCheck, id: 'dashboard', route: '/admin' },
        { name: 'All Users', icon: Users, id: 'users', route: '/admin/users' },
    ];

    const handleItemClick = (itemId: string) => {
        setActive(itemId);
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
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;

                    return (
                        <Link
                            key={item.id}
                            href={item.route}
                            onClick={() => handleItemClick(item.id)}
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
