'use client';

import React, { useState, useEffect } from 'react';
import { Camera, User, Link as LinkIcon, BadgeCheck, AlertCircle, Save, Globe, X, Plus, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadFile } from '../../lib/verification';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileForm = ({ initialData, onSave, isSaving, verificationStatus, rejectionFeedback }) => {
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        profileImage: '',
        bannerImage: '',
        socialLinks: []
    });
    const [previews, setPreviews] = useState({ profile: '', banner: '' });
    const [uploading, setUploading] = useState({ profile: false, banner: false });
    const [socialInput, setSocialInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                displayName: initialData.displayName || '',
                bio: initialData.bio || '',
                profileImage: initialData.profileImage || '',
                bannerImage: initialData.bannerImage || '',
                socialLinks: initialData.socialLinks || []
            });
            setPreviews({
                profile: initialData.profileImage || '',
                banner: initialData.bannerImage || ''
            });
        }
    }, [initialData]);

    const handleAssetUpload = async (type, file) => {
        if (!file) return;
        
        // Local preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviews(prev => ({ ...prev, [type]: event.target.result }));
        };
        reader.readAsDataURL(file);
        
        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            // Updated to use the new backend categories
            const category = type === 'profile' ? 'profile_image' : 'cover_image';
            const res = await uploadFile(file, category);
            
            if (res && res.url) {
                setFormData(prev => ({ 
                    ...prev, 
                    [type === 'profile' ? 'profileImage' : 'bannerImage']: res.url 
                }));
            }
        } catch (err) {
            console.error('Upload Error:', err);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const addSocialLink = () => {
        if (!socialInput || formData.socialLinks.includes(socialInput)) return;
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, socialInput]
        }));
        setSocialInput('');
    };

    const removeSocialLink = (index) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="max-w-4xl mx-auto font-sans text-white antialiased pb-24">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Visual Identity Section */}
                <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    
                    {/* Banner Canvas */}
                    <div className="relative h-48 sm:h-56 bg-zinc-900 group">
                        {previews.banner ? (
                            <img 
                                src={previews.banner} 
                                alt="Banner"
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <ImageIcon size={48} className="text-zinc-600" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <label className="cursor-pointer flex flex-col items-center gap-2">
                                <div className="p-3 bg-white/10 rounded-full border border-white/25 hover:bg-white/20 transition-all">
                                    <Camera size={24} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Banner</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAssetUpload('banner', e.target.files[0])} />
                            </label>
                        </div>

                        {uploading.banner && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-1/2 h-full bg-red-600" 
                                        />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Uploading Banner</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Overlay Context */}
                    <div className="px-6 sm:px-12 pb-10 relative">
                        {/* Avatar Hub */}
                        <div className="relative -mt-20 sm:-mt-24 inline-block">
                            <div className="relative group">
                                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-8 border-[#0f172a] bg-zinc-900 overflow-hidden shadow-2xl relative z-20">
                                    {previews.profile ? (
                                        <img 
                                            src={previews.profile} 
                                            alt="Profile"
                                            className="w-full h-full object-cover aspect-square"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={48} className="text-zinc-700" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-30 backdrop-blur-sm">
                                        <label className="cursor-pointer flex flex-col items-center gap-1">
                                            <Camera size={24} className="text-white" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAssetUpload('profile', e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>

                                {uploading.profile && (
                                    <div className="absolute inset-0 z-40 flex items-center justify-center">
                                        <div className="w-10 h-10 border-3 border-red-600 border-t-transparent animate-spin rounded-full shadow-lg shadow-red-600/20 bg-black/40" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info Cards */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Identity Card */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 p-1">
                                    <Sparkles size={16} className="text-red-500" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Identity Details</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Creator Handle</label>
                                        <input 
                                            type="text" 
                                            value={formData.displayName}
                                            onChange={(e) => setFormData(p => ({ ...p, displayName: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-red-600/40 transition-all outline-none"
                                            placeholder="Pick a handle..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Creator Bio</label>
                                        <textarea 
                                            value={formData.bio}
                                            onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-medium text-zinc-300 focus:border-red-600/40 transition-all outline-none resize-none leading-relaxed"
                                            placeholder="Share your story..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence Card */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 p-1">
                                    <Globe size={16} className="text-red-500" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Online Presence</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Platform Link</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <input 
                                                    type="text" 
                                                    value={socialInput}
                                                    onChange={(e) => setSocialInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-[11px] text-white focus:border-red-600/40 transition-all outline-none font-bold"
                                                    placeholder="Spotify, YouTube, etc."
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={addSocialLink}
                                                className="p-4 bg-zinc-800 rounded-xl hover:bg-red-600 transition-all active:scale-95 shadow-lg"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <AnimatePresence>
                                            {formData.socialLinks.map((link, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] text-zinc-400 font-black group hover:border-red-600/20 transition-all"
                                                >
                                                    <span className="truncate max-w-[120px]">{link}</span>
                                                    <button type="button" onClick={() => removeSocialLink(i)} className="text-zinc-600 hover:text-white transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {formData.socialLinks.length === 0 && (
                                            <p className="text-[10px] text-zinc-600 font-bold italic ml-1">No links added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Control Bar at Bottom */}
                <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-[#030712]/80 backdrop-blur-xl border-t border-white/5 shadow-2xl lg:pl-[280px]">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Unsaved Changes</span>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button 
                                type="button"
                                onClick={() => window.location.href = '/dashboard'}
                                className="flex-1 sm:flex-none px-8 py-4 bg-zinc-800 rounded-2xl font-black text-xs text-white uppercase tracking-widest hover:bg-zinc-700 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving || uploading.profile || uploading.banner}
                                className="flex-1 sm:flex-none px-12 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
