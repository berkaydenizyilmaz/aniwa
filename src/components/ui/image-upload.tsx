'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { User, Monitor, ImageIcon, Upload, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMAGE_PRESET_CONFIGS } from '@/lib/constants/cloudinary.constants';
import type { ImageCategory } from '@/lib/types/cloudinary';

interface ImageUploadProps {
  category: ImageCategory;
  value?: string | null;
  onChange: (file: File | null) => void;
  onDelete?: () => void;
  disabled?: boolean;
  placeholder?: string;
  showProgress?: boolean;
  showDeleteProgress?: boolean;
  className?: string;
  error?: string;
}

export function ImageUpload({
  category,
  value,
  onChange,
  onDelete,
  disabled = false,
  placeholder,
  showProgress = false,
  showDeleteProgress = false,
  className,
  error,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const config = IMAGE_PRESET_CONFIGS[category === 'USER_PROFILE' ? 'USER_PROFILE' : 
                                     category === 'USER_BANNER' ? 'USER_BANNER' :
                                     category === 'ANIME_COVER' ? 'ANIME_COVER' :
                                     category === 'ANIME_BANNER' ? 'ANIME_BANNER' :
                                     category === 'EPISODE_THUMBNAIL' ? 'EPISODE_THUMBNAIL' : 'DEFAULT'];

  // Kategori bazlı UI ayarları
  const getUIConfig = (cat: ImageCategory) => {
    switch (cat) {
      case 'USER_PROFILE':
        return {
          size: 'w-40 h-40',
          aspectRatio: 'aspect-square',
          icon: User,
          iconSize: 'w-8 h-8',
          title: 'Profil Resmi',
          description: 'Profil resminizi seçin',
        };
      case 'USER_BANNER':
        return {
          size: 'w-full h-40',
          aspectRatio: 'aspect-[3/1]',
          icon: Monitor,
          iconSize: 'w-6 h-6',
          title: 'Profil Banner',
          description: 'Profil banner\'ınızı seçin',
        };
      case 'ANIME_COVER':
        return {
          size: 'w-32 h-48',
          aspectRatio: 'aspect-[2/3]',
          icon: ImageIcon,
          iconSize: 'w-6 h-6',
          title: 'Anime Kapak',
          description: 'Anime kapak görselini seçin',
        };
      case 'ANIME_BANNER':
        return {
          size: 'w-full h-32',
          aspectRatio: 'aspect-[3/1]',
          icon: Monitor,
          iconSize: 'w-5 h-5',
          title: 'Anime Banner',
          description: 'Anime banner görselini seçin',
        };
      case 'EPISODE_THUMBNAIL':
        return {
          size: 'w-64 h-36',
          aspectRatio: 'aspect-[16/9]',
          icon: ImageIcon,
          iconSize: 'w-5 h-5',
          title: 'Episode Thumbnail',
          description: 'Episode thumbnail seçin',
        };
      default:
        return {
          size: 'w-40 h-40',
          aspectRatio: 'aspect-square',
          icon: ImageIcon,
          iconSize: 'w-8 h-8',
          title: 'Görsel',
          description: 'Görsel seçin',
        };
    }
  };

  const uiConfig = getUIConfig(category);

  const handleFileSelect = useCallback((file: File) => {
    if (file) {
      onChange(file);
    }
  }, [onChange]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => 
      config.allowedFormats.some(format => 
        file.name.toLowerCase().endsWith(format.toLowerCase())
      )
    );

    if (imageFile) {
      if (imageFile.size <= config.maxSizeBytes) {
        handleFileSelect(imageFile);
      }
    }
  };

  const isUploading = showProgress;
  const isDeleting = showDeleteProgress;

  return (
    <div className={cn(uiConfig.size, className)}>
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
          'relative group cursor-pointer transition-all duration-300',
          uiConfig.size,
          uiConfig.aspectRatio,
          'rounded-xl overflow-hidden',
          isDragOver && 'scale-105',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'ring-2 ring-destructive'
        )}
      >
        {isUploading ? (
          // Loading State
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/30 border-t-primary"></div>
              </div>
              <p className="text-sm font-medium text-primary">Yükleniyor...</p>
            </div>
          </div>
                ) : value ? (
          // Image Display State
          <div className="relative w-full h-full border-2 border-dashed border-muted-foreground/40 rounded-xl hover:border-primary/60 hover:shadow-md transition-all duration-300 cursor-pointer group">
                          <Image
                src={value}
                alt={uiConfig.title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            
            {/* Fixed Delete Button - All Sizes */}
            {onDelete && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDeleting) {
                    onDelete();
                  }
                }}
                disabled={isDeleting}
                className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 rounded-full z-10"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-2.5 w-2.5 md:h-3 md:w-3 border-2 border-white/30 border-t-white"></div>
                ) : (
                  <X className="w-2.5 h-2.5 md:h-3 md:w-3" />
                )}
              </Button>
            )}
          </div>
        ) : (
          // Empty Upload State
          <div className={cn(
            'w-full h-full flex flex-col items-center justify-center text-center',
            uiConfig.size === 'w-40 h-40' ? 'p-3' : 'p-4',
            'bg-gradient-to-br from-muted/20 to-muted/40',
            'border-2 border-dashed border-muted-foreground/40',
            'hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/20',
            'transition-all duration-300'
          )}>
            <div className="mb-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-muted/60 text-muted-foreground',
                'group-hover:bg-primary/20 group-hover:text-primary',
                'transition-all duration-300'
              )}>
                {isDragOver ? (
                  <Upload className={uiConfig.iconSize} />
                ) : (
                  <uiConfig.icon className={uiConfig.iconSize} />
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className={cn(
                'font-medium text-foreground',
                uiConfig.size === 'w-40 h-40' ? 'text-xs' : 'text-sm'
              )}>
                {placeholder || uiConfig.description}
              </p>
              <p className={cn(
                'text-muted-foreground',
                uiConfig.size === 'w-40 h-40' ? 'text-[10px]' : 'text-xs'
              )}>
                Tıklayın veya sürükleyip bırakın
              </p>
              <p className={cn(
                'text-muted-foreground/70',
                uiConfig.size === 'w-40 h-40' ? 'text-[10px]' : 'text-xs'
              )}>
                {config.allowedFormats.slice(0, 3).join(', ').toUpperCase()} • {Math.round(config.maxSizeBytes / (1024 * 1024))}MB max
              </p>
            </div>
          </div>
        )}
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