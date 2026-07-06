"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

export default function SectionHeader({ title, subtitle, center = true }: SectionHeaderProps) {
    return (
        <div className={`mb-12 ${center ? "text-center" : "text-left"}`}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col items-center"
                >
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-500 mt-4 rounded-full"></div>
                </motion.div>
            )}
        </div>
    );
}
