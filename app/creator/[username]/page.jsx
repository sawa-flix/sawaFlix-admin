'use client';

import React, { useEffect, useState } from 'react';
import ProfileView from '@/components/profile/ProfileView';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { Loader2, AlertCircle, Edit3, Eye } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function PublicProfilePage({ params }) {
    const [profile, setProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch public profile
                const profileRes = await fetch(`/api/creator/${params.username}`);
                if (!profileRes.ok) {
                    const data = await profileRes.json();
                    throw new Error(data.error || 'Failed to fetch creator profile');
                }
                const profileData = await profileRes.json();
                setProfile(profileData);

                // Fetch current user session
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.username) {
            fetchData();
        }
    }, [params.username, supabase.auth]);

    const handleSave = async (updatedData) => {
        setSaving(true);
        try {
            const res = await fetch('/api/creator/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to save profile');

            const newData = await res.json();
            setProfile(newData.data || updatedData);
            setIsEditing(false);
            router.refresh(); // Refresh to update layout data if needed
        } catch (err) {
            console.error(err);
            alert('Error saving profile: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0E14] gap-4">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Retrieving Creator Profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0E14] p-6 text-center">
                <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-white mb-4">Profile Unavailable</h1>
                <p className="text-gray-400 mb-8 max-w-md font-medium leading-relaxed italic">
                    "{error}"
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="px-8 py-3 border border-gray-800 text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-all"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/login"
                        className="px-8 py-3 bg-red-600 text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                    >
                        Creator Login
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = currentUser && (profile?.id === currentUser.id || profile?.userId === currentUser.id);

    return (
        <div className="relative">
            {isOwner && (
                <div className="fixed bottom-10 right-10 z-[100]">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl group"
                    >
                        {isEditing ? (
                            <>
                                <Eye className="w-5 h-5 text-red-600" />
                                <span>Preview Profile</span>
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-5 h-5 text-red-600" />
                                <span>Edit My Profile</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {isEditing ? (
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tight">Edit Your <span className="text-red-500">Creator Hub</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Craft your public persona and social presence</p>
                    </div>
                    <EditProfileForm
                        initialData={profile}
                        onSave={handleSave}
                        isSaving={saving}
                    />
                </div>
            ) : (
                <ProfileView profile={profile} />
            )}
        </div>
    );
}
