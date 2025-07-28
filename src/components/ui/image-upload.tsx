'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { X, Upload } from 'lucide-react';

interface ImageUploadProps {
  id: string;
  label: string;
  accept: string;
  maxSize: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  id,
  label,
  accept,
  maxSize,
  value,
  onChange,
  disabled,
  className
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // value prop'u değiştiğinde preview'i güncelle
  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  // Dosya seçildiğinde
  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      alert(`Dosya boyutu ${maxSize / (1024 * 1024)}MB'dan büyük olamaz`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir');
      return;
    }

    onChange(file);
    
    // Preview oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Dosya kaldır
  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {preview ? (
          // Yüklenen resim preview
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={128}
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          // Upload area
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Resim yüklemek için tıklayın veya sürükleyin
            </p>
            <p className="text-xs text-muted-foreground">
              Maksimum {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
} 