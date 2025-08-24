// Anime list store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimeListFiltersInput } from '@/lib/schemas/anime-list.schema';
import { ANIME_DOMAIN } from '@/lib/constants/domains/anime';

interface AnimeListState {
  // Filters
  filters: AnimeListFiltersInput;
  
  // View Mode
  viewMode: 'card' | 'list';
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFilters: (filters: Partial<AnimeListFiltersInput>) => void;
  setViewMode: (mode: 'card' | 'list') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter Actions
  updateFilter: <K extends keyof AnimeListFiltersInput>(
    key: K,
    value: AnimeListFiltersInput[K]
  ) => void;
  
  // Reset
  resetFilters: () => void;
  reset: () => void;
}

const defaultFilters: AnimeListFiltersInput = {
  sortBy: ANIME_DOMAIN.LIST.SORT.DEFAULT,
  sortOrder: ANIME_DOMAIN.LIST.SORT.DEFAULT_ORDER,
  page: ANIME_DOMAIN.LIST.PAGINATION.DEFAULT_PAGE,
  limit: ANIME_DOMAIN.LIST.PAGINATION.DEFAULT_LIMIT,
  isAdult: ANIME_DOMAIN.LIST.FILTERS.DEFAULT_ADULT
};

export const useAnimeListStore = create<AnimeListState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      viewMode: 'card',
      isLoading: false,
      error: null,
      
      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        
        // Reset to first page when filters change
        if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
          updatedFilters.page = 1;
        }
        
        set({ filters: updatedFilters });
      },
      
      setViewMode: (viewMode) => set({ viewMode }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      updateFilter: (key, value) => {
        const { filters } = get();
        const newFilters = { ...filters, [key]: value };
        
        // Reset to first page when filters change
        if (key !== 'page' && key !== 'limit') {
          newFilters.page = 1;
        }
        
        set({ filters: newFilters });
      },
      
      resetFilters: () => set({ filters: defaultFilters }),
      reset: () => set({ 
        filters: defaultFilters, 
        viewMode: 'card', 
        isLoading: false, 
        error: null 
      }),
    }),
    {
      name: 'anime-list-storage',
      partialize: (state) => ({ 
        filters: state.filters, 
        viewMode: state.viewMode 
      }),
    }
  )
);
