'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import Step1Category from './Step1Category';
import Step2Identity from './Step2Identity';
import Step3Professional from './Step3Professional';
import Step4Portfolio from './Step4Portfolio';
import Step5Summary from './Step5Summary';
import { getDraft, saveDraft, submitVerification } from '../../lib/verification';
import { useRouter } from 'next/navigation';
import StatusModal from '../Dashboard/StatusModal';

const steps = [
    { id: 1, name: 'Category' },
    { id: 2, name: 'Identity' },
    { id: 3, name: 'Professional' },
    { id: 4, name: 'Portfolio' },
    { id: 5, name: 'Summary' },
];

const CreatorWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        category: '',
        identity: {},
        professional: {},
        portfolio: { recordings: [], links: [] },
        documents: { id_url: null, id_name: null, endorsements_url: null, endorsements_name: null }
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const loadDraft = async () => {
            try {
                const draft = await getDraft();
                if (draft && draft.data) {
                    const { category, status, formData: savedData } = draft.data;

                    // Redirect if already submitted or processed
                    if (status === 'pending') {
                        router.push('/creator/pending');
                        return;
                    } else if (status === 'approved' || status === 'rejected') {
                        router.push('/creator-dashboard');
                        return;
                    }

                    if (savedData) {
                        setFormData(prev => ({ ...prev, ...savedData }));
                        setCurrentStep(savedData.step || 1);
                    } else if (category) {
                        setFormData(prev => ({ ...prev, category }));
                    }
                }
            } catch (e) {
                console.error("Failed to load draft", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadDraft();
    }, []);

    const persistDraft = async (step, data) => {
        try {
            await saveDraft({
                category: data.category || 'unspecified',
                form_data: { ...data, step }
            });
        } catch (e) {
            console.error("Failed to save draft", e);
        }
    };

    const updateFormData = (key, data) => {
        setFormData(prev => ({
            ...prev,
            [key]: { ...prev[key], ...data }
        }));
        // Clear errors for changed fields
        const changedFields = Object.keys(data);
        setErrors(prev => {
            const next = { ...prev };
            changedFields.forEach(f => delete next[f]);
            return next;
        });
    };

    const handleStep1Update = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
        if (data.category) setErrors(prev => { const n = { ...prev }; delete n.category; return n; });
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.category) newErrors.category = "Please select a creator category to continue.";
        } else if (step === 2) {
            const id = formData.identity || {};
            if (!id.legalName) newErrors.legalName = "Legal Name is required.";
            if (!id.creatorName) newErrors.creatorName = "Creator Name is required.";
            if (!id.ethnicGroup) newErrors.ethnicGroup = "Ethnic Group / Community is required.";
            if (!id.phone) newErrors.phone = "Phone number is required.";
            if (!id.email) newErrors.email = "Email is required.";
            else if (!/\S+@\S+\.\S+/.test(id.email)) newErrors.email = "Please enter a valid email address.";
        } else if (step === 3) {
            const pro = formData.professional || {};
            if (!pro.languages) newErrors.languages = "Languages is required.";
            if (!pro.experienceTime) newErrors.experienceTime = "Experience is required.";
            if (!pro.bio || pro.bio.length < 10) newErrors.bio = "Bio must be at least 10 characters.";
        } else if (step === 4) {
            if (!formData.documents?.id_url) newErrors.id = "Please upload your Government ID to continue.";

            // Recording requirement removed as per user request
            /*
            const portfolio = formData.portfolio || {};
            const recordings = portfolio.recordings || [];
            const validRecordings = recordings.filter(r => r.file_url && r.title && r.description);
            if (validRecordings.length < 3) {
                newErrors.recordings = "Please provide at least 3 sample recordings with titles and descriptions.";
            }
            */
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validateStep(currentStep)) {
            const nextStep = Math.min(currentStep + 1, steps.length);
            setCurrentStep(nextStep);
            await persistDraft(nextStep, formData);
        }
    };

    const handleBack = async () => {
        const prevStep = Math.max(currentStep - 1, 1);
        setCurrentStep(prevStep);
        await persistDraft(prevStep, formData);
        setErrors({});
    };

    const router = useRouter();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            console.log("Submitting:", formData);
            const result = await submitVerification({
                category: formData.category,
                form_data: formData
            });
            console.log("✅ Submission success:", result);
            
            // Show premium success modal
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Application Received',
                message: 'Thank you for applying to be a SawaFlix Creator. Our team will review your submission within 5 business days.'
            });
            
        } catch (error) {
            console.error("❌ Submission failed:", error);
            setIsSubmitting(false);
            
            // Show premium error modal
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Submission Failed',
                message: 'We encountered an error while processing your application. Please check your connection and try again.'
            });
        }
    };

    const handleModalClose = () => {
        if (modal.type === 'success') {
            window.location.href = '/dashboard';
        } else {
            setModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const showModal = (type, title, message) => {
        setModal({ isOpen: true, type, title, message });
    };

    if (!isLoaded) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest animate-pulse">
                Initializing Application...
            </p>
        </div>
    );

    return (
        <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 sm:p-8 font-sans text-white antialiased overflow-hidden rounded-tl-3xl rounded-bl-3xl" style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md z-0" />

            <style jsx>{`
                .grid-pattern {
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                .glass-card {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>
            
            <div className="absolute inset-0 z-0 opacity-20 grid-pattern pointer-events-none" />

            {/* Centralized Creator Application Card */}
            <div className="relative z-10 w-full max-w-4xl glass-card rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Context */}
                <div className="relative px-6 py-6 bg-[#0a0c10]/80 border-b border-white/5 flex flex-col items-center justify-center overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-red-600/5 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 text-center">
                        Verified Creator Application
                    </h1>
                    <p className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase text-center max-w-lg">
                        Step {currentStep} of {steps.length} • {steps[currentStep - 1]?.name}
                    </p>
                </div>

                {/* Form Content Area */}
                <div className="flex-1 flex flex-col px-6 sm:px-10 py-6 bg-[#0f172a]/90 relative overflow-y-auto scrollbar-hide">
                    <div className="max-w-2xl mx-auto mb-8 shrink-0 w-full">
                        <ProgressBar currentStep={currentStep} steps={steps} />
                    </div>

                    <div className="max-w-2xl mx-auto w-full flex-1 pb-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                {currentStep === 1 && (
                                    <Step1Category data={formData} updateData={handleStep1Update} errors={errors} showModal={showModal} />
                                )}
                                {currentStep === 2 && (
                                    <Step2Identity data={formData.identity} updateData={(d) => updateFormData('identity', d)} errors={errors} showModal={showModal} />
                                )}
                                {currentStep === 3 && (
                                    <Step3Professional data={formData.professional} updateData={(d) => updateFormData('professional', d)} errors={errors} showModal={showModal} />
                                )}
                                {currentStep === 4 && (
                                    <Step4Portfolio data={formData.portfolio} documents={formData.documents} updatePortfolio={(d) => updateFormData('portfolio', d)} updateDocuments={(d) => updateFormData('documents', d)} errors={errors} showModal={showModal} />
                                )}
                                {currentStep === 5 && (
                                    <Step5Summary formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} showModal={showModal} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="px-6 py-4 bg-[#0a0c10]/90 border-t border-white/5 flex items-center justify-between shrink-0 z-20">
                    <div>
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                                Go Back
                            </button>
                        )}
                    </div>

                    <div>
                        {currentStep < 5 && (
                            <button
                                onClick={handleNext}
                                className="px-10 py-4 bg-red-600 hover:bg-white hover:text-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 group border-b-4 border-red-900"
                            >
                                Continue Step {currentStep + 1}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Success/Error Modal */}
            <StatusModal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                actionText={modal.type === 'success' ? 'Go to Dashboard' : 'Try Again'}
            />
        </div>
    );
};

export default CreatorWizard;
