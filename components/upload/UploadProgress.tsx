import React from 'react';
import { UploadStatus } from '@/hooks/useDirectUpload';
import { CheckCircle } from 'lucide-react';
import { SawaflixLoader } from '@/components/SawaflixLogo';

interface UploadProgressProps {
  progress: number;
  status: UploadStatus;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, status }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'validating': return 'Validating video format...';
      case 'presigning': return 'Preparing secure upload connection...';
      case 'uploading': return `Uploading video... (${progress}%)`;
      case 'confirming': return 'Finalizing video publishing...';
      case 'completed': return 'Video Published Successfully!';
      case 'failed': return 'Upload Could Not Be Completed';
      default: return 'Initializing...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200/80 mt-6 animate-in zoom-in-95 duration-300 text-center">
      {status === 'completed' ? (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
        </div>
      ) : (
        <div className="mb-5">
          <SawaflixLoader size={54} />
        </div>
      )}
      
      <h3 className="text-base font-bold mb-4 text-slate-900">{getStatusMessage()}</h3>
      
      {status !== 'completed' && status !== 'failed' && (
        <div className="w-full max-w-md">
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 rounded-full transition-all duration-300"
              style={{ width: `${status === 'uploading' ? progress : (status === 'confirming' ? 100 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-400 font-semibold font-mono">
            <span>0%</span>
            <span className="text-slate-700">{status === 'uploading' ? progress : (status === 'confirming' ? 100 : 0)}%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};
