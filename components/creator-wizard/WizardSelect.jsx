import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WizardSelect = ({ value, onChange, options, placeholder, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold bg-white/5 border hover:bg-white/10 transition-all shadow-inner ${
                    error
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : 'border-white/10 focus:ring-red-600/20 text-white'
                }`}
            >
                <span className={value ? 'text-white font-bold' : 'text-zinc-600 font-bold'}>
                    {value || placeholder}
                </span>
                <svg
                    className={`shrink-0 ml-3 w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0.95 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute z-100 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden origin-top shadow-[0_20px_50px_rgba(8,11,20,0.9)]"
                    >
                        <div className="max-h-64 overflow-y-auto scrollbar-hide py-2">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center px-5 py-3 text-sm font-bold transition-colors hover:bg-white/5 hover:text-white ${
                                        value === option ? 'text-white bg-white/5' : 'text-zinc-400'
                                    }`}
                                >
                                    {option}
                                    {value === option && (
                                        <svg className="w-4 h-4 ml-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WizardSelect;
