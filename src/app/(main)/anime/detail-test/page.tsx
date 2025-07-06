'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Heart } from 'lucide-react'
import Image from 'next/image'
import { Nunito } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'] })

// GÜNCELLENMİŞ TEST VERİSİ
const mockAnimeDetail = {
  id: 1,
  title: 'Attack on Titan',
  titleJapanese: '進撃の巨人 (Shingeki no Kyojin)',
  bannerImage: '/aot.jpg',
  coverImage: '/aot.jpg',
  averageScore: 90,
  popularity: 1,
  rank: 1,
  synopsis: "Yüzyıllar önce insanlık, onları sebepsiz yere yiyen devasa, insansı yaratıklar olan titanlar tarafından katledilmenin eşiğine getirildi. Hayatta kalan son insanlar, kendilerini en yüksek titandan bile daha yüksek olan devasa, konsantrik duvarların içine kapatarak kendilerini korudular...",
  format: 'TV',
  status: 'Tamamlandı',
  source: 'Manga',
  studios: ['Wit Studio', 'MAPPA'],
  genres: ['Aksiyon', 'Askeri', 'Gizem', 'Süper Güç', 'Dram', 'Fantastik', 'Shounen'],
  characters: [
    { id: 1, name: 'Eren Yeager', image: '/aot.jpg' },
    { id: 2, name: 'Mikasa Ackerman', image: '/aot.jpg' },
    { id: 3, name: 'Armin Arlert', image: '/aot.jpg' },
    { id: 4, name: 'Levi Ackerman', image: '/aot.jpg' },
    { id: 5, name: 'Erwin Smith', image: '/aot.jpg' },
    { id: 6, name: 'Hange Zoë', image: '/aot.jpg' },
  ],
  // Seri bütünlüğü için yeni sezon/bölüm verisi
  seasons: [
    { 
      id: 1, 
      title: 'Sezon 1',
      format: 'TV',
      episodes: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        title: `Bölüm ${i + 1}: Shiganshina'nın Düşüşü, Kısım ${i+1}`
      }))
    },
    { 
      id: 2, 
      title: 'Sezon 2',
      format: 'TV',
      episodes: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        title: `Bölüm ${i + 1}: Canavar Titan`
      }))
    },
     { 
      id: 3, 
      title: 'Sezon 3',
      format: 'TV',
      episodes: Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        title: `Bölüm ${i + 1}: Duman Sinyali`
      }))
    },
    { 
      id: 4, 
      title: 'Ilse\'s Notebook (OVA)',
      format: 'OVA',
      episodes: [{ id: 1, number: 1, title: 'Bir Askerin Anıları' }]
    },
    { 
      id: 5, 
      title: 'Attack on Titan: The Movie',
      format: 'Film',
      episodes: [{ id: 1, number: 'Film', title: 'Guren no Yumiya' }]
    },
  ]
}

export default function AnimeDetailPage() {
  const anime = mockAnimeDetail
  const [selectedSeason, setSelectedSeason] = useState(anime.seasons[0]);

  return (
    <div className={`bg-zinc-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 ${nunito.className}`}>
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full">
        <Image src={anime.bannerImage} alt={`${anime.title} banner`} fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 dark:from-zinc-950 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header Section */}
        <header className="relative flex flex-col md:flex-row gap-6 md:gap-8 -mt-20 md:-mt-28">
          <div className="flex-shrink-0 w-36 md:w-48 lg:w-56 mx-auto md:mx-0">
            <div className="aspect-[2/3] relative rounded-lg shadow-xl overflow-hidden">
              <Image src={anime.coverImage} alt={anime.title} fill className="object-cover" />
            </div>
          </div>
          <div className="flex-grow pt-4 md:pt-28 lg:pt-32">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 text-center md:text-left">
              {anime.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">{anime.titleJapanese}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                <Heart className="h-5 w-5 mr-2" />
                Listeye Ekle
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" variant="outline" className="font-semibold">
                    Durum: İzlenecek
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>İzliyorum</DropdownMenuItem>
                  <DropdownMenuItem>Tamamladım</DropdownMenuItem>
                  <DropdownMenuItem>Tekrar İzliyorum</DropdownMenuItem>
                  <DropdownMenuItem>Bıraktım</DropdownMenuItem>
                  <DropdownMenuItem>Planlıyorum</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Body Section with Tabs */}
        <main className="mt-8">
           <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-6">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="seasons">Bölümler ve Sezonlar</TabsTrigger>
              <TabsTrigger value="characters">Karakterler</TabsTrigger>
            </TabsList>
            
            {/* Genel Bakış Sekmesi */}
            <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="lg:col-span-3 space-y-8">
                <section>
                  <h2 className="text-xl font-bold border-b-2 border-pink-500/50 pb-2 mb-3 text-slate-800 dark:text-slate-100">Özet</h2>
                  <p className="text-base leading-relaxed whitespace-pre-line">{anime.synopsis}</p>
                </section>
              </div>
              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">Bilgiler</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Format:</span>
                        <span>{anime.format}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Bölüm Sayısı:</span>
                        <span>{anime.seasons.reduce((total, season) => total + season.episodes.length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Durum:</span>
                        <span>{anime.status}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Kaynak:</span>
                        <span>{anime.source}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Stüdyo:</span>
                        <span>{anime.studios.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">Türler</h3>
                   <div className="flex flex-wrap gap-2">{anime.genres.map(genre => <Badge key={genre} variant="secondary">{genre}</Badge>)}</div>
                </div>
                <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">İstatistikler</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Skor:</span>
                            <span className="font-bold text-green-600">{anime.averageScore}%</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Popülerlik:</span>
                            <span>#{anime.popularity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Sıralama:</span>
                            <span>#{anime.rank}</span>
                        </div>
                    </div>
                </div>
              </aside>
            </TabsContent>

            {/* Bölümler ve Sezonlar Sekmesi */}
            <TabsContent value="seasons" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sol Sütun: Sezon Listesi */}
                <div className="md:col-span-1">
                    <div className="space-y-2 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                        {anime.seasons.map(season => (
                            <button
                                key={season.id}
                                onClick={() => setSelectedSeason(season)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                                    selectedSeason.id === season.id
                                        ? 'bg-pink-500 text-white'
                                        : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                {season.title} <span className="text-xs opacity-80">({season.format})</span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Sağ Sütun: Bölüm Listesi */}
                <div className="md:col-span-3">
                    <div className="space-y-2">
                        {selectedSeason.episodes.map(episode => (
                            <div key={episode.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/60 dark:bg-slate-900/60">
                                <span className="font-bold text-slate-500 dark:text-slate-400 w-8 text-center">{episode.number}</span>
                                <p className="flex-grow font-medium text-slate-700 dark:text-slate-200">{episode.title}</p>
                                <Checkbox id={`ep-${episode.id}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>

            {/* Karakterler Sekmesi */}
            <TabsContent value="characters">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {anime.characters.map(char => (
                    <div key={char.id} className="flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 p-2 rounded-md">
                      <div className="relative h-16 w-12 flex-shrink-0 rounded-sm overflow-hidden"><Image src={char.image} alt={char.name} fill className="object-cover" /></div>
                      <span className="font-semibold text-sm">{char.name}</span>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
} 