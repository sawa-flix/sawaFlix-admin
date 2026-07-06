'use client';
import React from 'react';
import { ExternalLink, Edit3, Sparkles } from 'lucide-react';
import CreatorDashboard from './CreatorDashboard';
import Link from 'next/link';

const ApprovedDashboard = ({ creatorName, userProfile }) => {
    // Generate slug for public profile
    const profileSlug = (userProfile?.username || creatorName || 'creator').toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Welcome Header */}
            <div className="bg-gradient-to-r from-red-600/20 to-transparent border border-red-600/20 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Sparkles className="w-3 h-3 text-red-500" />
                        Verified SawaFlix Creator
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-red-500">{creatorName || userProfile?.username || 'Creator'}</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-lg">
                        Your cultural influence is growing. Manage your craft and track your impact from your verified dashboard.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Link 
                        href={`/creator/${profileSlug}`}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-sm border border-white/10 transition-all uppercase tracking-widest"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Public Profile
                    </Link>
                    <Link 
                        href="/updateProfile"
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm transition-all shadow-xl shadow-red-600/20 uppercase tracking-widest"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Main Dashboard Stats & Content */}
            <CreatorDashboard userProfile={userProfile} />
        </div>
    );
};

export default ApprovedDashboard;
