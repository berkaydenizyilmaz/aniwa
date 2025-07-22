'use client';

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          {showActionButton && <Skeleton className="h-9 w-24" />}
        </div>
        {showSearch && <Skeleton className="h-10 w-full" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: itemCount }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 