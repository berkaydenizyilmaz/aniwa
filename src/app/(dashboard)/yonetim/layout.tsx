'use client';
import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <AdminSidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Hamburger Button */}
        <div className="md:hidden fixed top-4 right-4 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="bg-secondary/90 backdrop-blur-sm border border-border/30 shadow-lg hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-secondary-foreground" />
          </Button>
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 