'use client';

import React, { useEffect, useState } from 'react';
import DashboardWrapper from '@/components/Dashboard/DashboardWrapper';
import PendingState from '@/components/Dashboard/PendingState';
import { Loader2 } from 'lucide-react';

export default function CreatorPendingPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const visitorId = localStorage.getItem('sawaflix_visitor_id');
                const res = await fetch('/api/creator/profile', {
                    headers: visitorId ? { 'x-visitor-id': visitorId } : {}
                });
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <DashboardWrapper>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            </DashboardWrapper>
        );
    }

    if (error) {
        return (
            <DashboardWrapper>
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-md mx-auto my-12">
                    <h3 className="text-red-500 font-black text-xl mb-2">Connection Issue</h3>
                    <p className="text-gray-400 mb-6 font-medium">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-2.5 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-all"
                    >
                        Retry Connection
                    </button>
                </div>
            </DashboardWrapper>
        );
    }

    return (
        <DashboardWrapper>
            <div className="min-h-[80vh]">
                <PendingState userProfile={profile} />
            </div>
        </DashboardWrapper>
    );
}
