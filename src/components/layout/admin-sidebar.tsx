'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthSection } from './auth-section';

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    { href: ROUTES.PAGES.ADMIN.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { href: ROUTES.PAGES.ADMIN.GENRES, label: 'Türler', icon: '🎭' },
  ];

  return (
    <div className="h-screen flex flex-col bg-secondary border-r border-border/30">
      {/* Admin Panel Header */}
      <div className="p-4 border-b border-border/30">
        <h1 className="text-xl font-bold text-secondary-foreground">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10"
              )}
              onClick={onClose}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Auth Section at Bottom */}
      <div className="border-t border-border/30">
        <div className="flex items-center justify-between">
          <Link 
            href={ROUTES.PAGES.HOME}
            className="flex items-center space-x-2 text-sm font-semibold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 px-2 py-1 rounded transition-all duration-200"
          >
            <span>🏠</span>
            <span>Ana Sayfa</span>
          </Link>
          <AuthSection variant="sidebar" />
        </div>
      </div>
    </div>
  );
} 