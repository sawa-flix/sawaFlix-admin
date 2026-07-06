'use client';
import React from 'react';
import { 
    Clock, 
    Lock, 
    ShieldCheck, 
    CheckCircle2, 
    HelpCircle, 
    Play, 
    Maximize2, 
    Check 
} from 'lucide-react';
import SawaflixLogo from '../SawaflixLogo';

const DetailRow = ({ label, value }) => (
    <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 font-bold text-sm">{label}:</span>
        <span className="text-gray-300 font-semibold text-sm text-right w-1/2 break-words">{value || 'Not provided'}</span>
    </div>
);

const PendingState = ({ userProfile }) => {
    // Extract actual user data gracefully
    const formData = userProfile?.formData || {};
    const identity = formData.identity || {};
    const professional = formData.professional || {};
    
    // Safely mapping fallback dummy data if actual fields are empty to match mock exactly
    const name = identity.legalName || identity.creatorName || userProfile?.displayName || 'Koocee';
    const email = identity.email || userProfile?.email || 'koocee@gmail.com';
    const dob = identity.dob || 'May 3, 2000';
    const location = identity.ethnicGroup || identity.residenceArea || 'Bamenda';
    
    const category = userProfile?.category || 'Musician';
    const experience = professional.experienceTime || professional.yearsOfExperience || '10 Years';
    const bio = professional.bio || 'dlsjdf i skdjflkj klsjdfje\nasdfasf afsdaf asfasf';

    return (
        <div className="min-h-screen bg-[#0B0F19] md:p-12 p-6 flex flex-col items-center justify-start text-white font-sans animate-in fade-in duration-500">
            {/* Header Branding */}
            <div className="w-full max-w-5xl mb-12">
                <SawaflixLogo />
            </div>

            <div className="w-full max-w-4xl space-y-16 pb-24">
                {/* Lock Graphic & Notice Area */}
                <div className="flex flex-col items-center text-center space-y-6 relative">
                    {/* Mock Illustration Area */}
                    <div className="relative w-48 h-32 mb-4 bg-gradient-to-t from-gray-800/10 to-transparent rounded-full flex items-center justify-center">
                        <div className="absolute bg-[#1A1F2B] p-4 rounded-xl shadow-2xl -rotate-12 border border-white/5 right-12 z-0">
                            <div className="w-16 h-20 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                                <span className="text-gray-600 text-xs">A</span>
                            </div>
                        </div>
                        <div className="absolute z-10 bg-gradient-to-b from-[#1E2536] to-[#141820] p-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-center">
                            <Lock className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute top-8 left-12 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-xl z-20">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Application Is Under Review</h1>
                    
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-red-600 rounded-full shadow-lg shadow-red-600/20">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white tracking-wide">Under Review</span>
                    </div>
                    
                    <p className="text-gray-200 text-sm font-semibold max-w-xl text-center leading-relaxed">
                        Thank you for applying to be a SAWALIX Creator. Our team is currently reviewing your submission.<br/>This usually takes 5 days
                    </p>
                </div>

                {/* Your Submitted Information */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight text-white">Your Submitted Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Identity Panel */}
                        <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">Identity Information</h3>
                            <div className="w-full h-px bg-white/10 mb-6" />
                            <div className="space-y-1">
                                <DetailRow label="Name" value={name} />
                                <DetailRow label="Email" value={email} />
                                <DetailRow label="Date Of Birth" value={dob} />
                                <DetailRow label="Location" value={location} />
                            </div>
                        </div>

                        {/* Professional Profile Panel */}
                        <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">Professional Profile</h3>
                            <div className="w-full h-px bg-white/10 mb-6" />
                            <div className="space-y-1">
                                <DetailRow label="Category" value={category} />
                                <DetailRow label="Experience" value={experience} />
                                <DetailRow label="Bio" value={bio} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Uploads and ID */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight text-white">Your Uploads and ID</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Sample Uploads */}
                        <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl md:col-span-3">
                            <h3 className="text-xl font-bold text-white mb-6">Sample Uploads</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2].map((i) => {
                                    const rec = Array.isArray(formData.portfolio?.recordings) ? formData.portfolio.recordings[i-1] : null;
                                    return (
                                        <div key={i} className="group relative aspect-video bg-black rounded-lg overflow-hidden shadow-inner border border-white/5">
                                            {rec?.file_url ? (
                                                <video 
                                                    src={rec.file_url} 
                                                    className="w-full h-full object-cover opacity-80"
                                                />
                                            ) : (
                                                <img 
                                                    src={`https://images.unsplash.com/photo-${i === 1 ? '1514525253344-f814d074e015' : '1511671782779-c97d3d27a1d4'}?w=800&q=80`} 
                                                    alt="Portfolio Media" 
                                                    className="w-full h-full object-cover opacity-80" 
                                                />
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                                <div className="flex items-center gap-3">
                                                    <Play className="w-4 h-4 text-white fill-current" />
                                                    <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                                                        <div className="absolute inset-y-0 left-0 w-1/3 bg-white rounded-full flex items-center justify-end">
                                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-white">1x</span>
                                                    <Maximize2 className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            {rec?.title && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
                                                    {rec.title}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Document */}
                        <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl md:col-span-2">
                            <h3 className="text-xl font-bold text-white mb-6">Document</h3>
                            <div className="aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-4">
                                {/* CV Mock Illustration */}
                                <div className="w-full h-full bg-gray-50 border border-gray-200 shadow-md p-4 text-black flex flex-col pt-6 relative">
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gray-800" />
                                    <div className="text-[8px] font-black text-center mb-4 tracking-widest uppercase">Curriculum Vitae</div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-14 bg-gray-300 rounded overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="CV Face" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="h-2 w-20 bg-gray-800 rounded" />
                                            <div className="h-1 w-24 bg-gray-400 rounded" />
                                            <div className="h-1 w-16 bg-gray-400 rounded" />
                                            <div className="h-1 w-24 bg-gray-400 rounded" />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-1.5 flex-1">
                                        <div className="h-1.5 w-16 bg-gray-800 rounded" />
                                        <div className="h-1 w-full bg-gray-300 rounded" />
                                        <div className="h-1 w-full bg-gray-300 rounded" />
                                        <div className="h-1 w-5/6 bg-gray-300 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Progress */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight text-white">Review Progress</h2>
                    <div className="bg-[#141820] border border-white/5 rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-2xl overflow-x-auto relative">
                        {/* Status timeline line */}
                        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-gray-800 -translate-y-1/2 hidden md:block z-0" />
                        
                        <div className="flex flex-col md:flex-row items-center w-full justify-between relative z-10 gap-6 md:gap-0">
                            {/* Step 1 */}
                            <div className="flex flex-row md:flex-row items-center gap-3 bg-[#141820] px-4 md:pr-12">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-6 h-6 text-[#141820]" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-wide">Application submitted</span>
                            </div>

                            {/* Step 2 (Active) */}
                            <div className="flex flex-row md:flex-row items-center gap-3 bg-[#141820] px-4">
                                <Clock className="w-10 h-10 text-red-600" />
                                <span className="text-sm font-bold text-red-600 tracking-wide">Under Review</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-row md:flex-row items-center gap-3 bg-[#141820] px-4 md:pl-12">
                                <div className="w-10 h-10 border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl pb-1">?</div>
                                <span className="text-sm font-bold text-gray-300 tracking-wide">Final Decision</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    {/* What Happens Next */}
                    <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">What Happens Next</h3>
                        <div className="w-full h-px bg-white/10 mb-6" />
                        <ul className="space-y-3 text-gray-400 font-semibold text-sm list-disc pl-5 marker:text-gray-600">
                            <li>We review your content for quality and originality</li>
                            <li>We evaluate your category fit</li>
                            <li>You will receive an email once our review is complete</li>
                        </ul>
                    </div>

                    {/* Need Help */}
                    <div className="bg-[#141820] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
                            <div className="w-full h-px bg-white/10 mb-6" />
                            <p className="text-gray-400 font-semibold text-sm mb-2">Have any questions?</p>
                            <p className="text-gray-400 font-semibold text-sm mb-6">contact our support team.</p>
                        </div>
                        <div>
                            <button className="flex items-center gap-3 px-6 py-2.5 bg-white text-red-600 hover:bg-gray-100 transition-colors rounded-full font-bold text-sm shadow-xl w-max">
                                <div className="w-5 h-5 flex items-center justify-center text-red-600 font-bold border-2 border-red-600 rounded-full text-xs">
                                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingState;
