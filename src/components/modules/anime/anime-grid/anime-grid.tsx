'use client';

import { AnimeSeries } from '@prisma/client';
import { AnimeCard } from './anime-card';
import { AnimeListItem } from './anime-list-item';

interface AnimeGridProps {
  animes: AnimeSeries[];
  viewMode: 'card' | 'list';
}

export function AnimeGrid({ animes, viewMode }: AnimeGridProps) {
  if (animes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">Anime bulunamadı</h3>
          <p className="text-sm text-muted-foreground">Filtrelerinizi değiştirmeyi deneyin</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {animes.map((anime) => (
          <AnimeListItem key={anime.id} anime={anime} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
