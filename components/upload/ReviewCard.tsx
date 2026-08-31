import React from 'react';
import { UploadStatus } from '@/hooks/useDirectUpload';
import { UploadProgress } from './UploadProgress';
import { FileVideo, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReviewCardProps {
  file: File | null;
  metadata: Record<string, any>;
  status: UploadStatus;
  progress: number;
  error: string | null;
  onBack: () => void;
  onPublish: () => void;
  onReset: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  file,
  metadata,
  status,
  progress,
  error,
  onBack,
  onPublish,
  onReset
}) => {
  const isProcessing = ['validating', 'presigning', 'uploading', 'confirming'].includes(status);
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Exclude certain base fields to render dynamic ones separately
  const baseFields = ['title', 'description', 'language', 'visibility', 'age_restriction', 'tags', 'category'];
  const dynamicFields = Object.keys(metadata).filter(k => !baseFields.includes(k) && metadata[k]);

  if (isCompleted) {
    return (
      <div className="card bg-base-100 shadow-xl border border-success/30 animate-in fade-in zoom-in-95 duration-500">
        <div className="card-body items-center text-center py-16">
          <div className="bg-success/20 p-6 rounded-full mb-6">
            <CheckCircle2 className="w-24 h-24 text-success" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-base-content">Publish Successful!</h2>
          <p className="text-lg text-base-content/70 max-w-lg mb-8 leading-relaxed">
            Your video has been published successfully and is now live in your media catalog.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn btn-primary btn-lg shadow-lg shadow-primary/30" onClick={onReset}>
              Upload Another Video
            </button>
            <a href="/admin/content/feed" className="btn btn-outline btn-lg border-gray-700 hover:border-red-500 text-white">
              View in Uploaded Feed →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-content/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 text-left">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Review & Publish</h2>

        {error && (
          <div className="alert alert-error mb-6 shadow-md rounded-2xl">
            <AlertTriangle className="w-7 h-7 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Upload Failed</h3>
              <div className="text-sm opacity-90 mt-1">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Info */}
          <div className="bg-base-200/50 p-6 rounded-3xl border border-base-content/5 shadow-inner">
            <div className="flex items-center gap-3 mb-5 border-b border-base-content/10 pb-4">
              <div className="p-2 bg-primary/20 rounded-full">
                <FileVideo className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Video Asset</h3>
            </div>
            {file ? (
              <div className="space-y-4 text-sm font-medium">
                {/* Video Preview / Cover */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-base-content/10 group">
                  <video
                    src={`${URL.createObjectURL(file)}#t=0.5`}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white shadow-sm backdrop-blur-md">
                    TikTok Style Cover Frame (0.5s)
                  </div>
                </div>

                <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">File Name</span> <span className="text-base truncate">{file.name}</span></p>
                <div className="flex gap-8">
                  <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Size</span> <span className="text-base">{formatFileSize(file.size)}</span></p>
                  <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Format</span> <span className="text-base">{file.type}</span></p>
                </div>
              </div>
            ) : (
              <p className="text-error font-bold">Missing file!</p>
            )}
          </div>

          {/* Metadata Info */}
          <div className="bg-base-200/50 p-6 rounded-3xl border border-base-content/5 shadow-inner">
            <div className="flex items-center gap-3 mb-5 border-b border-base-content/10 pb-4">
              <h3 className="text-xl font-bold ml-2">Primary Descriptions</h3>
            </div>
            <div className="space-y-4 text-sm font-medium">
              <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Title</span> <span className="text-base">{metadata.title}</span></p>
              <div className="grid grid-cols-2 gap-4">
                <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Category</span> <span className="badge badge-primary badge-lg">{metadata.category}</span></p>
                <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Language</span> <span className="text-base">{metadata.language}</span></p>
                <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">Visibility</span> <span className="text-base">{metadata.visibility}</span></p>
                <p className="flex flex-col"><span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">18+ Restriction</span> <span className={`badge ${metadata.age_restriction ? 'badge-error' : 'badge-neutral'}`}>{metadata.age_restriction ? 'Yes' : 'No'}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Fields Section */}
        {dynamicFields.length > 0 && (
          <div className="mt-8 bg-base-200/30 p-6 rounded-3xl border border-base-content/5">
            <h3 className="text-lg font-bold mb-5 border-b border-base-content/10 pb-3 pl-2">Category Specifics ({metadata.category})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm pl-2">
              {dynamicFields.map(key => (
                <p key={key} className="flex flex-col">
                  <span className="text-base-content/50 mb-1 uppercase tracking-wider text-xs">{key.replace(/_/g, ' ')}</span> 
                  <span className="text-base font-medium">
                    {Array.isArray(metadata[key]) ? metadata[key].join(', ') : String(metadata[key])}
                  </span>
                </p>
              ))}
            </div>
          </div>
        )}

        {isProcessing ? (
          <UploadProgress progress={progress} status={status} />
        ) : (
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-base-content/10">
            <button type="button" className="btn btn-ghost" onClick={onBack} disabled={isProcessing}>
              ← Back to Category
            </button>
            {isFailed ? (
              <button type="button" className="btn btn-error px-12 shadow-lg font-bold" onClick={onPublish}>
                Retry Upload
              </button>
            ) : (
              <button 
                type="button" 
                className="group/btn inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-950 text-gray-200 hover:text-white font-bold text-base transition-all duration-200 border border-gray-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer" 
                onClick={onPublish}
              >
                <span>Publish Now</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
