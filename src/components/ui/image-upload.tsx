'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { IMAGE_CONFIG, type ImageType } from '@/lib/constants/image.constants';
import { quickValidateFile } from '@/lib/services/image/validation.service';
import { formatFileSize } from '@/lib/services/image/naming.service';

interface ImageUploadProps {
  imageType: ImageType;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'avatar';
}

export function ImageUpload({
  imageType,
  value,
  onChange,
  disabled = false,
  loading = false,
  className,
  variant = 'default'
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const config = IMAGE_CONFIG[imageType];
  
  if (!config) {
    console.error(`Image config not found for type: ${imageType}`);
    return (
      <div className={cn("space-y-2", className)}>
        <Card className="h-48 flex items-center justify-center">
          <p className="text-destructive">Hata: Geçersiz görsel türü</p>
        </Card>
      </div>
    );
  }
  
  // Value handling
  const existingUrl = typeof value === 'string' ? value : null;
  const selectedFile = value instanceof File ? value : null;
  
  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Quick validation
    const validation = quickValidateFile(file, imageType);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    
    // Set file
    onChange(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [imageType, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': config.allowedFormats.map(format => `.${format}`)
    },
    maxFiles: 1,
    disabled: disabled || loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  // Remove handler
  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  // Display URL
  const displayUrl = previewUrl || existingUrl;
  const hasContent = displayUrl || selectedFile;

  // Variant styles
  const getContainerStyles = () => {
    switch (variant) {
      case 'avatar':
        return 'w-24 h-24 rounded-full overflow-hidden border-4 border-muted bg-muted/50';
      case 'compact':
        return 'h-32';
      default:
        return 'h-48';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Card className={cn(
        "relative transition-all duration-200",
        getContainerStyles(),
        dragActive && "ring-2 ring-primary ring-offset-2",
        disabled && "opacity-50"
      )}>
        {hasContent ? (
          // Preview Mode
          <div className="relative w-full h-full group">
            {displayUrl && (
              <Image
                src={displayUrl}
                alt="Preview"
                fill
                className={cn(
                  "object-cover transition-all",
                  variant === 'avatar' ? "rounded-full" : "rounded-lg"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Loading overlay */}
            {loading && (
              <div className={cn(
                "absolute inset-0 bg-black/50 flex items-center justify-center",
                variant === 'avatar' ? "rounded-full" : "rounded-lg"
              )}>
                <div className="text-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Yükleniyor...</p>
                </div>
              </div>
            )}
            
            {/* Hover overlay with actions */}
            {!loading && (
              <div className={cn(
                "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
                variant === 'avatar' ? "rounded-full" : "rounded-lg"
              )}>
                {variant === 'avatar' ? (
                  // Avatar variant - compact buttons
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = config.allowedFormats.map(f => `.${f}`).join(',');
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) onDrop([file]);
                        };
                        input.click();
                      }}
                      disabled={disabled}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={handleRemove}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  // Default/compact variant - horizontal buttons
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = config.allowedFormats.map(f => `.${f}`).join(',');
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) onDrop([file]);
                        };
                        input.click();
                      }}
                      disabled={disabled}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Değiştir
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemove}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          // Upload Zone
          <div
            {...getRootProps()}
            className={cn(
              "w-full h-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
              variant === 'avatar' ? (
                isDragActive ? "border-primary bg-primary/5 rounded-full" : "border-muted-foreground/25 hover:border-muted-foreground/50 rounded-full"
              ) : (
                isDragActive ? "border-primary bg-primary/5 rounded-lg" : "border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg"
              ),
              (disabled || loading) && "cursor-not-allowed opacity-50"
            )}
          >
            <input {...getInputProps()} />
            
            {loading ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-muted-foreground mb-2 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Hazırlanıyor...</p>
              </div>
            ) : (
              <div className={cn(
                "text-center",
                variant === 'avatar' ? "p-2" : "p-4"
              )}>
                <Upload className={cn(
                  "mb-2 text-muted-foreground mx-auto",
                  variant === 'avatar' ? "w-6 h-6" : 
                  variant === 'compact' ? "w-6 h-6" : "w-10 h-10"
                )} />
                
                <div className="space-y-1">
                  {variant !== 'avatar' && (
                    <p className={cn(
                      "font-medium text-foreground",
                      variant === 'compact' ? "text-sm" : "text-base"
                    )}>
                      {isDragActive ? 'Dosyayı buraya bırakın' : 'Görsel yükleyin'}
                    </p>
                  )}
                  
                  <p className={cn(
                    "text-muted-foreground",
                    variant === 'avatar' ? "text-xs" :
                    variant === 'compact' ? "text-xs" : "text-sm"
                  )}>
                    {variant === 'avatar' ? 'Fotoğraf' : 'Tıklayın veya sürükleyin'}
                  </p>
                  
                  {variant !== 'avatar' && (
                    <p className="text-xs text-muted-foreground/70">
                      {config.allowedFormats.map(f => f.toUpperCase()).join(', ')} • 
                      Max {formatFileSize(config.maxSize)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* File info */}
      {selectedFile && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
          <span className="truncate">{selectedFile.name}</span>
          <span>{formatFileSize(selectedFile.size)}</span>
        </div>
      )}
    </div>
  );
}