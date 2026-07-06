import React from 'react';
import { motion } from 'framer-motion';

const Step3Portfolio = ({ data, errors, updateData }) => {
    const recordings = data.recordings || [{}, {}, {}]; // Default 3 slots
    const portfolioLinks = data.portfolioLinks || [''];

    const handleRecordingChange = (index, field, value) => {
        const newRecordings = [...recordings];
        newRecordings[index] = { ...newRecordings[index], [field]: value };
        updateData({ recordings: newRecordings });
    };

    const handleLinkChange = (index, value) => {
        const newLinks = [...portfolioLinks];
        newLinks[index] = value;
        updateData({ portfolioLinks: newLinks });
    };

    const addLink = () => {
        updateData({ portfolioLinks: [...portfolioLinks, ''] });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2 text-center">Show Us Your Voice. Tell Us Your Story</h2>
                <p className="text-gray-400 text-center mb-8">Submit at least 3 sample recordings. Your recordings help us understand your storytelling style, originality and impact.</p>
            </div>

            {/* Recordings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recordings.map((rec, index) => (
                    <div key={index} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 relative group hover:border-red-900/50 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-300">Sample Recording {index + 1}</h4>
                            <div className="text-yellow-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mb-4">
                            <button className="w-full py-3 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-600/50 transition-all flex flex-col items-center gap-2 group">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Upload file</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    value={rec.title || ''}
                                    onChange={(e) => handleRecordingChange(index, 'title', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-800 py-2 focus:border-red-600 outline-none transition-all"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    value={rec.description || ''}
                                    onChange={(e) => handleRecordingChange(index, 'description', e.target.value)}
                                    className="w-full bg-[#151C25] border border-gray-800 rounded-lg p-2 text-sm h-16 resize-none focus:border-red-600 outline-none"
                                    placeholder="Tell us the story behind this recording..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Significance</label>
                                <textarea
                                    value={rec.significance || ''}
                                    onChange={(e) => handleRecordingChange(index, 'significance', e.target.value)}
                                    className="w-full bg-[#151C25] border border-gray-800 rounded-lg p-2 text-sm h-16 resize-none focus:border-red-600 outline-none"
                                    placeholder="Why is this piece important?"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-gray-500 text-sm italic">minimum 3 recordings required</p>

            {/* Portfolio Links */}
            <div className="mt-12 bg-[#0B0E14] p-8 rounded-2xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Portfolio Links
                </h3>
                <div className="space-y-4">
                    {portfolioLinks.map((link, index) => (
                        <input
                            key={index}
                            type="url"
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://behance.net/your-profile"
                            className="w-full bg-[#151C25] border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                        />
                    ))}
                    <button
                        onClick={addLink}
                        className="text-red-500 text-sm font-bold hover:text-red-400 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Add another link
                    </button>
                </div>
            </div>

            {errors?.recordings && <p className="text-center text-red-500 mt-4">{errors.recordings}</p>}
        </div>
    );
};

export default Step3Portfolio;
