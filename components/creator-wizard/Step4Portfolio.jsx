import React, { useState } from 'react';
import { uploadFile } from '../../lib/verification';

const FieldError = ({ message }) => message ? (
    <p className="text-red-400 text-[10px] mt-2 ml-2 font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {message}
    </p>
) : null;

const inputClass = "w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-500/50 transition-all font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 shadow-inner";
const textAreaClass = "w-full text-white text-xs font-medium placeholder-zinc-600 focus:outline-none resize-none rounded-xl p-3 bg-white/5 border border-white/10 hover:bg-white/10 focus:ring-2 focus:ring-red-600/20 focus:border-red-500/50 shadow-inner transition-all";

    const Step4Portfolio = ({ data, documents, updatePortfolio, updateDocuments, errors = {}, showModal }) => {
    const recordings = data.recordings || [{}, {}, {}];
    const [uploading, setUploading] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const handleRecordingChange = (index, field, value) => {
        const newRecordings = [...recordings];
        newRecordings[index] = { ...newRecordings[index], [field]: value };
        updatePortfolio({ recordings: newRecordings });
    };

    const handleFileUpload = async (type, file, index = null) => {
        const key = index !== null ? `rec${index}` : type;
        setUploading(prev => ({ ...prev, [key]: true }));
        try {
            const { url } = await uploadFile(file, index !== null ? 'recording' : type);
            if (index !== null) {
                handleRecordingChange(index, 'file_url', url);
                handleRecordingChange(index, 'file_name', file.name);
            } else {
                updateDocuments({ [`${type}_url`]: url, [`${type}_name`]: file.name });
            }
        } catch (error) {
            console.error("Upload failed", error);
            showModal('error', 'Upload Failed', error.message || 'We could not upload your file at this time.');
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Show Us Your Voice</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">Submit sample recordings of your craft to help us understand your storytelling style and impact.</p>
                <p className="text-zinc-500 text-[10px] sm:text-xs italic font-medium tracking-tight mt-1">Samples are optional but highly recommended.</p>
            </div>

            {/* Cards container */}
            <div className="rounded-3xl p-5 sm:p-6 space-y-6 bg-zinc-900/40 border border-white/5 shadow-inner">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {[0, 1, 2].map((index) => {
                        const rec = recordings[index] || {};
                        const hasData = rec.file_name || rec.title || rec.description || rec.significance;
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === index 
                                        ? 'bg-red-600/20 text-red-500 border border-red-500/30 shadow-lg' 
                                        : 'bg-zinc-800/50 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-zinc-300'
                                }`}
                            >
                                Sample {index + 1}
                                {hasData && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Sample Form */}
                <div className="animate-in fade-in zoom-in-95 duration-200">
                    {(() => {
                        const index = activeTab;
                        const rec = recordings[index] || {};
                        const isUploading = uploading[`rec${index}`];

                        return (
                            <div className="rounded-2xl p-6 flex flex-col gap-6 bg-zinc-800/30 border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                                {/* Upload file button */}
                                <div>
                                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2 ml-1">Media File</label>
                                    <div className="relative group">
                                        <label className={`flex items-center justify-center gap-3 w-full py-6 rounded-2xl cursor-pointer text-sm font-bold transition-all border-2 border-dashed ${
                                            isUploading ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10' : 
                                            rec.file_name ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20' : 
                                            'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.99] shadow-inner'
                                        }`}>
                                            {isUploading ? (
                                                <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                            ) : rec.file_name ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            )}
                                            {rec.file_name ? 'File Attached: ' + rec.file_name : (isUploading ? 'Uploading Media...' : 'Click to Upload Audio or Video File')}
                                            <input
                                                type="file"
                                                disabled={isUploading}
                                                accept="audio/*,video/*"
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) handleFileUpload('recording', file, index);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2 ml-1">Piece Title</label>
                                        <input
                                            type="text"
                                            value={rec.title || ''}
                                            onChange={(e) => handleRecordingChange(index, 'title', e.target.value)}
                                            className={`${inputClass} text-base py-4`}
                                            placeholder="What is the name of this piece?"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2 ml-1">Description</label>
                                        <textarea
                                            value={rec.description || ''}
                                            onChange={(e) => handleRecordingChange(index, 'description', e.target.value)}
                                            placeholder="The story behind this creation..."
                                            rows={4}
                                            className={textAreaClass}
                                        />
                                    </div>

                                    {/* Significance */}
                                    <div>
                                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2 ml-1">Significance</label>
                                        <textarea
                                            value={rec.significance || ''}
                                            onChange={(e) => handleRecordingChange(index, 'significance', e.target.value)}
                                            placeholder="Why did you choose to highlight this piece?"
                                            rows={4}
                                            className={textAreaClass}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-2">
                                    <button 
                                        onClick={() => setActiveTab((prev) => (prev < 2 ? prev + 1 : 0))}
                                        className="text-[10px] uppercase tracking-widest font-black text-red-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                                    >
                                        {activeTab < 2 ? 'Next Sample' : 'Back to Sample 1'}
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Government ID & Documents */}
            <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Verification Documents <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Required: Gov ID */}
                    <div>
                        <div
                            className={`relative rounded-2xl p-4 flex items-center gap-4 cursor-pointer overflow-hidden transition-all group ${uploading.id ? 'opacity-50 cursor-not-allowed' : ''} ${
                                errors.id ? 'bg-red-950/20 border-red-500/50 hover:bg-red-950/30' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            } border shadow-inner`}
                        >
                            <input 
                                type="file" 
                                disabled={uploading.id}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleFileUpload('id', file);
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                            />
                            <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors ${errors.id ? 'bg-red-500/20 text-red-500' : 'bg-red-600/20 text-red-500 group-hover:bg-red-600/30 group-hover:text-red-400'}`}>
                                {uploading.id ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{documents.id_name || (uploading.id ? 'Uploading...' : 'Government ID')}</p>
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-0.5">Required for Verification</p>
                            </div>
                        </div>
                        <FieldError message={errors.id} />
                    </div>

                    {/* Optional: Endorsements */}
                    <div>
                        <div className={`relative rounded-2xl p-4 flex items-center gap-4 cursor-pointer overflow-hidden transition-all group ${uploading.endorsements ? 'opacity-50 cursor-not-allowed' : ''} bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-inner`}>
                            <input 
                                type="file" 
                                disabled={uploading.endorsements}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleFileUpload('endorsements', file);
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                            />
                            <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center bg-zinc-800/80 text-zinc-400 transition-colors group-hover:bg-zinc-700/80 group-hover:text-white">
                                {uploading.endorsements ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{documents.endorsements_name || (uploading.endorsements ? 'Uploading...' : 'Letters of Endorsement')}</p>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider mt-0.5">Optional</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Streaming & Social Links */}
            <div className="mt-8">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Streaming & Creative Platforms <span className="text-xs lowercase text-zinc-600 font-medium ml-2 tracking-normal">(e.g. Spotify, YouTube)</span></p>
                <div className="space-y-3">
                    {[0, 1, 2].map((index) => {
                        const linkStr = (data.links && data.links[index]) || '';
                        return (
                            <div key={`link-${index}`} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={linkStr}
                                    onChange={(e) => {
                                        const newLinks = [...(data.links || ['', '', ''])];
                                        newLinks[index] = e.target.value;
                                        updatePortfolio({ links: newLinks });
                                    }}
                                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-500/50 shadow-inner transition-all"
                                    placeholder={`Platform Link ${index + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <FieldError message={errors.recordings} />
        </div>
    );
};

export default Step4Portfolio;


