import type { Metadata } from "next";
import { EditorSidebar } from "@/components/layout/editor-sidebar";

export const metadata: Metadata = {
  title: "Editör Paneli - Aniwa",
  description: "Aniwa editör paneli",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background">
      {/* Editor Sidebar */}
      <EditorSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 