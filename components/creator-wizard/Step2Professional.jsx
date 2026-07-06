import React from 'react';

const Step2Professional = ({ data, errors, updateData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Tell us more about your background</h2>
                <p className="text-gray-400">Your professional experience helps us categorize your work</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Languages Used <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="languages"
                        value={data.languages || ''}
                        onChange={handleChange}
                        placeholder="e.g. English, Swahili, French"
                        className={`w-full bg-[#0B0E14] border ${errors?.languages ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                    />
                    {errors?.languages && <p className="mt-2 text-sm text-red-500">{errors.languages}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Experience Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="experienceTime"
                        value={data.experienceTime || ''}
                        onChange={handleChange}
                        placeholder="e.g. 5 years of documenting oral histories"
                        className={`w-full bg-[#0B0E14] border ${errors?.experienceTime ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                    />
                    {errors?.experienceTime && <p className="mt-2 text-sm text-red-500">{errors.experienceTime}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Professional Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="bio"
                        rows={5}
                        value={data.bio || ''}
                        onChange={handleChange}
                        placeholder="A brief explanation of your background and experiences..."
                        className={`w-full bg-[#0B0E14] border ${errors?.bio ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none`}
                    />
                    <div className="flex justify-between mt-2">
                        {errors?.bio ? <p className="text-sm text-red-500">{errors.bio}</p> : <div />}
                        <p className="text-xs text-gray-500">{(data.bio || '').length}/500 characters</p>
                    </div>
                </div>
            </div>

            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 flex gap-4 transition-all hover:bg-red-900/20">
                <div className="w-10 h-10 flex-shrink-0 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold">Why bio matters?</h4>
                    <p className="text-sm text-gray-400">Your bio gives other creators and the community a sense of who you are and what you stand for.</p>
                </div>
            </div>
        </div>
    );
};

export default Step2Professional;
