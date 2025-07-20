'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Hata loglama
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Bir Hata Oluştu</h1>
          <p className="text-muted-foreground">
            Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={reset}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    </div>
  );
} 