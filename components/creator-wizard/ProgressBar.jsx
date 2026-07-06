import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, steps = [] }) => {
    return (
        <div className="w-full relative py-6">
            <div className="flex items-center justify-between relative px-2">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 rounded-full -translate-y-1/2 z-0" />

                {/* Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-red-600 rounded-full -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                />

                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isActive ? '#DC2626' : (isCompleted ? '#0f172a' : '#020617'),
                                    borderColor: isActive ? '#ef4444' : (isCompleted ? '#DC2626' : 'rgba(255,255,255,0.1)'),
                                    color: isActive ? '#FFFFFF' : (isCompleted ? '#DC2626' : '#64748b'),
                                    scale: isActive ? 1.1 : 1
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all duration-300 shadow-xl ${isActive ? 'shadow-[0_0_20px_rgba(220,38,38,0.4)]' : ''}`}
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </motion.div>
                            <span className={`absolute -bottom-6 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-white' : (isCompleted ? 'text-zinc-400' : 'text-zinc-600')}`}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
