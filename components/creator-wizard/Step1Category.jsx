import React from 'react';

const categories = [
    { id: 'music', label: 'Music', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg> },
    { id: 'film', label: 'Film', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9H3V5h9v7z" /></svg> },
    { id: 'comedy', label: 'Comedy', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 14.29c-.61.24-1.26.37-1.93.37-2.48 0-4.38-1.49-5.25-3.98h7.49l.56-1.73H8.77c-.04-.26-.06-.53-.06-.8s.03-.54.07-.81h8.43l.56-1.73H9.25c.87-2.47 2.76-3.95 5.24-3.95.67 0 1.32.13 1.93.37l1.38-1.76c-.97-.44-2.04-.67-3.17-.67-3.85 0-7.02 2.38-8.36 5.98H4.5l-.57 1.73h1.6c-.04.27-.06.53-.06.81 0 .28.02.54.06.8H4.5l-.57 1.73h1.72c1.34 3.64 4.52 6.04 8.37 6.04 1.13 0 2.2-.23 3.17-.67l-1.38-1.79z" /></svg> },
    { id: 'storyteller', label: 'Traditional Storyteller', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg> },
    { id: 'lifestyle', label: 'Food & Lifestyle', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8.17-15.06-8.17-15.06 0h15.06z" /></svg> },
];

const FieldError = ({ message }) => message ? (
    <p className="text-red-400 text-[10px] mt-2 ml-2 font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {message}
    </p>
) : null;

const Step1Category = ({ data, updateData, errors = {} }) => {
    const selectedCategory = data.category;

    const handleSelect = (id) => {
        updateData({ category: id });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Choose Your Category</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">Help us understand your creative identity and passion.</p>
            </div>

            <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 ml-1">Creator Type <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleSelect(cat.id)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-left group border ${
                                    isSelected 
                                    ? 'bg-red-600/10 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.15)] ring-1 ring-red-500/50' 
                                    : errors.category 
                                        ? 'bg-red-950/10 border-red-500/30' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                                <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                    isSelected ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10'
                                }`}>
                                    {React.cloneElement(cat.icon, { className: "w-5 h-5" })}
                                </span>
                                <span className={`text-sm font-bold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <FieldError message={errors.category} />
            </div>

            {/* Benefits Box */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-linear-to-br from-red-600/10 to-transparent border border-red-500/20">
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-red-600/20 shadow-inner">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div className="pt-0.5">
                    <h4 className="font-black text-red-400 text-xs tracking-wider uppercase mb-1.5">Verified Creator Benefits</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">Get a verified badge, priority support, and enhanced discovery tools for your authentic cultural content.</p>
                </div>
            </div>
        </div>
    );
};

export default Step1Category;
