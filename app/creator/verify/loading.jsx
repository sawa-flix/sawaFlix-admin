'use client';

import DashboardWrapper from '@/components/Dashboard/DashboardWrapper';

export default function VerifyLoading() {
    return (
        <DashboardWrapper>
            <div
                className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 sm:p-8 font-sans text-white antialiased overflow-hidden rounded-tl-3xl rounded-bl-3xl"
                style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md z-0" />

                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    <div
                        className="rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        style={{
                            background: 'rgba(15, 23, 42, 0.7)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        {/* Header Skeleton */}
                        <div className="px-6 sm:px-10 py-5 bg-[#0a0c10]/90 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="w-48 h-5 bg-white/5 rounded-lg animate-pulse" />
                                    <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-white/5 rounded-lg animate-pulse" />
                        </div>

                        {/* Progress Bar Skeleton */}
                        <div className="px-6 sm:px-10 py-6 bg-[#0f172a]/90">
                            <div className="max-w-2xl mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full animate-pulse ${i === 1 ? 'bg-red-500/20' : 'bg-white/5'}`} />
                                            <div className="w-14 h-2 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-1/5 bg-red-500/30 rounded-full animate-pulse" />
                                </div>
                            </div>

                            {/* Form Content Skeleton */}
                            <div className="max-w-2xl mx-auto mt-8 space-y-6">
                                {/* Title skeleton */}
                                <div className="space-y-3">
                                    <div className="w-64 h-8 bg-white/5 rounded-xl animate-pulse" />
                                    <div className="w-96 h-4 bg-white/5 rounded-lg animate-pulse" />
                                </div>

                                {/* Category cards skeleton */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="rounded-2xl border border-white/5 p-6 animate-pulse"
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                            <div className="w-12 h-12 bg-white/5 rounded-xl mx-auto mb-3" />
                                            <div className="w-20 h-4 bg-white/5 rounded mx-auto mb-2" />
                                            <div className="w-28 h-3 bg-white/5 rounded mx-auto" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="px-6 py-4 bg-[#0a0c10]/90 border-t border-white/5 flex items-center justify-end shrink-0">
                            <div className="w-40 h-12 bg-red-500/10 rounded-2xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardWrapper>
    );
}
