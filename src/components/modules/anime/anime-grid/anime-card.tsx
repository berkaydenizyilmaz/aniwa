'use client';

import { AnimeSeries, TitleLanguage, UserProfileSettings } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSettings } from '@/lib/hooks/use-settings';
import { useState } from 'react';
import { AnimeCardPopup } from './anime-card-popup';

interface AnimeCardProps {
  anime: AnimeSeries;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const { settings } = useSettings();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
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

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
         // Responsive popup genişlikleri - daha küçük
     let popupWidth = 256; // w-64 = 256px (mobil)
     if (windowWidth >= 1024) {
       popupWidth = 320; // lg:w-80 = 320px (desktop)
     } else if (windowWidth >= 640) {
       popupWidth = 288; // sm:w-72 = 288px (tablet)
     }
    
    // Sağ tarafta yer var mı kontrol et
    const spaceOnRight = windowWidth - rect.right - popupWidth - 10;
    const spaceOnLeft = rect.left - popupWidth - 10;
    
    let x: number;
    if (spaceOnRight >= 0) {
      // Sağ tarafta yer var
      x = rect.right + 10;
    } else if (spaceOnLeft >= 0) {
      // Sol tarafta yer var
      x = rect.left - popupWidth - 10;
    } else {
      // Hiçbir tarafta yer yok, sağa yapıştır
      x = windowWidth - popupWidth - 10;
    }
    
    setPopupPosition({
      x,
      y: rect.top
    });
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative">
      <Card
        className="cursor-pointer aspect-[2/3] overflow-hidden p-0 rounded-sm transition-transform duration-200 hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
              {/* Cover Image */}
        <div className="relative h-full">
          <Image
            src={anime.coverImage || '/images/placeholder-anime.jpg'}
            alt={anime.title}
            fill
            className="object-cover"
          />

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />

          {/* Title */}
                   <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 z-10",
            "transition-all duration-300 ease-in-out"
          )}>
          <h3 className={cn(
            "text-white font-medium line-clamp-2",
            "text-base"
          )}>
            {mainTitle}
          </h3>

          {subTitle && (
            <p className="text-white/70 text-xs mt-1 line-clamp-1">
              {subTitle}
            </p>
          )}
        </div>
      </div>
    </Card>
    
    <AnimeCardPopup
      anime={anime}
      isVisible={showPopup}
      position={popupPosition}
    />
  </div>
  );
}