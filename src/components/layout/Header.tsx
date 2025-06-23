// Aniwa Projesi - Header Component
// Bu bileşen site genelinde kullanılan header'ı içerir

import Link from 'next/link'
import { Search } from 'lucide-react'
import AuthStatus from '@/components/modules/auth/auth-status'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { PUBLIC_ROUTES } from '@/lib/constants/routes'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-6 lg:px-8 flex h-14 items-center">
        {/* Logo/Ana Sayfa Linki */}
        <div className="mr-6 flex">
          <Link href={PUBLIC_ROUTES.HOME} className="flex items-center space-x-2">
            <span className="font-bold text-lg">
              Aniwa
            </span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-6 mr-6">
          <Link href="/anime" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Anime
          </Link>
          <Link href="/manga" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Manga
          </Link>
          <Link href="/topluluk" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Topluluk
          </Link>
          <Link href="/listeler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Listeler
          </Link>
        </nav>

        {/* Spacer - İçeriği sağa iter */}
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          {/* Arama Çubuğu */}
          <div className="relative hidden sm:block w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Anime, manga ara..." 
              className="pl-8 h-9"
            />
          </div>

          {/* Sağ taraf - Auth Status ve Theme Toggle */}
          <nav className="flex items-center space-x-3">
            <AuthStatus />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 