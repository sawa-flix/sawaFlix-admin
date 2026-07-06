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

const Step2Identity = ({ data, updateData, errors = {} }) => {
    // Standard list of Cameroonian ethnic groups
    const standardEthnicGroups = ['Bamiléké', 'Beti', 'Kirdi', 'Sawa', 'Fulani', 'Tikar', 'Bassa', 'Bakweri', 'Maka', 'Douala', 'Other'];
    const [isCustomEthnic, setIsCustomEthnic] = useState(
        data.ethnicGroup && !standardEthnicGroups.includes(data.ethnicGroup) && data.ethnicGroup !== 'Other'
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    const handleSelectChange = (value) => {
        if (value === 'Other') {
            setIsCustomEthnic(true);
            updateData({ ethnicGroup: '' });
        } else {
            setIsCustomEthnic(false);
            updateData({ ethnicGroup: value });
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Tell us about yourself</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">We need your real identity details to verify your account securely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="legalName"
                        value={data.legalName || ''}
                        onChange={handleChange}
                        placeholder="Your legal name"
                        className={inputClass(!!errors.legalName)}
                    />
                    <FieldError message={errors.legalName} />
                </div>

                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Creator Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="creatorName"
                        value={data.creatorName || ''}
                        onChange={handleChange}
                        placeholder="Stage name or handle"
                        className={inputClass(!!errors.creatorName)}
                    />
                    <FieldError message={errors.creatorName} />
                </div>

                <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Community / Ethnic Group <span className="text-red-500">*</span>
                    </label>
                    
                    {!isCustomEthnic ? (
                        <WizardSelect
                            value={data.ethnicGroup}
                            onChange={handleSelectChange}
                            options={standardEthnicGroups}
                            placeholder="Select your community..."
                            error={!!errors.ethnicGroup}
                        />
                    ) : (
                        <div className="space-y-3">
                            <WizardSelect
                                value="Other"
                                onChange={handleSelectChange}
                                options={standardEthnicGroups}
                                placeholder="Select your community..."
                                error={false}
                            />
                            <input
                                type="text"
                                name="ethnicGroup"
                                value={data.ethnicGroup || ''}
                                onChange={handleChange}
                                placeholder="Please specify your ethnic group..."
                                className={inputClass(!!errors.ethnicGroup)}
                                autoFocus
                            />
                        </div>
                    )}
                    <FieldError message={errors.ethnicGroup} />
                </div>

                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className={inputClass(!!errors.phone)}
                    />
                    <FieldError message={errors.phone} />
                </div>

                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={data.email || ''}
                        onChange={handleChange}
                        placeholder="creator@example.com"
                        className={inputClass(!!errors.email)}
                    />
                    <FieldError message={errors.email} />
                </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-linear-to-br from-zinc-800/30 to-transparent border border-white/5">
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-zinc-800/50">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="pt-0.5">
                    <h4 className="font-black text-zinc-300 text-xs tracking-wider uppercase mb-1.5">Privacy First</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">Your legal details are securely stored. Only your Creator Name is shown to the public.</p>
                </div>
            </div>
        </div>
    );
};

export default Step2Identity;
