import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Step5Summary = ({ formData, onSubmit, isSubmitting = false }) => {
    const { category, identity, professional, portfolio, documents } = formData;

    const SummarySection = ({ title, children, icon }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 relative overflow-hidden group hover:border-red-500/30 hover:bg-white/10 transition-all shadow-inner">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 shadow-inner">
                    {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
                </div>
                <h3 className="text-base font-black tracking-widest uppercase text-white">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {children}
            </div>
        </div>
    );

    const SummaryItem = ({ label, value }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-zinc-200 font-bold text-sm truncate">{value || 'Not provided'}</p>
        </div>
    );

    return (
        <div className="space-y-6 relative">
            {/* Submitting Overlay */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md rounded-2xl"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-zinc-700" />
                                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-red-500 animate-spin" />
                                <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-b-red-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-white font-black text-sm uppercase tracking-[0.2em]">Submitting Application</p>
                                <p className="text-zinc-400 text-xs font-medium">Please wait while we process your verification...</p>
                            </div>
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center sm:text-left space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Review & <span className="text-red-500">Submit</span></h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">Please review all your details carefully before final submission.</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <SummarySection
                    title="Creator Profile"
                    icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>}
                >
                    <SummaryItem label="Category" value={category} />
                    <SummaryItem label="Legal Name" value={identity.legalName} />
                    <SummaryItem label="Creator Name" value={identity.creatorName} />
                    <SummaryItem label="Ethnic Group" value={identity.ethnicGroup} />
                    <SummaryItem label="Phone" value={identity.phone} />
                    <SummaryItem label="Email" value={identity.email} />
                </SummarySection>

                <SummarySection
                    title="Expertise"
                    icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" /></svg>}
                >
                    <SummaryItem label="Languages" value={professional.languages} />
                    <SummaryItem label="Experience" value={professional.experienceTime} />
                    <div className="col-span-1 sm:col-span-2">
                        <SummaryItem label="Professional Bio" value={professional.bio} />
                    </div>
                </SummarySection>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner">
                    <p className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-3">Portfolio & Documents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                        {(portfolio.recordings || []).map((rec, i) => (
                            <div key={i} className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <p className="text-[10px] font-black text-red-500 mb-1 uppercase tracking-wider">Entry {i + 1}</p>
                                <p className="font-bold text-zinc-200 text-xs truncate mb-0.5">{rec.title || 'Untitled'}</p>
                                {rec.file_name && <p className="text-zinc-500 text-[10px] truncate">{rec.file_name}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <div className="w-8 h-8 shrink-0 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center border border-green-500/30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-zinc-200 font-bold text-xs truncate">{documents.id_name || 'ID Uploaded'}</p>
                                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Gov ID</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <div className="w-8 h-8 shrink-0 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center border border-blue-500/30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-zinc-200 font-bold text-xs truncate">{documents.endorsements_name || 'No Endorsements'}</p>
                                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Optional</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center pt-4 space-y-5">
                <label className="flex items-center gap-3 cursor-pointer group px-4">
                    <input type="checkbox" required className="w-5 h-5 bg-zinc-900 border-white/20 rounded-md checked:bg-red-600 transition-all cursor-pointer accent-red-600 focus:ring-red-600 focus:ring-offset-zinc-950" />
                    <span className="text-zinc-400 group-hover:text-zinc-300 text-xs font-medium leading-tight transition-colors">I confirm all provided information is accurate and I agree to the <a href="#" className="text-red-500 hover:text-red-400 underline">Terms of Service</a>.</span>
                </label>

                <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto min-w-[300px] py-4 px-8 text-white font-black text-sm rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                        isSubmitting 
                            ? 'bg-zinc-700 cursor-not-allowed opacity-70' 
                            : 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Verification'
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default Step5Summary;
