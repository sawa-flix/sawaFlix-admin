import { useState, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';

export type UploadStatus = 'idle' | 'validating' | 'presigning' | 'uploading' | 'confirming' | 'completed' | 'failed';

export interface UploadOptions {
  file: File;
  metadata: Record<string, any>;
}

export const useDirectUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  // Helper function to check video duration using HTML5 video element
  const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata.'));
      };

      video.src = window.URL.createObjectURL(file);
    });
  };

  const validateVideoFile = async (file: File) => {
    const MAX_SIZE = 41943040; // 40MB
    if (file.size > MAX_SIZE) {
      throw new Error('File exceeds the 40MB limit.');
    }

    const duration = await checkVideoDuration(file);
    if (duration >= 180) {
      throw new Error('Video duration must be strictly less than 180 seconds.');
    }
    return true;
  };

  const startUpload = useCallback(async ({ file, metadata }: UploadOptions) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setStatus('validating');

    try {
      // 1. File Validation Gate (Client-Side)
      await validateVideoFile(file);

      // 2. Presigning Phase
      setStatus('presigning');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const backendUrl = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sawaflix-backend.onrender.com';
      const presignResponse = await fetch(`${backendUrl}/api/admin/upload/presign`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!presignResponse.ok) {
        const errText = await presignResponse.text().catch(() => '');
        console.error(`Presign endpoint failed (${presignResponse.status} ${presignResponse.statusText}):`, errText);
        throw new Error(`Unable to establish a secure upload connection. (${presignResponse.status}: ${errText || presignResponse.statusText})`);
      }

      const json = await presignResponse.json();
      console.log('Presign Response Data:', json);
      const { presignedUrl, videoId } = json.data || json;

      if (!presignedUrl) {
        console.error('Presigned URL missing in backend response:', json);
        throw new Error('Presigned URL missing from server response.');
      }

      // 3. Uploading Phase (XMLHttpRequest for Progress)
      setStatus('uploading');
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress(percentage);
          }
        };

        xhr.onload = () => {
          console.log('XHR Upload OnLoad - Status:', xhr.status, xhr.statusText, xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Storage transfer returned status ${xhr.status}: ${xhr.responseText || xhr.statusText || 'Interrupted'}`));
          }
        };

        xhr.onerror = (e) => {
          console.error('XHR Upload OnError Event:', e, 'XHR Status:', xhr.status, 'ResponseText:', xhr.responseText);
          reject(new Error(`Storage connection error (XHR status ${xhr.status}). This usually indicates a CORS policy issue on the storage bucket or expired presigned URL.`));
        };

        xhr.send(file);
      });

      // 4. Confirming Phase
      setStatus('confirming');
      const confirmResponse = await fetch(`${backendUrl}/api/admin/upload/confirm/${videoId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(metadata),
      });

      if (!confirmResponse.ok) {
        throw new Error('Unable to complete publication. Please try again.');
      }

      // Upload completely finished
      setStatus('completed');
      setIsUploading(false);
      setProgress(100);
      return videoId;

    } catch (err: any) {
      setStatus('failed');
      const friendlyError = err.message?.includes('40MB') || err.message?.includes('180 seconds')
        ? err.message
        : (err.message && !err.message.includes('{') && !err.message.includes('Status') ? err.message : 'An error occurred while uploading your video. Please try again.');
      setError(friendlyError);
      setIsUploading(false);
      setProgress(0);
      throw err;
    }

  }, []);

  return {
    isUploading,
    progress,
    error,
    status,
    startUpload,
    validateVideoFile,
  };
};
