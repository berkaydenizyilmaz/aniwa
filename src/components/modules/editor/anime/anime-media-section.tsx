'use client';

import { useState, useRef } from 'react';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { LoadingKey } from '@/lib/constants/loading.constants';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface AnimeMediaSectionProps {
  form: {
    register: UseFormRegister<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    setValue: UseFormSetValue<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    formState: { errors: FieldErrors<CreateAnimeSeriesInput | UpdateAnimeSeriesInput> };
  };
  isLoading: (key: LoadingKey) => boolean;
  loadingKey: LoadingKey;
}

export function AnimeMediaSection({ form, isLoading, loadingKey }: AnimeMediaSectionProps) {
  const { register, setValue, formState: { errors } } = form;
  
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    file: File,
    setPreview: (preview: string | null) => void,
    setValueField: 'coverImageFile' | 'bannerImageFile'
  ) => {
    if (!file) return;

    // Dosya boyutu kontrolü
    const maxSize = setValueField === 'coverImageFile' 
      ? UPLOAD_CONFIGS.ANIME_COVER.maxSize 
      : UPLOAD_CONFIGS.ANIME_BANNER.maxSize;
    
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      alert(`Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz`);
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları kabul edilir');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setValue(setValueField, result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (
    setPreview: (preview: string | null) => void,
    setValueField: 'coverImageFile' | 'bannerImageFile'
  ) => {
    setPreview(null);
    setValue(setValueField, undefined);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Görsel İçerik</h3>
        <p className="text-sm text-muted-foreground">Anime&apos;nin görsel içeriklerini ekleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kapak Resmi */}
        <div className="space-y-3">
          <Label htmlFor="coverImage">Kapak Resmi</Label>
          
          {coverPreview ? (
            <div className="relative border rounded-lg overflow-hidden">
              <Image
                src={coverPreview}
                alt="Kapak resmi önizleme"
                width={400}
                height={600}
                className="w-full h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveFile(setCoverPreview, 'coverImageFile')}
                disabled={isLoading(loadingKey)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file, setCoverPreview, 'coverImageFile');
                  }
                }}
                disabled={isLoading(loadingKey)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => coverInputRef.current?.click()}
                disabled={isLoading(loadingKey)}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Kapak Resmi Seç
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Maksimum {Math.round(UPLOAD_CONFIGS.ANIME_COVER.maxSize / 1024 / 1024)}MB, JPEG, PNG, WebP
              </p>
            </div>
          )}
          
          {errors.coverImageFile && (
            <p className="text-sm text-destructive">{errors.coverImageFile.message}</p>
          )}
        </div>

        {/* Banner Resmi */}
        <div className="space-y-3">
          <Label htmlFor="bannerImage">Banner Resmi</Label>
          
          {bannerPreview ? (
            <div className="relative border rounded-lg overflow-hidden">
              <Image
                src={bannerPreview}
                alt="Banner resmi önizleme"
                width={1200}
                height={400}
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveFile(setBannerPreview, 'bannerImageFile')}
                disabled={isLoading(loadingKey)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file, setBannerPreview, 'bannerImageFile');
                  }
                }}
                disabled={isLoading(loadingKey)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isLoading(loadingKey)}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Banner Resmi Seç
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Maksimum {Math.round(UPLOAD_CONFIGS.ANIME_BANNER.maxSize / 1024 / 1024)}MB, JPEG, PNG, WebP
              </p>
            </div>
          )}
          
          {errors.bannerImageFile && (
            <p className="text-sm text-destructive">{errors.bannerImageFile.message}</p>
          )}
        </div>
      </div>

      {/* Tanıtım Videosu */}
      <div className="space-y-2">
        <Label htmlFor="trailer">Tanıtım Videosu URL</Label>
        <Input
          id="trailer"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          {...register('trailer')}
          disabled={isLoading(loadingKey)}
        />
        {errors.trailer && (
          <p className="text-sm text-destructive">{errors.trailer.message}</p>
        )}
      </div>
    </div>
  );
} 