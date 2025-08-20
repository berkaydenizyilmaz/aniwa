'use client';

import { AnimeSeries } from '@prisma/client';
import { Star, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AnimeListItemProps {
  anime: AnimeSeries;
}

export function AnimeListItem({ anime }: AnimeListItemProps) {
  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Cover Image */}
          <div className="relative w-16 h-24 flex-shrink-0">
            <Image
              src={anime.coverImage || '/images/placeholder-anime.jpg'}
              alt={anime.title}
              fill
              className="object-cover rounded"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground line-clamp-1">
                  {anime.title}
                </h3>
                {anime.englishTitle && anime.englishTitle !== anime.title && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {anime.englishTitle}
                  </p>
                )}
                {anime.synopsis && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {anime.synopsis}
                  </p>
                )}
              </div>

              {/* Score */}
              {anime.anilistAverageScore && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{anime.anilistAverageScore.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={anime.status === 'FINISHED' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {anime.status === 'FINISHED' ? 'Tamamlandı' : 
                 anime.status === 'RELEASING' ? 'Devam Ediyor' : 
                 anime.status === 'NOT_YET_RELEASED' ? 'Yakında' : 
                 anime.status === 'CANCELLED' ? 'İptal' : 'Ara Verdi'}
              </Badge>
              
              {anime.type && (
                <Badge variant="outline" className="text-xs">
                  {anime.type}
                </Badge>
              )}
              
              {anime.seasonYear && (
                <span className="text-xs text-muted-foreground">
                  {anime.seasonYear}
                </span>
              )}
              
              {anime.episodes && (
                <span className="text-xs text-muted-foreground">
                  {anime.episodes} bölüm
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
