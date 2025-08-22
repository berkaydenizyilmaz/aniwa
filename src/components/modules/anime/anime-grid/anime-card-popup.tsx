'use client';

import { AnimeSeries } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimeCardPopupProps {
  anime: AnimeSeries;
  isVisible: boolean;
  position: { x: number; y: number };
}

export function AnimeCardPopup({ anime, isVisible, position }: AnimeCardPopupProps) {
  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        "fixed z-50 bg-white/95 backdrop-blur-sm border shadow-lg",
        "transform transition-all duration-200 ease-out",
        // Responsive boyutlar
        "w-72 p-3", // Mobil
        "sm:w-80 sm:p-4", // Tablet
        "lg:w-96 lg:p-5", // Desktop
        // Mobilde gizle
        "hidden sm:block"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Episode Info */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">
          Ep {anime.episodes} • {anime.status === 'RELEASING' ? 'Releasing' : 'Finished'}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm">⭐</span>
          <span className="text-sm font-medium">{anime.averageScore?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>

      {/* Studio */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-800">
          Studio Name
        </span>
      </div>

      {/* Format & Episodes */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          {anime.type} • {anime.episodes} episodes
        </span>
      </div>

      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
          Action
        </span>
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          Drama
        </span>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Fantasy
        </span>
      </div>
    </Card>
  );
}
