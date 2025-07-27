'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { LOADING_KEYS, LoadingKey } from '@/lib/constants/loading.constants';

interface AnimeMediaSectionProps {
  form: {
    register: UseFormRegister<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    formState: { errors: FieldErrors<CreateAnimeSeriesInput | UpdateAnimeSeriesInput> };
  };
  isLoading: (key: LoadingKey) => boolean;
}

export function AnimeMediaSection({ form, isLoading }: AnimeMediaSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Görsel İçerik</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kapak Resmi */}
        <div className="space-y-2">
          <Label htmlFor="coverImage">Kapak Resmi URL</Label>
          <Input
            id="coverImage"
            type="url"
            placeholder="https://example.com/cover.jpg"
            {...register('coverImage')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.coverImage && (
            <p className="text-sm text-destructive">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Banner Resmi */}
        <div className="space-y-2">
          <Label htmlFor="bannerImage">Banner Resmi URL</Label>
          <Input
            id="bannerImage"
            type="url"
            placeholder="https://example.com/banner.jpg"
            {...register('bannerImage')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.trailer && (
          <p className="text-sm text-destructive">{errors.trailer.message}</p>
        )}
      </div>
    </div>
  );
} 