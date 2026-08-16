import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { useDirectUpload } from '../../hooks/useDirectUpload';

interface FileSelectorProps {
  onFileAccepted: (file: File) => void;
}

export const FileSelector: React.FC<FileSelectorProps> = ({ onFileAccepted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // We extract only the validation function from the hook
  const { validateVideoFile } = useDirectUpload();

  const handleValidation = async (file: File) => {
    setValidationError(null);
    setSelectedFile(null);

    if (!file.type.startsWith('video/')) {
      setValidationError('Please select a valid video file format (e.g., MP4, WebM).');
      return;
    }

    setIsValidating(true);
    try {
      await validateVideoFile(file);
      
      // If no error was thrown, the file passed all validation checks
      setSelectedFile(file);
      
      // We use a small timeout to allow the user to see the success state
      // before automatically advancing to Step 2
      setTimeout(() => {
        onFileAccepted(file);
      }, 800);
      
    } catch (err: any) {
      setValidationError(err.message || 'Error validating file.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleValidation(file);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleValidation(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-in fade-in zoom-in-95 duration-300">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[350px] shadow-sm
          ${isDragging ? 'border-primary bg-primary/10 scale-105 shadow-xl shadow-primary/20' : 'border-base-content/20 bg-base-100 hover:border-primary/50 hover:bg-base-200/50 hover:shadow-md'}
          ${validationError ? 'border-error bg-error/5 hover:bg-error/10' : ''}
          ${selectedFile ? 'border-success bg-success/10 scale-100' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isValidating && !selectedFile && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="video/*"
          className="hidden"
          disabled={isValidating || selectedFile !== null}
        />

        {isValidating ? (
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-primary mb-6"></span>
            <p className="text-xl font-medium text-base-content animate-pulse">Analyzing video file...</p>
            <p className="text-sm text-base-content/60 mt-2">Checking duration and size limits</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center text-success animate-in fade-in zoom-in-50 duration-500">
            <div className="bg-success/20 p-4 rounded-full mb-4">
              <CheckCircle className="w-16 h-16 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-base-content">File Verified!</h3>
            <p className="font-medium text-base-content/80 max-w-[280px] truncate">{selectedFile.name}</p>
            <p className="text-sm font-semibold opacity-70 mt-2 badge badge-success badge-outline">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-sm text-base-content/50 mt-6 animate-pulse">Proceeding to next step...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-base-content/70">
            <div className={`p-5 rounded-full bg-base-200/50 mb-6 transition-colors duration-300 ${isDragging ? 'bg-primary/20' : ''}`}>
              <UploadCloud className={`w-16 h-16 transition-transform duration-300 ${isDragging ? 'text-primary scale-110' : ''}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-base-content">
              {isDragging ? 'Drop video to upload' : 'Drag & Drop your video'}
            </h3>
            <p className="mb-8 text-base-content/60">or click to browse from your computer</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
              <span className="badge badge-lg badge-neutral badge-outline">Max 40MB</span>
              <span className="badge badge-lg badge-neutral badge-outline">Max 3 mins</span>
              <span className="badge badge-lg badge-neutral badge-outline">MP4, WebM</span>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="alert alert-error mt-6 shadow-lg rounded-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Validation Failed</h3>
            <div className="text-sm opacity-90">{validationError}</div>
          </div>
        </div>
      )}
    </div>
  );
};
