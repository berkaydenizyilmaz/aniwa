'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  itemCount?: number;
  showSearch?: boolean;
  showActionButton?: boolean;
}

export function LoadingSkeleton({ 
  itemCount = 5,
  showSearch = true,
  showActionButton = true
}: LoadingSkeletonProps) {
  // Header
  const header = (
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32 bg-muted/60" />
      {showActionButton && <Skeleton className="h-9 w-24 bg-muted/60" />}
    </div>
  );

  // Search skeleton
  const searchSkeleton = showSearch && (
    <Skeleton className="h-10 w-full bg-muted/60" />
  );

  // Items list
  const itemsList = (
    <div className="space-y-2">
      {Array.from({ length: itemCount }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-muted/60" />
      ))}
    </div>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/20 shadow-lg">
      <CardHeader>
        {header}
        {searchSkeleton}
      </CardHeader>
      <CardContent>
        {itemsList}
      </CardContent>
    </Card>
  );
} 