'use client';

import { useState } from 'react';
import { mockAnimes } from '@/lib/mock/anime.mock';
import { AnimeFilters } from './anime-filters/anime-filters';
import { AnimeSortView } from './anime-sort-view/anime-sort-view';
import { AnimeGrid } from './anime-grid/anime-grid';
import { AnimeSeries } from '@prisma/client';

export function AnimeListPage() {
  const [animes, setAnimes] = useState<AnimeSeries[]>(mockAnimes);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [sortBy, setSortBy] = useState<'popularity' | 'anilistAverageScore' | 'createdAt'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtreleme ve sıralama işlemleri burada yapılacak
  const handleFiltersChange = (filters: any) => {
    // Mock filtreleme - gerçek implementasyonda API çağrısı yapılacak
    console.log('Filters changed:', filters);
  };

  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    
    // Mock sıralama
    const sortedAnimes = [...animes].sort((a, b) => {
      const aValue = a[newSortBy] || 0;
      const bValue = b[newSortBy] || 0;
      
      if (newSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setAnimes(sortedAnimes);
  };

  const handleViewModeChange = (newViewMode: typeof viewMode) => {
    setViewMode(newViewMode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtreler */}
      <AnimeFilters onFiltersChange={handleFiltersChange} />
      
      {/* Sıralama ve Görünüm */}
      <AnimeSortView 
        sortBy={sortBy}
        sortOrder={sortOrder}
        viewMode={viewMode}
        onSortChange={handleSortChange}
        onViewModeChange={handleViewModeChange}
      />
      
      {/* Anime Grid */}
      <AnimeGrid 
        animes={animes} 
        viewMode={viewMode}
      />
    </div>
  );
}
