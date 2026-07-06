import React from 'react';

export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#141820] border border-gray-800 p-6 rounded-2xl animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                    <div className="w-24 h-4 bg-gray-800 rounded" />
                </div>
                <div className="w-32 h-8 bg-gray-800 rounded mb-2" />
                <div className="w-20 h-4 bg-gray-800 rounded" />
            </div>
        ))}
    </div>
);

export const DashboardHeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
        <div className="space-y-3">
            <div className="w-64 h-10 bg-gray-800 rounded-lg" />
            <div className="w-48 h-5 bg-gray-800 rounded italic" />
        </div>
        <div className="flex items-center gap-3">
            <div className="w-32 h-10 bg-gray-800 rounded-full" />
            <div className="w-32 h-10 bg-gray-800 rounded-full" />
        </div>
    </div>
);

export const ProfileFormSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-48 sm:h-64 rounded-2xl bg-gray-800" />
        <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-800 -mt-20 border-4 border-[#0B0E14]" />
                <div className="w-full mt-6 space-y-4">
                    <div className="h-10 bg-gray-800 rounded-xl" />
                    <div className="h-10 bg-gray-800 rounded-xl" />
                </div>
            </div>
            <div className="flex-1 space-y-6">
                <div className="h-40 bg-gray-800 rounded-2xl" />
                <div className="h-20 bg-gray-800 rounded-2xl" />
                <div className="flex justify-end">
                    <div className="w-40 h-12 bg-gray-800 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);
