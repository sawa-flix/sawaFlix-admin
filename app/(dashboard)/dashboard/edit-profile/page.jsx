'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { ProfileFormSkeleton } from '@/components/Dashboard/Skeletons';
import { ChevronLeft, CheckCircle, Plus } from 'lucide-react';
import StatusModal from '@/components/Dashboard/StatusModal';
import Link from 'next/link';

export default function EditProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalConfig, setModalConfig] = useState({ show: false, type: 'success', title: '', message: '' });
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/creator/profile');
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const showModal = (type, title, message) => {
        setModalConfig({ show: true, type, title, message });
    };

    const handleSave = async (updatedData) => {
        setSaving(true);
        try {
            const res = await fetch('/api/creator/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to save profile');
            
            showModal('success', 'Profile Updated', 'Your identity has been successfully synchronized.');
        } catch (err) {
            console.error(err);
            showModal('error', 'Update Failed', err.message || 'There was an error saving your changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] py-12 px-4 scrollbar-hide flex flex-col items-center">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="w-48 h-4 bg-zinc-800 rounded animate-pulse mb-6" />
                    <ProfileFormSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1729] selection:bg-red-500/30 font-sans">
            <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4 relative">
                {/* Visual Status Confirmation */}
                <StatusModal 
                    isOpen={modalConfig.show}
                    onClose={() => {
                        setModalConfig(prev => ({ ...prev, show: false }));
                        if (modalConfig.type === 'success') router.push('/dashboard');
                    }}
                    type={modalConfig.type}
                    title={modalConfig.title}
                    message={modalConfig.message}
                />

                <div className="flex items-center justify-between border-b border-white/5 pb-8 pt-4">
                    <div>
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-2 text-zinc-500 hover:text-red-500 text-sm font-bold mb-2 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tight">Update <span className="text-red-600">profile</span></h1>
                    </div>
                </div>

                <div className="transition-all duration-500">
                    <EditProfileForm 
                        initialData={profile} 
                        onSave={handleSave} 
                        isSaving={saving} 
                        verificationStatus={profile?.verificationStatus}
                        rejectionFeedback={profile?.rejectionFeedback}
                    />
                </div>

                {/* Fixed Rectangular 'Be a Creator' Action Bar - Restricted to Profile Page */}
                {profile?.verificationStatus === 'none' && (
                  <div className="fixed bottom-24 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-t border-red-600/30 shadow-[0_-30px_60px_-20px_rgba(220,38,38,0.4)] animate-in slide-in-from-bottom duration-500">
                    <div className="max-w-7xl mx-auto px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                          <span className="text-white font-black text-sm">sf+</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-white font-black text-sm tracking-wide">Ready to launch?</h5>
                          <p className="text-zinc-500 text-xs font-bold">Verified creators reach 10x more fans instantly</p>
                        </div>
                      </div>
                      <Link 
                        href="/creator/verify" 
                        className="w-full sm:w-auto px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-black tracking-wide text-sm transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 group rounded-xl"
                      >
                        create <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
}
