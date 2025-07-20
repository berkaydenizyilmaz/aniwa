'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5 dakika cache
            staleTime: 5 * 60 * 1000,
            // 10 dakika cache'de tut
            gcTime: 10 * 60 * 1000,
            // Hata durumunda 3 kez dene
            retry: 3,
            // Retry arası 1 saniye bekle
            retryDelay: 1000,
            // Refetch on window focus
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Hata durumunda 3 kez dene
            retry: 3,
            // Retry arası 1 saniye bekle
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 