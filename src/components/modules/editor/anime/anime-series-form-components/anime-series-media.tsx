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
import { IMAGE_TYPES } from '@/lib/constants/image.constants';
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
                imageType={IMAGE_TYPES.ANIME_COVER}
                value={field.value || null}
                onChange={field.onChange}
                disabled={isPending}
                variant="default"
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
                imageType={IMAGE_TYPES.ANIME_BANNER}
                value={field.value || null}
                onChange={field.onChange}
                disabled={isPending}
                variant="default"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 