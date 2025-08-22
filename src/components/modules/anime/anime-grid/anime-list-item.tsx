'use client';

import { AnimeSeries, TitleLanguage, UserProfileSettings } from '@prisma/client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useSettings } from '@/lib/hooks/use-settings';

interface AnimeListItemProps {
  anime: AnimeSeries;
}

export function AnimeListItem({ anime }: AnimeListItemProps) {
  const { settings } = useSettings();
  
  // Kullanıcı tercihini al, yoksa default (romaji)
  const titlePreference = (settings as UserProfileSettings)?.titleLanguagePreference || TitleLanguage.ROMAJI;
  
  // Başlık ve alt başlık belirleme fonksiyonu
  const getTitleDisplay = () => {
    switch (titlePreference) {
      case TitleLanguage.ROMAJI:
        return {
          main: anime.title,
          sub: anime.englishTitle && anime.englishTitle !== anime.title ? anime.englishTitle : null
        };
      case TitleLanguage.NATIVE:
        return {
          main: anime.nativeTitle || anime.title,
          sub: anime.title
        };
      case TitleLanguage.ENGLISH:
        return {
          main: anime.englishTitle || anime.title,
          sub: anime.title
        };
      default:
        return {
          main: anime.title,
          sub: anime.englishTitle && anime.englishTitle !== anime.title ? anime.englishTitle : null
        };
    }
  };
  
  const { main: mainTitle, sub: subTitle } = getTitleDisplay();

  return (
    <div className="relative">
      <Card
        className="cursor-pointer overflow-hidden p-0 rounded-sm transition-transform duration-200 hover:scale-[1.02] border-b border-gray-100"
      >
                 <div className="flex h-24">
           {/* Cover Image */}
           <div className="relative w-16 h-20 flex-shrink-0 ml-4 my-2">
             <Image
               src={anime.coverImage || '/images/placeholder-anime.jpg'}
               alt={anime.title}
               fill
               className="object-cover rounded"
             />
           </div>

           {/* Content */}
           <div className="flex-1 flex items-center justify-between px-6 py-3">
             {/* Sol taraf - Başlıklar, Türler */}
             <div className="flex items-center gap-8">
               {/* Başlıklar */}
               <div className="min-w-0 w-48">
                 <h3 className="font-medium text-gray-900 truncate">
                   {mainTitle}
                 </h3>
                 {subTitle && (
                   <p className="text-sm text-gray-500 truncate">
                     {subTitle}
                   </p>
                 )}
               </div>

               {/* Türler */}
               <div className="flex items-center gap-2 w-40">
                 <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Aksiyon</span>
                 <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Dram</span>
                 <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Fantastik</span>
               </div>
             </div>

             {/* Sağ taraf - Puan, Tip/Bölüm ve Yıl/Durum */}
             <div className="flex items-center gap-8">
               {/* Puan & Popülerlik */}
               <div className="flex flex-col items-center w-20">
                 <div className="flex items-center gap-1 text-green-600">
                   <span>⭐</span>
                   <span className="font-medium">{anime.averageScore?.toFixed(1) || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-1 text-xs text-gray-500">
                   <span>🔥</span>
                   <span className="font-medium">272612</span>
                 </div>
               </div>

               {/* Tip & Bölüm */}
               <div className="flex flex-col items-center w-20">
                 <span className="text-gray-900">{anime.type === 'TV' ? 'TV Dizisi' : anime.type}</span>
                 <span className="text-xs text-gray-400">{anime.episodes} bölüm</span>
               </div>

               {/* Yıl & Durum */}
               <div className="flex flex-col items-center w-20">
                 <span className="text-gray-900">{anime.seasonYear}</span>
                 <span className="text-xs text-gray-400">{anime.status === 'RELEASING' ? 'Devam Ediyor' : 'Tamamlandı'}</span>
               </div>
             </div>
           </div>
         </div>
      </Card>
    </div>
  );
}
