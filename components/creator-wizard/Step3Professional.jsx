import React, { useState } from 'react';
import WizardSelect from './WizardSelect';

const inputClass = (hasError) =>
    `w-full rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all font-bold text-sm bg-white/5 border hover:bg-white/10 ${
        hasError
            ? 'border-red-500/50 focus:ring-red-500/30'
            : 'border-white/10 focus:ring-red-600/20 focus:border-red-500/50'
    } shadow-inner`;

const FieldError = ({ message }) => message ? (
    <p className="text-red-400 text-[10px] mt-2 ml-2 font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {message}
    </p>
) : null;

const Step3Professional = ({ data, updateData, errors = {} }) => {
    // Standard list of languages
    const standardLanguages = ['English', 'Swahili', 'French', 'Yoruba', 'Igbo', 'Hausa', 'Zulu', 'Amharic', 'Arabic', 'Other'];
    const [isCustomLanguage, setIsCustomLanguage] = useState(
        data.languages && !standardLanguages.includes(data.languages) && data.languages !== 'Other'
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    const handleSelectChange = (value) => {
        if (value === 'Other') {
            setIsCustomLanguage(true);
            updateData({ languages: '' });
        } else {
            setIsCustomLanguage(false);
            updateData({ languages: value });
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your Expertise</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">Tell us about your professional background and cultural journey.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Languages <span className="text-red-500">*</span>
                    </label>

                    {!isCustomLanguage ? (
                        <WizardSelect
                            value={data.languages}
                            onChange={handleSelectChange}
                            options={standardLanguages}
                            placeholder="Select main language..."
                            error={!!errors.languages}
                        />
                    ) : (
                        <div className="space-y-3">
                            <WizardSelect
                                value="Other"
                                onChange={handleSelectChange}
                                options={standardLanguages}
                                placeholder="Select main language..."
                                error={false}
                            />
                            <input
                                type="text"
                                name="languages"
                                value={data.languages || ''}
                                onChange={handleChange}
                                placeholder="e.g. Portuguese, Spanish, etc."
                                className={inputClass(!!errors.languages)}
                                autoFocus
                            />
                        </div>
                    )}
                    <FieldError message={errors.languages} />
                </div>

                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="experienceTime"
                        value={data.experienceTime || ''}
                        onChange={handleChange}
                        placeholder="e.g. 5+ years"
                        className={inputClass(!!errors.experienceTime)}
                    />
                    <FieldError message={errors.experienceTime} />
                </div>

                <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Your Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="bio"
                        value={data.bio || ''}
                        onChange={handleChange}
                        placeholder="Tell us about your cultural journey, your inspirations, and what you aim to share..."
                        rows={4}
                        className={`${inputClass(!!errors.bio)} resize-none`}
                    />
                    <FieldError message={errors.bio} />
                </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-linear-to-br from-zinc-800/30 to-transparent border border-white/5">
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-zinc-800/50">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div className="pt-0.5">
                    <h4 className="font-black text-zinc-300 text-xs tracking-wider uppercase mb-1.5">Showcase Your Story</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">Your bio is your first impression. Make it count by highlighting what makes your content unique and authentic.</p>
                </div>
            </div>
        </div>
    );
};

export default Step3Professional;
