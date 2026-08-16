import React from 'react';
import { UploadStatus } from '@/hooks/useDirectUpload';
import { CheckCircle, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center p-8 bg-base-200/30 rounded-2xl border border-base-content/5 mt-8 animate-in zoom-in-95 duration-300">
      {status === 'completed' ? (
        <div className="bg-success/20 p-4 rounded-full mb-4">
          <CheckCircle className="w-16 h-16 text-success animate-bounce" />
        </div>
      ) : (
        <Loader2 className="w-16 h-16 text-primary mb-6 animate-spin" />
      )}
      
      <h3 className="text-xl font-bold mb-6 text-base-content">{getStatusMessage()}</h3>
      
      {status !== 'completed' && status !== 'failed' && (
        <div className="w-full max-w-lg">
          <progress 
            className="progress progress-primary w-full h-4" 
            value={status === 'uploading' ? progress : (status === 'confirming' ? 100 : 0)} 
            max="100"
          ></progress>
          <div className="flex justify-between mt-3 text-xs text-base-content/60 font-bold uppercase tracking-wider">
            <span>0%</span>
            <span>{status === 'uploading' ? progress : (status === 'confirming' ? 100 : 0)}%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};
