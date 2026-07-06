import React from 'react';
import { Globe, Twitter, Instagram, Youtube, MapPin, Calendar, Award, Share2 } from 'lucide-react';

const ProfileView = ({ profile }) => {
    if (!profile) return null;

    const platformIcons = {
        globe: Globe,
        twitter: Twitter,
        instagram: Instagram,
        youtube: Youtube
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans pb-32">
            {/* Banner Section */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
                {profile.bannerImage ? (
                    <img src={profile.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-purple-600/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent" />
            </div>

            {/* Profile Header */}
            <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl border-8 border-[#0B0E14] shadow-2xl overflow-hidden bg-gray-800">
                        {profile.profileImage ? (
                            <img src={profile.profileImage} alt={profile.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                <Award className="w-16 h-16" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{profile.displayName}</h1>
                            <div className="px-3 py-1 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5" /> Verified Creator
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> {profile.location || 'Global'}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-500" /> Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pb-2">
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-2xl transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-red-600/20 uppercase tracking-widest">
                            Follow Creator
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Left Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <section>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">About the Creator</h3>
                            <p className="text-gray-300 font-medium leading-[1.8] text-lg">
                                {profile.bio || "This creator hasn't shared their story yet."}
                            </p>
                        </section>

                        {profile.socialLinks?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Connect</h3>
                                <div className="flex flex-col gap-3">
                                    {profile.socialLinks.map((link, idx) => {
                                        const Icon = platformIcons[link.platform] || platformIcons.globe;
                                        return (
                                            <a 
                                                key={idx} 
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-[#141820] border border-gray-800 rounded-2xl hover:border-gray-700 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-black/40 rounded-xl">
                                                        <Icon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-bold capitalize">{link.platform}</span>
                                                </div>
                                                <Globe className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Main Content Areas / Right Column */}
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                                <h3 className="text-xl font-black uppercase tracking-tight">Cultural Heritage Portfolio</h3>
                                <div className="flex gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                                    <span className="text-red-500 border-b-2 border-red-500 pb-1">All Content</span>
                                    <span className="hover:text-white cursor-pointer transition-colors pb-1">Recordings</span>
                                    <span className="hover:text-white cursor-pointer transition-colors pb-1">Artifacts</span>
                                </div>
                            </div>
                            
                            {/* Content Grid Placeholder */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(id => (
                                    <div key={id} className="aspect-video bg-[#141820] border border-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
                                        <Award className="w-8 h-8 text-gray-800" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
