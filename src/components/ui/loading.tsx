import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Temel Spinner Bileşeni
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )}
    />
  );
}

// Button Loading State
interface ButtonSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonSpinner({ size = 'sm', className }: ButtonSpinnerProps) {
  return <Spinner size={size} className={cn('mr-2', className)} />;
}

// Page Loading Overlay
interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  message = 'Yükleniyor...', 
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex flex-col items-center space-y-4 text-center">
        <Spinner size="xl" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline Loading State
interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoading({ 
  message = 'Yükleniyor...', 
  size = 'md',
  className 
}: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Spinner size={size} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}

// Skeleton Bileşenleri
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

// Kart Skeleton
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-3 p-4 border border-border rounded-lg', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// Anime Kartı Skeleton (Portrait)
export function AnimeCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('w-full max-w-[200px] space-y-3', className)}>
      {/* Anime Poster */}
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      
      {/* Anime Başlığı */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Rating ve Yıl */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
      
      {/* Durum Badge */}
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

// Liste Skeleton
export function ListSkeleton({ 
  count = 5, 
  className 
}: { count?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Tablo Skeleton
export function TableSkeleton({ 
  rows = 5, 
  cols = 4, 
  className 
}: { rows?: number; cols?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex space-x-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-2">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Profil Skeleton
export function ProfileSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center space-x-4 p-4', className)}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// Progress Bar
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showLabel = false 
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function CircularProgress({
  value,
  max = 100,
  size = 40,
  strokeWidth = 4,
  className,
  showLabel = false,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-300 ease-out"
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-medium">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// Pulse Animation (Placeholder için)
export function PulseLoader({ className }: SkeletonProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}

// Content Loading (Metin için)
export function ContentSkeleton({ 
  lines = 3, 
  className 
}: { lines?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full' // Son satır daha kısa
          )} 
        />
      ))}
    </div>
  );
} 