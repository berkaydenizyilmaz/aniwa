'use client';

import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { LoadingKey } from '@/lib/constants/loading.constants';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload';

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

  const handleCoverUpload = (url: string) => {
    setValue('coverImage', url);
  };

  const handleBannerUpload = (url: string) => {
    setValue('bannerImage', url);
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
          <CloudinaryUpload
            onUploadComplete={handleCoverUpload}
            onUploadError={(error) => console.error('Cover upload error:', error)}
            disabled={isLoading(loadingKey)}
            accept={UPLOAD_CONFIGS.ANIME_COVER.accept}
            maxSize={UPLOAD_CONFIGS.ANIME_COVER.maxSize}
          />
          {errors.coverImage && (
            <p className="text-sm text-destructive">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Banner Resmi */}
        <div className="space-y-3">
          <Label htmlFor="bannerImage">Banner Resmi</Label>
          <CloudinaryUpload
            onUploadComplete={handleBannerUpload}
            onUploadError={(error) => console.error('Banner upload error:', error)}
            disabled={isLoading(loadingKey)}
            accept={UPLOAD_CONFIGS.ANIME_BANNER.accept}
            maxSize={UPLOAD_CONFIGS.ANIME_BANNER.maxSize}
          />
          {errors.bannerImage && (
            <p className="text-sm text-destructive">{errors.bannerImage.message}</p>
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