import React from 'react';
import { Play } from 'lucide-react';

const SawaflixLogo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2.5 group transition-all ${className}`}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-all">
                <Play className="w-5 h-5 text-white fill-current translate-x-px" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                Sawa<span className="text-red-600">flix</span>
            </span>
        </div>
    );
};

export default SawaflixLogo;
