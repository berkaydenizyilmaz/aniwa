'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-muted-foreground">Bir Hata Oluştu</h1>
              <p className="text-muted-foreground">
                Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
              </p>
            </div>
            
            <Button onClick={reset} className="w-full">
              Tekrar Dene
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 