import React from 'react';
import { XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const RejectedState = ({ feedback }) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full bg-[#141820] border border-red-900/30 rounded-2xl p-8 text-center shadow-xl">
                <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-white mb-3">Action Required</h1>
                <p className="text-red-400 font-bold mb-4 uppercase tracking-widest text-xs">Verification Status: Rejected</p>
                
                <div className="bg-red-600/5 rounded-xl p-4 mb-8 text-left border border-red-900/20">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Feedback from Reviewer</span>
                    </div>
                    <p className="text-gray-300 text-sm italic leading-relaxed">
                        "{feedback || "The provided documents were not clear or didn't sufficiently demonstrate your cultural connection as a creator."}"
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Link 
                        href="/creator/verify"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 hover:scale-[1.02] transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Update & Resubmit
                    </Link>
                    <button className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectedState;
