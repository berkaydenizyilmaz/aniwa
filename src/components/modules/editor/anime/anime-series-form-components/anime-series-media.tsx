'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';

interface AnimeSeriesMediaProps {
  isPending?: boolean;
}

export function AnimeSeriesMedia({ isPending }: AnimeSeriesMediaProps) {
  const form = useFormContext<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>();

  return (
    <div className="space-y-6">
      {/* Kapak Görseli */}
      <FormField
        control={form.control}
        name="coverImageFile"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                id="coverImage"
                label="Kapak Görseli"
                accept={UPLOAD_CONFIGS.ANIME_COVER.accept}
                maxSize={UPLOAD_CONFIGS.ANIME_COVER.maxSize}
                value={field.value || null}
                onChange={field.onChange}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Banner Görseli */}
      <FormField
        control={form.control}
        name="bannerImageFile"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                id="bannerImage"
                label="Banner Görseli"
                accept={UPLOAD_CONFIGS.ANIME_BANNER.accept}
                maxSize={UPLOAD_CONFIGS.ANIME_BANNER.maxSize}
                value={field.value || null}
                onChange={field.onChange}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 