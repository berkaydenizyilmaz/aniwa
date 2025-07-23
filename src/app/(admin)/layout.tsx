import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Panel - Aniwa",
  description: "Aniwa yönetim paneli",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 