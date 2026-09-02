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

/** Loading spinner using the official loaderLogo.png */
export const SawaflixLoader: React.FC<{ size?: number; className?: string; text?: string }> = ({ size = 64, className = "", text }) => (
    <div className={`flex flex-col items-center justify-center gap-3.5 ${className}`}>
        <div className="relative flex items-center justify-center">
            {/* Soft pulsing glow behind */}
            <div className="absolute inset-0 rounded-full bg-red-500/15 blur-md animate-pulse" />
            <Image
                src="/loaderLogo.png"
                alt="Loading..."
                width={size}
                height={size}
                priority
                unoptimized
                className="relative z-10 animate-pulse drop-shadow-md object-contain"
            />
        </div>
        {text && (
            <p className="text-xs font-semibold text-slate-600 tracking-wide animate-pulse">
                {text}
            </p>
        )}
    </div>
);

export default SawaflixLogo;
