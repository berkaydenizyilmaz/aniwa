'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Star, Plus } from 'lucide-react'
import Image from 'next/image'
import { Nunito } from 'next/font/google'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { LayoutGrid, List, ChevronDown } from 'lucide-react'

const nunito = Nunito({ subsets: ['latin'] })

// Anime Popup Bileşeni - İyileştirilmiş Tasarım
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnimePopup({ anime, position = 'right' }: { anime: any, position?: 'right' | 'left' }) {
  const baseClasses = "absolute top-2 w-72 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none";

  const positionClasses = position === 'right' 
    ? "left-full ml-3" 
    : "right-full mr-3";

  const arrowClasses = position === 'right'
    ? `before:content-[''] before:absolute before:top-4 before:-left-[9px] before:w-0 before:h-0 
       before:border-t-8 before:border-t-transparent 
       before:border-b-8 before:border-b-transparent 
       before:border-r-8 before:border-r-slate-200 dark:before:border-r-slate-800
       after:content-[''] after:absolute after:top-4 after:-left-2 after:w-0 after:h-0 
       after:border-t-8 after:border-t-transparent 
       after:border-b-8 after:border-b-transparent 
       after:border-r-8 after:border-r-white/[.85] dark:after:border-r-slate-900/[.85]`
    : `before:content-[''] before:absolute before:top-4 before:-right-[9px] before:w-0 before:h-0 
       before:border-t-8 before:border-t-transparent 
       before:border-b-8 before:border-b-transparent 
       before:border-l-8 before:border-l-slate-200 dark:before:border-l-slate-800
       after:content-[''] after:absolute after:top-4 after:-right-2 after:w-0 after:h-0 
       after:border-t-8 after:border-t-transparent 
       after:border-b-8 after:border-b-transparent 
       after:border-l-8 after:border-l-white/[.85] dark:after:border-l-slate-900/[.85]`;
  
  return (
    <div className={`${baseClasses} ${positionClasses} ${arrowClasses}`}>
      <div className="p-4 space-y-4">
        {/* Başlık */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-bold text-base leading-tight text-slate-800 dark:text-slate-100">
              {anime.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{anime.titleJapanese}</p>
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-sm font-bold text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span>{anime.averageScore}</span>
          </div>
        </div>

        {/* Temel Bilgiler */}
        <div className="text-sm font-medium flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>{formatMap[anime.format as keyof typeof formatMap]}</span>
          <span>{anime.year}</span>
          <span>{anime.episodes === 1 ? '1 Bölüm' : `${anime.episodes} Bölüm`}</span>
        </div>

        {/* Durum */}
        <div className="flex items-center gap-2 text-sm">
          <Badge 
            className={`capitalize ${anime.status === 'RELEASING' ? 'bg-green-500 text-white' : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300'}`}
          >
            {statusMap[anime.status as keyof typeof statusMap]}
          </Badge>
        </div>

        {/* Türler */}
        <div className="flex flex-wrap gap-2 pt-1">
          {anime.genres.slice(0, 3).map((genre: string) => (
            <Badge key={genre} variant="secondary" className="font-normal">
              {genre}
            </Badge>
          ))}
          {anime.genres.length > 3 && (
            <Badge variant="secondary" className="font-normal">
              +{anime.genres.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

// Anime Kartı Bileşeni - Önceki "Reflection" Stiline Dönüş
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnimeCard({ anime }: { anime: any }) {
  const [popupPosition, setPopupPosition] = useState<'right' | 'left'>('right');

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 288; // w-72
    const margin = 12; // ml-3 veya mr-3
    const totalPopupWidth = popupWidth + margin;

    // Sağda yeterli alan var mı kontrol et
    if (cardRect.right + totalPopupWidth > window.innerWidth) {
      // Sağda yer yok, solu kontrol et
      if (cardRect.left - totalPopupWidth > 0) {
        setPopupPosition('left');
      } else {
        // Solda da yer yok, varsayılan olarak sağda kalsın
        setPopupPosition('right');
      }
    } else {
      // Sağda yeterli alan var
      setPopupPosition('right');
    }
  };
  
  return (
    <div 
      className="group relative rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      <AnimePopup anime={anime} position={popupPosition} />

      {/* Resim Alanı */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
        />
        {/* Listeye Ekle Butonu */}
        <div className="absolute top-2 left-2 z-20">
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200
                       hover:bg-black/70 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation(); // Kartın tıklama olayını engelle
              // İleride burada listeye ekleme fonksiyonu çalışacak
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Başlık Alanı - "Reflection" Efekti */}
      <div className="relative overflow-hidden rounded-b-lg min-h-[70px]">
        <div className="absolute inset-0">
          <Image
            src={anime.coverImage}
            alt=""
            fill
            className="object-cover opacity-50 blur-md scale-110"
            style={{ objectPosition: 'center bottom' }}
            sizes="300px"
          />
          <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/60"></div>
        </div>
        <div className="relative p-2.5 z-10 flex items-end h-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {anime.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
              <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{anime.averageScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Anime Liste Elemanı Bileşeni
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnimeListItem({ anime }: { anime: any }) {
  return (
    <div className="flex gap-5 p-4 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200 border border-slate-200 dark:border-slate-800">
      {/* Image */}
      <div className="relative w-16 flex-shrink-0 aspect-[2/3] rounded-md overflow-hidden">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Details Wrapper */}
      <div className="flex-grow grid grid-cols-12 gap-4 items-center">
        {/* Title and Genres (left side) */}
        <div className="col-span-12 md:col-span-7 lg:col-span-6">
          <h3 className="font-bold text-base md:text-lg leading-tight text-slate-800 dark:text-slate-100">{anime.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {anime.genres.slice(0, 4).map((genre: string) => (
              <Badge key={genre} variant="secondary" className="text-xs font-normal">{genre}</Badge>
            ))}
          </div>
        </div>

        {/* Metadata columns (right side) */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6 grid grid-cols-3 gap-2 text-center">
          {/* Score */}
          <div className="flex flex-col">
            <span className="font-bold text-lg text-green-600 dark:text-green-500">{anime.averageScore}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{anime.studios[0]}</span>
          </div>
          
          {/* Format */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{formatMap[anime.format as keyof typeof formatMap]}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{anime.episodes === 1 ? '1 Bölüm' : `${anime.episodes} Bölüm`}</span>
          </div>

          {/* Status */}
          <div className="flex flex-col">
             <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{statusMap[anime.status as keyof typeof statusMap]}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{anime.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Geçici mock data - tasarım için
const mockAnimeList = [
  {
    id: 1,
    title: "Attack on Titan",
    titleJapanese: "Shingeki no Kyojin",
    coverImage: "/aot.jpg",
    averageScore: 90,
    year: 2013,
    status: "FINISHED",
    format: "TV",
    episodes: 25,
    genres: ["Action", "Drama", "Fantasy"],
    studios: ["Madhouse"],
    season: "SPRING",
    description: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction."
  },
  {
    id: 2,
    title: "Demon Slayer",
    titleJapanese: "Kimetsu no Yaiba",
    coverImage: "/demon.jpg",
    averageScore: 87,
    year: 2019,
    status: "FINISHED",
    format: "TV",
    episodes: 26,
    genres: ["Action", "Historical", "Supernatural"],
    studios: ["Ufotable"],
    season: "SPRING",
    description: "A young boy becomes a demon slayer to save his sister and avenge his family."
  },
  {
    id: 3,
    title: "Your Name",
    titleJapanese: "Kimi no Na wa",
    coverImage: "/yourname.png",
    averageScore: 85,
    year: 2016,
    status: "FINISHED",
    format: "MOVIE",
    episodes: 1,
    genres: ["Romance", "Drama", "Supernatural"],
    studios: ["CoMix Wave Films"],
    season: null,
    description: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies."
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    titleJapanese: "Jujutsu Kaisen",
    coverImage: "/jujutsu.jpg",
    averageScore: 86,
    year: 2020,
    status: "FINISHED",
    format: "TV",
    episodes: 24,
    genres: ["Action", "School", "Supernatural"],
    studios: ["MAPPA"],
    season: "FALL",
    description: "A high school student joins a secret organization of Jujutsu Sorcerers to kill Cursed Spirits."
  },
  {
    id: 5,
    title: "Spirited Away",
    titleJapanese: "Sen to Chihiro no Kamikakushi",
    coverImage: "/spirited.jpg",
    averageScore: 92,
    year: 2001,
    status: "FINISHED",
    format: "MOVIE",
    episodes: 1,
    genres: ["Adventure", "Family", "Fantasy"],
    studios: ["Studio Ghibli"],
    season: null,
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and witches."
  },
  {
    id: 6,
    title: "One Piece",
    titleJapanese: "One Piece",
    coverImage: "/onepiece.jpg",
    averageScore: 89,
    year: 1999,
    status: "RELEASING",
    format: "TV",
    episodes: 1000,
    genres: ["Action", "Adventure", "Comedy"],
    studios: ["Toei Animation"],
    season: "FALL",
    description: "Monkey D. Luffy sails with his crew of Straw Hat Pirates through the Grand Line to find the treasure One Piece."
  }
]

const formatMap = {
  TV: "TV Serisi",
  MOVIE: "Film",
  OVA: "OVA",
  SPECIAL: "Özel"
}

const statusMap = {
  RELEASING: "Yayında",
  FINISHED: "Tamamlandı",
  NOT_YET_RELEASED: "Yakında",
  CANCELLED: "İptal Edildi"
}

export default function AnimePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [sortBy, setSortBy] = useState('averageScore')
  const [viewMode, setViewMode] = useState('grid')

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'averageScore', label: 'Average Score' },
    { value: 'trending', label: 'Trending' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'releaseDate', label: 'Release Date' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

  const filteredAnime = mockAnimeList.filter(anime => 
    anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anime.titleJapanese.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen bg-zinc-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 ${nunito.className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtreler - Panel olmadan */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <Label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Ara</Label>
              <Input
                placeholder="Attack on Titan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-sm w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Genres */}
            <div>
              <Label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Türler</Label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-sm w-full">
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tümü</SelectItem>
                  <SelectItem value="action">Aksiyon</SelectItem>
                  <SelectItem value="adventure">Macera</SelectItem>
                  <SelectItem value="drama">Dram</SelectItem>
                  <SelectItem value="fantasy">Fantastik</SelectItem>
                  <SelectItem value="romance">Romantizm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <Label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Yıl</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-sm w-full">
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tümü</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div>
              <Label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Sezon</Label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-sm w-full">
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tümü</SelectItem>
                  <SelectItem value="spring">İlkbahar</SelectItem>
                  <SelectItem value="summer">Yaz</SelectItem>
                  <SelectItem value="fall">Sonbahar</SelectItem>
                  <SelectItem value="winter">Kış</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div>
              <Label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-sm w-full">
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Tümü</SelectItem>
                  <SelectItem value="tv">TV Serisi</SelectItem>
                  <SelectItem value="movie">Film</SelectItem>
                  <SelectItem value="ova">OVA</SelectItem>
                  <SelectItem value="special">Özel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sıralama ve Görünüm Kontrolleri */}
        <div className="flex justify-between items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-slate-600 dark:text-slate-300 font-semibold">
                Sırala: {currentSortLabel}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value} onSelect={() => setSortBy(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Anime Kartları */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filteredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAnime.map((anime) => (
              <AnimeListItem key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 