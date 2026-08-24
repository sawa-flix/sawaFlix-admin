import React from 'react';
import Image from 'next/image';

interface SawaflixLogoProps {
    className?: string;
    height?: number;
}

const SawaflixLogo: React.FC<SawaflixLogoProps> = ({ className = "", height = 36 }) => {
    // Calculate width from the SVG's natural aspect ratio: 244.75 / 56.56 ≈ 4.327
    const width = Math.round(height * (244.75 / 56.56));

    return (
        <div className={`flex items-center ${className}`}>
            <Image
                src="/Asset 10.svg"
                alt="SawaFlix"
                width={width}
                height={height}
                priority
                unoptimized
            />
        </div>
    );
};

export default SawaflixLogo;
