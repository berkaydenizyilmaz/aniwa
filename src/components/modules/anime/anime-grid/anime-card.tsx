'use client';

import { useState } from 'react';
import { AnimeSeries } from '@prisma/client';
import { Star, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AnimeCardProps {
  anime: AnimeSeries;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
        "h-80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full">
        {/* Cover Image */}
        <div className="relative h-full">
          <Image
            src={anime.coverImage || '/images/placeholder-anime.jpg'}
            alt={anime.title}
            fill
            className="object-cover rounded-t-lg"
          />
          
          {/* Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center justify-center h-full">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Score Badge */}
          {anime.anilistAverageScore && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.anilistAverageScore.toFixed(1)}</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant={anime.status === 'FINISHED' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {anime.status === 'FINISHED' ? 'Tamamlandı' : 
               anime.status === 'RELEASING' ? 'Devam Ediyor' : 
               anime.status === 'NOT_YET_RELEASED' ? 'Yakında' : 
               anime.status === 'CANCELLED' ? 'İptal' : 'Ara Verdi'}
            </Badge>
          </div>

          {/* Title */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3",
            "p-3"
          )}>
            <h3 className={cn(
              "text-white font-medium line-clamp-2",
              "text-base"
            )}>
              {anime.title}
            </h3>
            
            {anime.englishTitle && anime.englishTitle !== anime.title && (
              <p className="text-white/70 text-xs mt-1 line-clamp-1">
                {anime.englishTitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
