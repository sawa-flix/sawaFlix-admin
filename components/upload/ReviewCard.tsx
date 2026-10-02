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
      <div className="bg-white rounded-3xl border border-emerald-200 p-10 sm:p-14 text-center shadow-xs animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Publish Successful!</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          Your video has been published successfully and is now live in your media catalog.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button 
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer" 
            onClick={onReset}
          >
            Upload Another Video
          </button>
          <a 
            href="/admin/content/feed" 
            className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>View in Uploaded Feed</span>
            <span>→</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs animate-in fade-in slide-in-from-bottom-4 text-left">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Publish</h2>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Upload Failed</h3>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Info */}
        <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-200/80 pb-3">
            <div className="p-1.5 bg-slate-200/80 rounded-lg text-slate-700">
              <FileVideo size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Video Asset</h3>
          </div>
          {file ? (
            <div className="space-y-4 text-xs font-medium">
              {/* Video Preview / Cover */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-xs border border-slate-200/70 group">
                <video
                  src={`${URL.createObjectURL(file)}#t=0.5`}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                  Preview Frame
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">File Name</span>
                <span className="text-xs font-bold text-slate-800 truncate block">{file.name}</span>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Size</span>
                  <span className="text-xs font-bold text-slate-800">{formatFileSize(file.size)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Format</span>
                  <span className="text-xs font-bold text-slate-800">{file.type}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-rose-500 font-bold text-xs">Missing file!</p>
          )}
        </div>

        {/* Metadata Info */}
        <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-200/80 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Primary Descriptions</h3>
          </div>
          <div className="space-y-4 text-xs font-medium">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Title</span>
              <span className="text-xs font-bold text-slate-900">{metadata.title || 'Untitled'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Category</span>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold">
                  {metadata.category || 'Video'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Language</span>
                <span className="text-xs font-bold text-slate-800">{metadata.language || 'English'}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Visibility</span>
                <span className="text-xs font-bold text-slate-800">{metadata.visibility || 'Public'}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">18+ Restriction</span>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  metadata.age_restriction ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {metadata.age_restriction ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Fields Section */}
      {dynamicFields.length > 0 && (
        <div className="mt-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-2 border-b border-slate-200">
            Category Specifics ({metadata.category})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {dynamicFields.map(key => (
              <div key={key}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                  {key.replace(/_/g, ' ')}
                </span> 
                <span className="text-xs font-bold text-slate-800">
                  {Array.isArray(metadata[key]) ? metadata[key].join(', ') : String(metadata[key])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isProcessing ? (
        <UploadProgress progress={progress} status={status} />
      ) : (
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            onClick={onBack} 
            disabled={isProcessing}
          >
            ← Back to Category
          </button>
          {isFailed ? (
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              onClick={onPublish}
            >
              Retry Upload
            </button>
          ) : (
            <button 
              type="button" 
              className="px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer" 
              onClick={onPublish}
            >
              Publish Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
