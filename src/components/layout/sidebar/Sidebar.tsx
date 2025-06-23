'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Shield,
  Database,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// Admin sidebar navigation items
const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/yonetim',
    icon: LayoutDashboard,
    description: 'Ana yönetim paneli'
  },
  {
    title: 'Kullanıcılar',
    href: '/yonetim/kullanicilar',
    icon: Users,
    description: 'Kullanıcı yönetimi'
  },
  {
    title: 'İçerik',
    href: '/yonetim/icerik',
    icon: FileText,
    description: 'Anime ve manga yönetimi'
  },
  {
    title: 'Loglar',
    href: '/yonetim/loglar',
    icon: Database,
    description: 'Sistem logları'
  },
  {
    title: 'Raporlar',
    href: '/yonetim/raporlar',
    icon: BarChart3,
    description: 'İstatistikler ve raporlar'
  },
  {
    title: 'Güvenlik',
    href: '/yonetim/guvenlik',
    icon: Shield,
    description: 'Güvenlik ayarları'
  },
  {
    title: 'E-posta',
    href: '/yonetim/eposta',
    icon: Mail,
    description: 'E-posta yönetimi'
  },
  {
    title: 'Ayarlar',
    href: '/yonetim/ayarlar',
    icon: Settings,
    description: 'Sistem ayarları'
  },
  {
    title: 'Ana Sayfa',
    href: '/',
    icon: Home,
    description: 'Ana sayfa'
  }
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      'flex flex-col h-full bg-card border-r transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">Yönetim</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.title}</div>
                  {!isActive && (
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className={cn(
          'flex items-center space-x-2 text-xs text-muted-foreground',
          isCollapsed && 'justify-center'
        )}>
          {!isCollapsed && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </>
          )}
          {isCollapsed && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  )
}
