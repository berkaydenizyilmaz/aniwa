'use client';

import { Skeleton } from './skeleton';

type LoadingProps = {
  variant?: 'card' | 'inline' | 'page' | 'anime-grid';
  lines?: number;
};

export function Loading({ variant = 'card', lines = 3 }: LoadingProps) {
  if (variant === 'inline') {
    return <span className="text-sm text-muted-foreground">Yükleniyor…</span>;
  }

  if (variant === 'page') {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Yükleniyor…
        </div>
      </div>
    );
  }

  if (variant === 'anime-grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}


