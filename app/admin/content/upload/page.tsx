'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSelector } from '@/components/upload/FileSelector';
import { useDirectUpload } from '@/hooks/useDirectUpload';
import { MetadataForm, MetadataFormData } from '@/components/upload/MetadataForm';
import { CategoryFields, CategoryFormData } from '@/components/upload/CategoryFields';
import { ReviewCard } from '@/components/upload/ReviewCard';

export default function UploadContentPage() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Partial<MetadataFormData & CategoryFormData>>({});
  
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
    } catch (err) {
      // Error is caught and surfaced inside useDirectUpload via the 'error' state
      console.error("Upload process failed:", err);
    }
  };

  const handleReset = () => {
    setFile(null);
    setMetadata({});
    setStep(1);
    // Note: status from useDirectUpload resets to 'validating' on next startUpload invocation automatically.
  };

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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Content</h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload video content directly to your media catalog.
        </p>

      </div>

      <div className="w-full bg-base-100 p-8 rounded-3xl shadow-sm border border-base-content/5 mt-6">
        {/* DaisyUI Horizontal Step Indicator */}
        <ul className="steps steps-horizontal w-full mb-8">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Select File</li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Basic Info</li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Category</li>
          <li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Review</li>
        </ul>

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
