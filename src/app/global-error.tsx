'use client'

import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">Bir Şeyler Ters Gitti</h1>
              <p className="text-muted-foreground">
                Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </p>
              
              {/* Development'ta error detayı göster */}
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left mt-4 p-3 bg-muted rounded border text-sm">
                  <summary className="cursor-pointer font-medium">
                    Hata Detayları (Geliştirici)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="mt-2 text-muted-foreground">
                      Error ID: {error.digest}
                    </p>
                  )}
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Tekrar Dene
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Ana Sayfaya Git
                </Link>
              </Button>
            </div>

            {/* Help Section */}
            <div className="pt-4 border-t border-border text-sm text-muted-foreground">
              <p>
                Sorun devam ederse, lütfen{" "}
                <Link 
                  href="/contact" 
                  className="text-primary hover:underline"
                >
                  bizimle iletişime geçin
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 