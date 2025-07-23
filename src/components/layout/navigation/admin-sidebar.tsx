'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminSidebarAuth } from '../auth';
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

export const AdminSidebar = memo(function AdminSidebar({ onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Toggle collapsed state
  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  // Toggle button component
  const ToggleButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCollapsed}
      className="h-8 w-8 text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10 transition-all duration-200"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );

  // Navigation item
  const NavigationItem = ({ item }: { item: typeof navigationItems[number] }) => {
    const isActive = pathname === item.href;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
          collapsed ? "justify-center space-x-0" : "space-x-3",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-secondary-foreground/10"
        )}
        onClick={onClose}
        title={collapsed ? item.label : undefined}
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
      </Link>
    );
  };

  // Home link
  const homeLink = (
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
  );

  return (
    <div className={cn(
      "h-screen flex flex-col bg-card/80 backdrop-blur-md border-r border-border/20 shadow-lg transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Admin Panel Header */}
      {!collapsed && (
        <div className="border-b border-border/20 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-card-foreground">
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
        <div className="p-2 border-b border-border/20">
          <div className="flex justify-center">
            <ToggleButton isCollapsed={collapsed} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavigationItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Auth Section at Bottom */}
      <div className="border-t border-border/20">
        <div className={cn(
          "transition-all duration-300",
          collapsed ? "flex flex-col items-center space-y-1 p-2" : "flex items-center justify-between p-4"
        )}>
          {homeLink}
          <div className={cn(
            "transition-all duration-300",
            collapsed ? "mt-1" : ""
          )}>
            <AdminSidebarAuth collapsed={collapsed} />
          </div>
        </div>
      </div>
    </div>  
  );
}); 