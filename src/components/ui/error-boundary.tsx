'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary yakaladı:', error, errorInfo);
    
    // Hata raporlama servisi (Sentry vs.) burada çağrılabilir
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-destructive">
              Bir hata oluştu
            </h2>
            <p className="text-sm text-muted-foreground">
              Bu bölümde beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium">
                  Hata Detayları (Development)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <Button onClick={this.handleReset} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based wrapper için alternatif
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div className="space-y-2">
        <h3 className="font-semibold text-destructive">Bir şeyler ters gitti</h3>
        <p className="text-sm text-muted-foreground">
          Bu bölüm yüklenirken bir hata oluştu.
        </p>
      </div>
      <Button onClick={resetError} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Tekrar Dene
      </Button>
    </div>
  );
}

// Farklı seviyelerde kullanım için wrapper'lar
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-destructive">
              Sayfa Yüklenemedi
            </h1>
            <p className="text-muted-foreground">
              Bu sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sayfayı Yenile
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-32 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
            <p className="mt-2 text-sm text-destructive">
              Bu bölüm yüklenemedi
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}