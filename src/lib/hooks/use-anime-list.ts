// Anime list hook - React Query + Zustand

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getAnimes } from '@/lib/actions/anime/anime-list.action';
import { useAnimeListStore } from '@/lib/stores/anime-list.store';
import { AnimeListResponse } from '@/lib/types/api/anime-list.api';
import { queryKeys } from '@/lib/constants/query-keys';

export function useAnimeList() {
  const { filters, setLoading, setError } = useAnimeListStore();

  const query = useQuery({
    queryKey: queryKeys.anime.series.list(filters),
    queryFn: () => getAnimes(filters),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });

  // Store'u güncelle
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.error) {
      setError(query.error.message || 'Anime listesi yüklenirken hata oluştu');
    } else {
      setError(null);
    }
  }, [query.error, setError]);

  return {
    data: query.data?.success ? query.data.data as AnimeListResponse : null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
