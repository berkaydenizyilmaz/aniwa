'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthSection } from './auth-section';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const navigationItems = [
  { href: ROUTES.PAGES.ADMIN.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { href: ROUTES.PAGES.ADMIN.GENRES, label: 'Türler', icon: '🎭' },
  { href: ROUTES.PAGES.ADMIN.TAGS, label: 'Etiketler', icon: '🏷️' },
] as const;

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Toggle button component to reduce duplication
  const ToggleButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCollapsed}
      className="h-8 w-8 text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className={cn(
      "h-screen flex flex-col bg-secondary border-r border-border/30 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-56"
    )}>
        {/* Admin Panel Header */}
        {!collapsed && (
          <div className="border-b border-border/30 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-secondary-foreground">
                Admin Panel
              </h1>
              <div className="hidden md:block">
                <ToggleButton isCollapsed={collapsed} />
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button for Collapsed Mode */}
        {collapsed && (
          <div className="p-2 border-b border-border/30">
            <div className="flex justify-center">
              <ToggleButton isCollapsed={collapsed} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                  collapsed ? "justify-center space-x-0" : "space-x-3",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10"
                )}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section at Bottom */}
        <div className="border-t border-border/30">
          <div className={cn(
            "transition-all duration-300",
            collapsed ? "flex flex-col items-center space-y-1 p-2" : "flex items-center justify-between p-4"
          )}>
            <Link
              href={ROUTES.PAGES.HOME}
              className={cn(
                "font-semibold text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 rounded transition-all duration-200",
                collapsed ? "flex flex-col items-center space-y-1 text-sm p-2" : "flex items-center space-x-2 text-xs px-3 py-2"
              )}
              title={collapsed ? "Ana Sayfa" : undefined}
            >
              <span className="text-lg">🏠</span>
              {!collapsed && <span className="whitespace-nowrap">Ana Sayfa</span>}
            </Link>
            <div className={cn(
              "transition-all duration-300",
              collapsed ? "mt-1" : ""
            )}>
              <AuthSection variant="sidebar" collapsed={collapsed} />
            </div>
          </div>
        </div>
    </div>  
  );
} 