'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-destructive">Bir Hata Oluştu</h1>
        <p className="text-muted-foreground">Beklenmeyen bir hata meydana geldi.</p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  )
}