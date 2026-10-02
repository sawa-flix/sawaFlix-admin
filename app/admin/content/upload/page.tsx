'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSelector } from '@/components/upload/FileSelector';
import { useDirectUpload } from '@/hooks/useDirectUpload';
import { MetadataForm, MetadataFormData } from '@/components/upload/MetadataForm';
import { CategoryFields, CategoryFormData } from '@/components/upload/CategoryFields';
import { ReviewCard } from '@/components/upload/ReviewCard';
import CloudflareUploadsFeed from '@/components/upload/CloudflareUploadsFeed';
import { Clock, CheckCircle2, Users, Activity, TrendingUp } from 'lucide-react';

export default function UploadContentPage() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Partial<MetadataFormData & CategoryFormData>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Upload Hook
  const { isUploading, progress, error, status, startUpload } = useDirectUpload();

  const handleFileAccepted = (selectedFile: File) => {
    setFile(selectedFile);
    setStep(2);
  };

  const handleMetadataSubmit = (data: MetadataFormData) => {
    setMetadata((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleCategorySubmit = (data: CategoryFormData) => {
    setMetadata((prev) => ({ ...prev, ...data }));
    setStep(4);
  };

  const handlePublish = async () => {
    if (!file) return;
    try {
      await startUpload({ file, metadata });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Upload process failed:", err);
    }
  };

  const handleReset = () => {
    setFile(null);
    setMetadata({});
    setStep(1);
  };

  const steps = [
    { num: 1, label: 'Select File' },
    { num: 2, label: 'Basic Info' },
    { num: 3, label: 'Category' },
    { num: 4, label: 'Review' },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <FileSelector onFileAccepted={handleFileAccepted} />;
      case 2:
        return (
          <MetadataForm 
            initialData={metadata as Partial<MetadataFormData>} 
            onNext={handleMetadataSubmit} 
            onBack={() => setStep(1)} 
          />
        );
      case 3:
        return (
          <CategoryFields 
            initialData={metadata as Partial<CategoryFormData>} 
            onNext={handleCategorySubmit} 
            onBack={() => setStep(2)} 
          />
        );
      case 4:
        return (
          <ReviewCard 
            file={file}
            metadata={metadata}
            status={status}
            progress={progress}
            error={error}
            onBack={() => setStep(3)}
            onPublish={handlePublish}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upload Content</h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload video content directly to your Cloudflare media catalog.
        </p>
      </div>

      {/* Upload Wizard Card */}
      <div className="w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/90">
        {/* Custom Stepper matching screenshot */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
            
            {steps.map((s) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent || isCompleted
                        ? 'bg-red-600 text-white shadow-sm ring-4 ring-red-50'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 ${
                      isCurrent ? 'text-red-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {renderStepContent()}
        </div>
      </div>

      {/* 4 Metric Sparkline Cards from Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Reviews */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                <Clock size={19} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Pending Reviews</span>
                <div className="text-2xl font-black text-slate-900 leading-tight">2</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-medium">Waiting for review</div>
          </div>
          {/* Sparkline wave (red) */}
          <div className="mt-3 pt-2">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" fill="none">
              <path
                d="M 0,18 Q 15,12 30,19 T 60,15 T 85,20 T 100,16"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Approval Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                <CheckCircle2 size={19} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Approval Rate</span>
                <div className="text-2xl font-black text-slate-900 leading-tight">75%</div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-600 mt-2 font-semibold flex items-center gap-1">
              <span className="text-emerald-500 font-bold">↑ 12%</span> vs last 7 days
            </div>
          </div>
          {/* Sparkline wave (green) */}
          <div className="mt-3 pt-2">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" fill="none">
              <path
                d="M 0,20 Q 20,10 40,18 T 70,12 T 90,14 T 100,10"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Processed */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
                <Users size={19} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Processed</span>
                <div className="text-2xl font-black text-slate-900 leading-tight">4</div>
              </div>
            </div>
            <div className="text-[11px] text-blue-600 mt-2 font-semibold flex items-center gap-1">
              <span className="text-blue-500 font-bold">↑ 8%</span> This week
            </div>
          </div>
          {/* Sparkline wave (blue) */}
          <div className="mt-3 pt-2">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" fill="none">
              <path
                d="M 0,22 Q 25,16 50,20 T 75,14 T 95,16 T 100,12"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Avg. Turnaround */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                <Activity size={19} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Avg. Turnaround</span>
                <div className="text-2xl font-black text-slate-900 leading-tight">1.2d</div>
              </div>
            </div>
            <div className="text-[11px] text-purple-600 mt-2 font-semibold flex items-center gap-1">
              <span className="text-purple-500 font-bold">↓ 0.3d</span> Submission to decision
            </div>
          </div>
          {/* Sparkline wave (purple) */}
          <div className="mt-3 pt-2">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" fill="none">
              <path
                d="M 0,16 Q 20,22 45,14 T 70,18 T 90,12 T 100,15"
                stroke="#8B5CF6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Cloudflare Uploaded Videos Section (Table from screenshot with delete button) */}
      <CloudflareUploadsFeed refreshTrigger={refreshTrigger} />
    </div>
  );
}
