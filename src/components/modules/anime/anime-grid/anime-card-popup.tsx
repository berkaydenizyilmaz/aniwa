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
         // Responsive boyutlar - daha küçük
         "w-64 p-3", // Mobil
         "sm:w-72 sm:p-4", // Tablet
         "lg:w-80 lg:p-4", // Desktop
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
           {anime.episodes} Bölüm • {anime.status === 'RELEASING' ? 'Devam Ediyor' : 'Tamamlandı'}
         </span>
         <div className="flex items-center gap-1">
           <span className="text-sm">⭐</span>
           <span className="text-sm font-medium">{anime.averageScore?.toFixed(1) || 'N/A'}</span>
         </div>
       </div>

       {/* Format & Type */}
       <div className="mb-3">
         <span className="text-sm text-gray-600">
           {anime.type === 'TV' ? 'TV Dizisi' : anime.type} • {anime.duration} dk
         </span>
       </div>

       {/* Year & Season */}
       <div className="mb-4">
         <span className="text-sm text-gray-600">
           {anime.seasonYear} • {anime.season === 'SPRING' ? 'İlkbahar' : 
                               anime.season === 'SUMMER' ? 'Yaz' : 
                               anime.season === 'FALL' ? 'Sonbahar' : 'Kış'}
         </span>
       </div>

       {/* Genre Tags */}
       <div className="flex flex-wrap gap-2">
         <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
           Aksiyon
         </span>
         <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
           Dram
         </span>
         <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
           Fantastik
         </span>
       </div>
    </Card>
  );
}
