import React from 'react';
import Image from 'next/image';

interface SawaflixLogoProps {
    className?: string;
    height?: number;
    theme?: 'light' | 'dark';
}

const SawaflixLogo: React.FC<SawaflixLogoProps> = ({ className = "", height = 34, theme = 'light' }) => {
    // Calculate width from the SVG's natural aspect ratio: 244.75 / 56.56 ≈ 4.327
    const width = Math.round(height * (244.75 / 56.56));
    const src = theme === 'dark' ? '/Asset 10.svg' : '/logo/logo.svg';

    return (
        <div className={`flex items-center ${className}`}>
            <Image
                src={src}
                alt="SawaFlix"
                width={width}
                height={height}
                priority
                unoptimized
            />
        </div>
    );
};

/** Compact icon-only version using Asset 8.svg (just the play-button mark) */
export const SawaflixIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
    <div className={`flex items-center ${className}`}>
        <Image
            src="/Asset 8.svg"
            alt="SawaFlix"
            width={size}
            height={size}
            priority
            unoptimized
        />
    </div>
);

/** Loading spinner using the official loader.svg from /logo/loader.svg */
export const SawaflixLoader: React.FC<{ size?: number; className?: string; text?: string }> = ({ size = 52, className = "", text }) => (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <Image
            src="/logo/loader.svg"
            alt="Loading..."
            width={size}
            height={Math.round(size * (100.41 / 172.09))}
            priority
            unoptimized
            className="animate-pulse drop-shadow-sm"
        />
        {text && <p className="text-xs text-slate-500 font-semibold animate-pulse">{text}</p>}
    </div>
);

export default SawaflixLogo;
