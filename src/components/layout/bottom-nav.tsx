'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, List } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes.constants'
import { cn } from '@/lib/utils'
import { MobileAuthSection } from './mobile-auth-section'

const navItems = [
  { icon: Home, label: 'Ana Sayfa', href: ROUTES.PAGES.HOME },
  { icon: Play, label: 'Anime', href: ROUTES.PAGES.ANIME },
  { icon: List, label: 'Listeler', href: ROUTES.PAGES.LISTS },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-center flex-1 py-2 transition-colors",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-5 w-5" />
          </Link>
        )
      })}
      
      {/* Mobil Auth Section */}
      <div className="flex items-center justify-center flex-1 py-2">
        <MobileAuthSection />
      </div>
    </nav>
  )
}