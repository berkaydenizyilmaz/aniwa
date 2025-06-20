// Aniwa Projesi - Ana Providers Component
// Bu component tüm provider'ları toplar ve layout'a temiz bir interface sunar

'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // React Query client'ı state olarak tutuyoruz
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        
        {/* Toast Notifications */}
        <Toaster 
          position="bottom-right"
          richColors
          closeButton
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
} 