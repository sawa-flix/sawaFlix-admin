import React from 'react';

const Step4Documents = ({ data, errors, updateData }) => {
    const handleFileChange = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            updateData({ [field]: file });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Verification Documents</h2>
                <p className="text-gray-400">Please provide the necessary documents to verify your identity and professional standing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ID Document */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-400">
                        Government Issued ID <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative group border-2 border-dashed ${errors?.idDocument ? 'border-red-500' : 'border-gray-800'} rounded-2xl p-8 transition-all hover:border-red-600/50 bg-[#0B0E14]`}>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('idDocument', e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-gray-500 group-hover:text-red-500 transition-colors">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.333 0 4 .667 4 2v1H5v-1c0-1.333 2.667-2 4-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold">{data.idDocument?.name || 'Upload Identity Document'}</p>
                                <p className="text-gray-500 text-sm mt-1">PDF, JPG or PNG (max 5MB)</p>
                            </div>
                            {data.idDocument && (
                                <div className="px-3 py-1 bg-green-900/30 text-green-500 text-xs font-bold rounded-full border border-green-800">
                                    Ready to upload
                                </div>
                            )}
                        </div>
                    </div>
                    {errors?.idDocument && <p className="text-sm text-red-500">{errors.idDocument}</p>}
                </div>

                {/* Endorsements */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-400">
                        Endorsement Letters (Optional)
                    </label>
                    <div className="relative group border-2 border-dashed border-gray-800 rounded-2xl p-8 transition-all hover:border-red-600/50 bg-[#0B0E14]">
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('endorsements', e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".pdf,.doc,.docx"
                            multiple
                        />
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-gray-500 group-hover:text-red-500 transition-colors">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold">{data.endorsements?.name || 'Upload Endorsements'}</p>
                                <p className="text-gray-500 text-sm mt-1">Submit letters of recommendation or proof of community standing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-6 flex gap-4 mt-8">
                <div className="w-12 h-12 flex-shrink-0 bg-yellow-600 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h11l4 4V13z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold text-yellow-500 uppercase tracking-wider text-sm mb-1">Privacy Notice</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Your documents are encrypted and stored securely. We only use them for verification purposes and will never share your private identification with other users.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step4Documents;
