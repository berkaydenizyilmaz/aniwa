'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, User, Monitor } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
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
   * CSS class name
   */
  className?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Show progress indicator
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
  
  // Kategori bazlı UI ayarları
  const getUIConfig = (cat: ImageCategory) => {
    switch (cat) {
      case 'user-profile':
        return {
          height: 'h-24',
          icon: User,
          showCurrentImage: true,
          imageSize: 'w-16 h-16',
          layout: 'vertical' as const,
        };
      case 'user-banner':
        return {
          height: 'h-20',
          icon: Monitor,
          showCurrentImage: true,
          imageSize: 'w-20 h-12',
          layout: 'horizontal' as const,
        };
      default:
        return {
          height: 'h-20',
          icon: ImageIcon,
          showCurrentImage: false,
          imageSize: 'w-16 h-16',
          layout: 'horizontal' as const,
        };
    }
  };

  const uiConfig = getUIConfig(category);
  
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
    
    // Call onChange with file
    onChange(file);
    
    // Notify parent that upload started
    onUploadStart?.();
  }, [validateFile, onChange, onUploadStart, onUploadError]);
  
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
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, disabled]);
  
  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);
  
  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);
  
  const isUploading = showProgress;

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={config.allowedFormats.map(format => `.${format}`).join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors duration-200',
          uiConfig.height,
          'hover:bg-muted/50 cursor-pointer',
          isDragOver && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
          value ? 'border-solid border-muted-foreground/50' : 'border-muted-foreground/25'
        )}
      >
        {/* Upload Area */}
        <div className="p-4 h-full flex items-center justify-center">
          {/* Upload Status */}
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Yükleniyor...</span>
            </div>
          ) : uiConfig.showCurrentImage && value ? (
            // Mevcut resim gösterimi
            <div className={cn(
              'flex items-center space-x-3',
              uiConfig.layout === 'vertical' ? 'flex-col space-x-0 space-y-2' : ''
            )}>
              {/* Mevcut Resim */}
              <div className={cn('relative overflow-hidden rounded-lg flex-shrink-0', uiConfig.imageSize)}>
                <Image
                  src={value}
                  alt="Mevcut görsel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Upload Text */}
              <div className={cn('text-left', uiConfig.layout === 'vertical' ? 'text-center' : '')}>
                <p className="text-sm font-medium">
                  {placeholder || 'Değiştir'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.allowedFormats.join(', ').toUpperCase()}
                </p>
              </div>
            </div>
          ) : (
            // Upload alanı
            <div className={cn(
              'flex items-center space-x-3',
              uiConfig.layout === 'vertical' ? 'flex-col space-x-0 space-y-2' : ''
            )}>
              {/* Upload Icon */}
              <div className="w-8 h-8 flex-shrink-0">
                {isDragOver ? (
                  <Upload className="w-full h-full text-primary" />
                ) : (
                  <uiConfig.icon className="w-full h-full text-muted-foreground" />
                )}
              </div>
              
              {/* Upload Text */}
              <div className={cn('text-left', uiConfig.layout === 'vertical' ? 'text-center' : '')}>
                <p className="text-sm font-medium">
                  {placeholder || (
                    isDragOver 
                      ? 'Dosyayı bırak' 
                      : 'Dosya seç veya sürükle'
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.allowedFormats.join(', ').toUpperCase()} • Max {Math.round(config.maxSizeBytes / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-destructive flex items-center">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}