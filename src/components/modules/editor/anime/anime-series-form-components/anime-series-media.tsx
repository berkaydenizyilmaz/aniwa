'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
            <FormLabel>Kapak Görseli</FormLabel>
            <FormControl>
              {/* TODO: Image upload component will be added */}
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Cover Image</span>
              </div>
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
            <FormLabel>Banner Görseli</FormLabel>
            <FormControl>
              {/* TODO: Image upload component will be added */}
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Banner Image</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 