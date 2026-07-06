import React from 'react';

const Step1Identity = ({ data, errors, updateData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Tell us about yourself</h2>
                <p className="text-gray-400">Help us understand your creative identity and passion</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="legalName"
                        value={data.legalName || ''}
                        onChange={handleChange}
                        placeholder="Your legal name"
                        className={`w-full bg-[#0B0E14] border ${errors?.legalName ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                    />
                    {errors?.legalName && <p className="mt-2 text-sm text-red-500">{errors.legalName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Creator Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="creatorName"
                        value={data.creatorName || ''}
                        onChange={handleChange}
                        placeholder="Your stage or creator name"
                        className={`w-full bg-[#0B0E14] border ${errors?.creatorName ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                    />
                    {errors?.creatorName && <p className="mt-2 text-sm text-red-500">{errors.creatorName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Community / Ethnic Group <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="ethnicGroup"
                        value={data.ethnicGroup || ''}
                        onChange={handleChange}
                        placeholder="ethnic group or community name"
                        className={`w-full bg-[#0B0E14] border ${errors?.ethnicGroup ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                    />
                    {errors?.ethnicGroup && <p className="mt-2 text-sm text-red-500">{errors.ethnicGroup}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={data.phone || ''}
                            onChange={handleChange}
                            placeholder="your phone number"
                            className={`w-full bg-[#0B0E14] border ${errors?.phone ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                        />
                        {errors?.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email || ''}
                            onChange={handleChange}
                            placeholder="your email"
                            className={`w-full bg-[#0B0E14] border ${errors?.email ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                        />
                        {errors?.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 flex gap-4 transition-all hover:bg-red-900/20">
                <div className="w-10 h-10 flex-shrink-0 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold">Verified Creator Benefits</h4>
                    <p className="text-sm text-gray-400">Get verified badge, priority support, and enhanced discovery for your authentic content.</p>
                </div>
            </div>
        </div>
    );
};

export default Step1Identity;
