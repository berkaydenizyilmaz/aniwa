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
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';

interface AnimeSeriesMediaProps {
  isPending?: boolean;
}

export function AnimeSeriesMedia({ isPending }: AnimeSeriesMediaProps) {
  const form = useFormContext<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>();

  return (
    <div className="space-y-6">
      {/* Kapak ve Banner Görselleri - Yan Yana */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Kapak Görseli */}
        <FormField
          control={form.control}
          name="coverImageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapak Görseli</FormLabel>
              <FormControl>
                <ImageUpload
                  category="ANIME_COVER"
                  value={field.value ? URL.createObjectURL(field.value) : undefined}
                  onChange={(file) => field.onChange(file)}
                  disabled={isPending}
                  placeholder="Anime kapak görselini seçin"
                  showProgress={isPending}
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
            <FormItem className="flex-1">
              <FormLabel>Banner Görseli</FormLabel>
              <FormControl>
                <ImageUpload
                  category="ANIME_BANNER"
                  value={field.value ? URL.createObjectURL(field.value) : undefined}
                  onChange={(file) => field.onChange(file)}
                  disabled={isPending}
                  placeholder="Anime banner görselini seçin"
                  showProgress={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
} 