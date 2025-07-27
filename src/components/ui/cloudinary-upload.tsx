'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { Progress } from './progress';

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function CloudinaryUpload({
  onUploadComplete,
  onUploadError,
  disabled = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = ''
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setProgress(0);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'aniwa_uploads';

      console.log('Environment variables:', {
        cloudName,
        uploadPreset,
        hasCloudName: !!cloudName,
        hasUploadPreset: !!uploadPreset
      });

      if (!cloudName) {
        throw new Error('Cloudinary cloud name missing. Please check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.');
      }

      console.log('Uploading to Cloudinary:', { cloudName, uploadPreset, fileName: file.name });

      // FormData oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      console.log('FormData created:', {
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        uploadPreset
      });

      // Upload işlemi
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Cloudinary response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cloudinary success response:', data);
      
      const url = data.secure_url;
      
      setUploadedUrl(url);
      setProgress(100);
      onUploadComplete(url);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    disabled: disabled || uploading,
    multiple: false,
  });

  const handleRemove = () => {
    setUploadedUrl(null);
    setProgress(0);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!uploadedUrl ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Drop the file here...'
              : 'Drag & drop a file here, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Upload successful!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3">
            <Image
              src={uploadedUrl}
              alt="Uploaded preview"
              width={128}
              height={64}
              className="w-full h-32 object-cover rounded"
            />
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}