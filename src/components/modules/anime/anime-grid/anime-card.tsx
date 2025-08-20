'use client';

import { AnimeSeries } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AnimeCardProps {
  anime: AnimeSeries;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Card 
      className="cursor-pointer h-64 overflow-hidden p-0 rounded-sm"
    >
      {/* Cover Image */}
      <div className="relative h-full">
        <Image
          src={anime.coverImage || '/images/placeholder-anime.jpg'}
          alt={anime.title}
          fill
          className="object-cover"
        />
        
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
    </Card>
  );
}
