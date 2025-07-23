'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, List, User } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes.constants'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

const navItems = [
  { icon: Home, label: 'Ana Sayfa', href: ROUTES.PAGES.HOME },
  { icon: Play, label: 'Anime', href: ROUTES.PAGES.ANIME },
  { icon: List, label: 'Listeler', href: ROUTES.PAGES.LISTS },
  { icon: User, label: 'Profil', href: ROUTES.PAGES.PROFILE },
]

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          // Profil linkini auth durumuna göre ayarla
          const href = item.href === ROUTES.PAGES.PROFILE && !session 
            ? ROUTES.PAGES.AUTH.LOGIN 
            : item.href
            
          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}