'use client';

import { useState, useCallback, memo } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = memo(function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar toggle handler - useCallback ile optimize edildi
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Sidebar close handler - useCallback ile optimize edildi
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Mobile hamburger button render fonksiyonu - useCallback ile optimize edildi
  const renderMobileButton = useCallback(() => (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleSidebarToggle}
        className="bg-card/80 backdrop-blur-md border border-border/20 shadow-lg hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </Button>
    </div>
  ), [handleSidebarToggle]);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <AdminSidebar onClose={handleSidebarClose} />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <AdminSidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Hamburger Button */}
        {renderMobileButton()}
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
});

export default AdminLayout; 