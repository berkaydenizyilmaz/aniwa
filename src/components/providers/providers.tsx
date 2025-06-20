// Aniwa Projesi - Ana Providers Component
// Bu component tüm provider'ları toplar ve layout'a temiz bir interface sunar

'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // React Query client'ı component içinde oluştur (SSR için)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 dakika
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        visibleToasts={4}
      />
    </QueryClientProvider>
  )
} 