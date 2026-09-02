import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  FileVideo, 
  HardDrive, 
  Clock, 
  Monitor, 
  Maximize2 
} from 'lucide-react';
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
      setSelectedFile(file);
      setTimeout(() => {
        onFileAccepted(file);
      }, 700);
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
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Drag & Drop Zone */}
        <div className="lg:col-span-8 flex flex-col">
          <div
            className={`relative flex-1 border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[290px] bg-white ${
              isDragging
                ? 'border-red-500 bg-red-50/40 shadow-lg shadow-red-500/10 scale-[1.01]'
                : 'border-red-200/90 hover:border-red-400/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
            } ${validationError ? 'border-red-500 bg-red-50/30' : ''} ${
              selectedFile ? 'border-emerald-400 bg-emerald-50/20' : ''
            }`}
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
                <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-800 animate-pulse">Analyzing video file...</p>
                <p className="text-xs text-slate-400 mt-1">Verifying duration, resolution, and format</p>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center text-emerald-600">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">File Verified!</h3>
                <p className="text-xs text-slate-600 max-w-[280px] truncate">{selectedFile.name}</p>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-2">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <p className="text-xs text-slate-400 mt-3 animate-pulse">Proceeding to details...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Red Cloud Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 mb-3.5 transition-transform group-hover:scale-110">
                  <UploadCloud className="w-10 h-10 stroke-[1.8]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {isDragging ? 'Drop your video here' : 'Drag & drop your video here'}
                </h3>
                <p className="text-xs text-slate-400 mb-6">or click to browse from your computer</p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Max 40MB
                  </span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Max 3 mins
                  </span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> MP4, WebM
                  </span>
                </div>
              </div>
            )}
          </div>

          {validationError && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Upload Guidelines Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Info className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upload Guidelines</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <FileVideo className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500">Video format:</span>{' '}
                  <span className="font-semibold text-slate-800">MP4, WebM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500">Max file size:</span>{' '}
                  <span className="font-semibold text-slate-800">40MB</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500">Max duration:</span>{' '}
                  <span className="font-semibold text-slate-800">3 minutes</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Monitor className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500">Resolution:</span>{' '}
                  <span className="font-semibold text-slate-800">720p or higher</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Maximize2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500">Aspect ratio:</span>{' '}
                  <span className="font-semibold text-slate-800">16:9 recommended</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Files are automatically encoded and prepared for edge delivery via Cloudflare R2 and Stream.
          </div>
        </div>
      </div>
    </div>
  );
};
