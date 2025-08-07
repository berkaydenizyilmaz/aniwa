'use client';

import { Skeleton } from './skeleton';

type LoadingProps = {
  variant?: 'card' | 'inline' | 'page';
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

  return (
    <div className="grid gap-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}


