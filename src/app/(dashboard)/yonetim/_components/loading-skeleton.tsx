'use client';

import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  itemCount?: number;
  showSearch?: boolean;
  showActionButton?: boolean;
}

export const LoadingSkeleton = memo(function LoadingSkeleton({ 
  itemCount = 5,
  showSearch = true,
  showActionButton = true
}: LoadingSkeletonProps) {
  // Header render fonksiyonu - useCallback ile optimize edildi
  const renderHeader = useCallback(() => (
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32 bg-muted/60" />
      {showActionButton && <Skeleton className="h-9 w-24 bg-muted/60" />}
    </div>
  ), [showActionButton]);

  // Search skeleton render fonksiyonu - useCallback ile optimize edildi
  const renderSearchSkeleton = useCallback(() => (
    showSearch && <Skeleton className="h-10 w-full bg-muted/60" />
  ), [showSearch]);

  // Item skeleton render fonksiyonu - useCallback ile optimize edildi
  const renderItemSkeleton = useCallback((index: number) => (
    <Skeleton key={index} className="h-16 w-full bg-muted/60" />
  ), []);

  // Items list render fonksiyonu - useCallback ile optimize edildi
  const renderItemsList = useCallback(() => (
    <div className="space-y-2">
      {Array.from({ length: itemCount }).map((_, i) => renderItemSkeleton(i))}
    </div>
  ), [itemCount, renderItemSkeleton]);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/20 shadow-lg">
      <CardHeader>
        {renderHeader()}
        {renderSearchSkeleton()}
      </CardHeader>
      <CardContent>
        {renderItemsList()}
      </CardContent>
    </Card>
  );
}); 