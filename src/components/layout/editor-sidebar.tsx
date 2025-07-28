'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AdminAuthSection } from './admin-auth-section';
import { ROUTES } from '@/lib/constants/routes.constants';
import { EDITOR_NAVIGATION_ITEMS } from '@/lib/constants/menu.constants';
import { 
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function EditorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <TooltipProvider>
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <aside className={`
          hidden md:flex flex-col h-full
          glass-card border-r
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-24' : 'w-64'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center border-b ${isCollapsed ? 'justify-center p-2' : 'justify-between p-4'}`}>
              {!isCollapsed && (
                <Link href={ROUTES.PAGES.EDITOR.DASHBOARD} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-base">E</span>
                  </div>
                  <span className="font-bold text-xl">Editör</span>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="flex-shrink-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 space-y-3 ${isCollapsed ? 'py-2' : 'p-4'}`}>
              {EDITOR_NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                const linkContent = (
                  <div
                    className={`
                      flex items-center rounded-lg
                      transition-colors duration-200
                      ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'}
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                );

                return (
                  <Tooltip key={item.label} delayDuration={300} open={isCollapsed ? undefined : false}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        {linkContent}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" align="start" sideOffset={4}>
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className={`border-t space-y-3 ${isCollapsed ? 'py-2' : 'p-4'}`}>
              {/* Ana Sayfaya Dön */}
              <Tooltip delayDuration={300} open={isCollapsed ? undefined : false}>
                <TooltipTrigger asChild>
                  <Link
                    href={ROUTES.PAGES.HOME}
                    className={`
                      flex items-center rounded-lg
                      text-muted-foreground hover:text-foreground hover:bg-accent/50
                      transition-colors duration-200
                      ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'}
                    `}
                  >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">Ana Sayfa</span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" align="start" sideOffset={4}>
                    <p>Ana Sayfa</p>
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Auth Section */}
              <div className={`
                flex items-center rounded-lg
                text-muted-foreground hover:text-foreground hover:bg-accent/50
                transition-colors duration-200
                ${isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2'}
              `}>
                <AdminAuthSection isSidebarOpen={!isCollapsed} />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-background/90 backdrop-blur-md border-r
          transition-transform duration-300 ease-in-out
          md:hidden
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link href={ROUTES.PAGES.EDITOR.DASHBOARD} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">E</span>
                </div>
                <span className="font-bold text-xl">Editör</span>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {EDITOR_NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t space-y-2">
              {/* Ana Sayfaya Dön */}
              <Link
                href={ROUTES.PAGES.HOME}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg
                  text-muted-foreground hover:text-foreground hover:bg-accent/50
                  transition-colors duration-200
                `}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Ana Sayfa</span>
              </Link>

              {/* Auth Section */}
              <div className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg
                text-muted-foreground hover:text-foreground hover:bg-accent/50
                transition-colors duration-200
              `}>
                <AdminAuthSection isSidebarOpen={true} />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Toggle Button */}
        {!isMobileOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobile}
            className="fixed top-4 left-4 z-50 md:hidden glass-card"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </>
    </TooltipProvider>
  );
} 