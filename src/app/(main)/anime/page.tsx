'use client';

import { useAnimeList } from '@/lib/hooks/use-anime-list';
import { useAnimeListStore } from '@/lib/stores/anime-list.store';
import { AnimeFilters } from '@/components/modules/anime/anime-filters/anime-filters';
import { AnimeSortView } from '@/components/modules/anime/anime-sort-view/anime-sort-view';
import { AnimeGrid } from '@/components/modules/anime/anime-grid/anime-grid';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { AnimeListFiltersInput } from '@/lib/schemas/anime-list.schema';

export default function AnimePage() {
  const { 
    filters, 
    viewMode, 
    setFilters, 
    setViewMode, 
    updateFilter 
  } = useAnimeListStore();
  
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useAnimeList();

  // Error toast
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Anime listesi yüklenirken hata oluştu');
    }
  }, [isError, error]);

  // Filtreleme değişikliği
  const handleFiltersChange = (newFilters: Partial<AnimeListFiltersInput>) => {
    // Mevcut filtreleri koru, yeni filtreleri ekle
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  // Sıralama değişikliği
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateFilter('sortBy', sortBy as any);
    updateFilter('sortOrder', sortOrder);
  };

  // Görünüm modu değişikliği
  const handleViewModeChange = (newViewMode: 'card' | 'list') => {
    setViewMode(newViewMode);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Filtreler */}
        <AnimeFilters onFiltersChange={handleFiltersChange} />
        
        {/* Sıralama ve Görünüm */}
        <AnimeSortView 
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
        />
        
        {/* Loading State */}
        {isLoading && !data && (
          <Loading variant="anime-grid" />
        )}
        
        {/* Anime Grid */}
        {data && !isLoading && (
          <AnimeGrid 
            animes={data.animes} 
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}
