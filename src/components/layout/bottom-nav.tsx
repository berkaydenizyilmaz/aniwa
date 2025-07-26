'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileAuthSection } from './mobile-auth-section'
import { BOTTOM_NAVIGATION_ITEMS } from '@/lib/constants/menu.constants'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex">
      {BOTTOM_NAVIGATION_ITEMS.map((item) => {
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