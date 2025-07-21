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
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block w-64 flex-shrink-0 bg-card border-r">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 