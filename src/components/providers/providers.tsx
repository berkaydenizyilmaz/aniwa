// Aniwa Projesi - Ana Providers Component
// Bu component tüm provider'ları toplar ve layout'a temiz bir interface sunar

"use client"

import { type ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { ThemeProvider } from "./theme-provider"
import { SessionProvider } from "./session-provider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // React Query client'ı state olarak tutuyoruz
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
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
    </SessionProvider>
  )
} 