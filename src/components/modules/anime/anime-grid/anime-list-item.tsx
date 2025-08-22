'use client';

import { AnimeSeries, TitleLanguage, UserProfileSettings } from '@prisma/client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useSettings } from '@/lib/hooks/use-settings';
import { getAnimeGenres } from '@/lib/mock/anime.mock';
import { useMemo } from 'react';

interface AnimeListItemProps {
  anime: AnimeSeries;
}

export function AnimeListItem({ anime }: AnimeListItemProps) {
  const { settings } = useSettings();
  
  // Kullanıcı tercihini al, yoksa default (romaji)
  const titlePreference = (settings as UserProfileSettings)?.titleLanguagePreference || TitleLanguage.ROMAJI;
  
  // Anime türlerini al
  const animeGenres = useMemo(() => getAnimeGenres(anime.id), [anime.id]);
  
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
        <div className="flex h-30 md:h-24">
          {/* Cover Image */}
          <div className="relative w-12 h-16 md:w-16 md:h-20 flex-shrink-0 ml-2 md:ml-4 my-2">
            <Image
              src={anime.coverImage || '/images/placeholder-anime.jpg'}
              alt={anime.title}
              fill
              className="object-cover rounded"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between px-3 md:px-6 py-2 md:py-3">
            {/* Sol taraf - Başlıklar, Türler */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 lg:gap-6 xl:gap-8 mb-2 md:mb-0">
              {/* Başlıklar */}
              <div className="min-w-0 w-full md:w-36 lg:w-32 xl:w-40">
                <h3 className="font-medium text-gray-900 truncate text-sm md:text-base leading-tight">
                  {mainTitle}
                </h3>
                {subTitle && (
                  <p className="text-xs md:text-sm text-gray-500 truncate leading-tight">
                    {subTitle}
                  </p>
                )}
              </div>

              {/* Türler - Dinamik */}
              <div className="flex items-center gap-1 md:gap-2 w-full md:w-40 lg:w-44 xl:w-52">
                {/* Mobilde görünen türler (3 tane) */}
                {animeGenres.slice(0, 3).map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-red-100 text-red-800 rounded-full flex-shrink-0"
                  >
                    {genre.name}
                  </span>
                ))}
                
                {/* lg breakpoint'inde görünen 4. tür */}
                {animeGenres.slice(3, 4).map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-red-100 text-red-800 rounded-full flex-shrink-0 hidden lg:inline"
                  >
                    {genre.name}
                  </span>
                ))}
                
                {/* xl breakpoint'inde görünen 5. tür */}
                {animeGenres.slice(4, 5).map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-red-100 text-red-800 rounded-full flex-shrink-0 hidden xl:inline"
                  >
                    {genre.name}
                  </span>
                ))}
                
                {/* 2xl breakpoint'inde görünen 6. tür */}
                {animeGenres.slice(5, 6).map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-red-100 text-red-800 rounded-full flex-shrink-0 hidden 2xl:inline"
                  >
                    {genre.name}
                  </span>
                ))}
                
                {/* Mobilde +N sayacı (3. türden sonrası) */}
                {animeGenres.length > 3 && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex-shrink-0 lg:hidden">
                    +{animeGenres.length - 3}
                  </span>
                )}
                
                {/* lg breakpoint'inde +N sayacı (4. türden sonrası) */}
                {animeGenres.length > 4 && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex-shrink-0 hidden lg:inline xl:hidden">
                    +{animeGenres.length - 4}
                  </span>
                )}
                
                {/* xl breakpoint'inde +N sayacı (5. türden sonrası) */}
                {animeGenres.length > 5 && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex-shrink-0 hidden xl:inline 2xl:hidden">
                    +{animeGenres.length - 5}
                  </span>
                )}
                
                {/* 2xl breakpoint'inde +N sayacı (6. türden sonrası) */}
                {animeGenres.length > 6 && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex-shrink-0 hidden 2xl:inline">
                    +{animeGenres.length - 6}
                  </span>
                )}
              </div>
            </div>

            {/* Sağ taraf - Puan, Tip/Bölüm ve Yıl/Durum */}
            <div className="flex items-center justify-between md:gap-4 lg:gap-6 min-w-0">
              {/* Puan & Popülerlik */}
              <div className="flex flex-col items-center w-12 md:w-14 lg:w-16 flex-shrink-0">
                <div className="flex items-center gap-0.5 md:gap-1 text-green-600">
                  <span className="text-xs md:text-base">⭐</span>
                  <span className="font-medium text-xs md:text-base">{anime.averageScore?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-0.5 md:gap-1 text-xs text-gray-500">
                  <span className="text-xs">🔥</span>
                  <span className="font-medium text-xs">{anime.popularity?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>

              {/* Tip & Bölüm */}
              <div className="flex flex-col items-center w-12 md:w-14 lg:w-16 flex-shrink-0">
                <span className="text-gray-900 text-xs md:text-sm leading-tight text-center">{anime.type === 'TV' ? 'TV Dizisi' : anime.type}</span>
                <span className="text-xs text-gray-400 leading-tight text-center">{anime.episodes} bölüm</span>
              </div>

              {/* Yıl & Durum */}
              <div className="flex flex-col items-center w-12 md:w-14 lg:w-16 flex-shrink-0">
                <span className="text-gray-900 text-xs md:text-sm leading-tight text-center">{anime.seasonYear}</span>
                <span className="text-xs text-gray-400 leading-tight text-center">{anime.status === 'RELEASING' ? 'Devam Ediyor' : 'Tamamlandı'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
