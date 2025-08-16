'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageCategory } from '@/lib/types/cloudinary';
import { IMAGE_PRESET_CONFIGS } from '@/lib/constants/cloudinary.constants';

export interface ImageUploadProps {
  /**
   * Image kategorisi - size limits ve format restrictions için kullanılır
   */
  category: ImageCategory;
  
  /**
   * Mevcut image URL'i (edit durumunda)
   */
  value?: string | null;
  
  /**
   * Image değiştiğinde çağrılır
   */
  onChange: (file: File | null) => void;
  
  /**
   * Upload işlemi sırasında çağrılır
   */
  onUploadStart?: () => void;
  
  /**
   * Upload tamamlandığında çağrılır
   */
  onUploadComplete?: (url: string) => void;
  
  /**
   * Upload hatası olduğunda çağrılır
   */
  onUploadError?: (error: string) => void;
  
  /**
   * Component'in disabled durumu
   */
  disabled?: boolean;
  
  /**
   * Klasör adı (opsiyonel override)
   */
  className?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Show progress during upload
   */
  showProgress?: boolean;
}

export function ImageUpload({
  category,
  value,
  onChange,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  disabled = false,
  className,
  placeholder,
  showProgress = true,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Kategori konfigürasyonu al
  const getConfigKey = (cat: ImageCategory): keyof typeof IMAGE_PRESET_CONFIGS => {
    switch (cat) {
      case 'user-profile':
        return 'USER_PROFILE';
      case 'user-banner':
        return 'USER_BANNER';
      case 'anime-cover':
        return 'ANIME_COVER';
      case 'anime-banner':
        return 'ANIME_BANNER';
      case 'episode-thumbnail':
        return 'EPISODE_THUMBNAIL';
      default:
        throw new Error(`Unsupported image category: ${cat}`);
    }
  };

  const config = IMAGE_PRESET_CONFIGS[getConfigKey(category)];
  
  // File validation
  const validateFile = useCallback((file: File): string | null => {
    // Format kontrolü
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !config.allowedFormats.includes(fileExtension as any)) {
      return `Desteklenen formatlar: ${config.allowedFormats.join(', ')}`;
    }
    
    // Size kontrolü
    if (file.size > config.maxSizeBytes) {
      const maxSizeMB = config.maxSizeBytes / (1024 * 1024);
      return `Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz`;
    }
    
    return null;
  }, [config]);
  
  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onUploadError?.(validationError);
      return;
    }
    
    setError(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Call onChange with file
    onChange(file);
    
    // Simulate upload progress if needed
    if (showProgress) {
      setIsUploading(true);
      setUploadProgress(0);
      onUploadStart?.();
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90%, real upload will complete
          }
          return prev + 10;
        });
      }, 100);
      
      // Complete after 2 seconds (simulation)
      setTimeout(() => {
        setUploadProgress(100);
        setIsUploading(false);
        onUploadComplete?.(url);
      }, 2000);
    }
  }, [validateFile, onChange, onUploadStart, onUploadComplete, onUploadError, showProgress]);
  
  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);
  
  // Handle remove
  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    onChange(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);
  
  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);
  
  return (
    <div className={cn('space-y-2', className)}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors duration-200',
          'hover:bg-muted/50 cursor-pointer',
          isDragOver && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
          previewUrl ? 'border-solid' : 'border-muted-foreground/25'
        )}
      >
        {/* Preview Image */}
        {previewUrl && (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              width={config.dimensions.width}
              height={config.dimensions.height}
              unoptimized={previewUrl.startsWith('blob:')}
            />
            
            {/* Remove Button */}
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Upload Progress Overlay */}
            {isUploading && showProgress && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg space-y-2 min-w-48">
                  <div className="text-sm font-medium text-center">
                    Yükleniyor...
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <div className="text-xs text-muted-foreground text-center">
                    %{uploadProgress}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Upload Placeholder */}
        {!previewUrl && (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              {isDragOver ? (
                <Upload className="w-full h-full text-primary" />
              ) : (
                <ImageIcon className="w-full h-full text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {placeholder || (
                  isDragOver 
                    ? 'Dosyayı bırak' 
                    : 'Dosya seç veya sürükle'
                )}
              </p>
              
              <p className="text-xs text-muted-foreground">
                Maksimum: {Math.round(config.maxSizeBytes / (1024 * 1024))}MB
              </p>
              
              <p className="text-xs text-muted-foreground">
                Desteklenen formatlar: {config.allowedFormats.join(', ')}
              </p>
              
              {config.dimensions && (
                <p className="text-xs text-muted-foreground">
                  Önerilen boyut: {config.dimensions.width}x{config.dimensions.height}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={config.allowedFormats.map(f => `.${f}`).join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {/* Current Value Info */}
      {value && !previewUrl && (
        <div className="text-xs text-muted-foreground">
          Mevcut dosya mevcut
        </div>
      )}
    </div>
  );
}
