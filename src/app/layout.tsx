import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aniwa - Anime Takip Platformu",
  description: "İzlediğiniz animeleri takip edin, puanlayın ve yorum yapın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <Header />
              <main className="relative overflow-hidden min-h-screen md:pt-0 pt-0 pb-20 md:pb-0">
                {/* Subtle anime-inspired background patterns */}
                <div className="fixed inset-0 bg-background pointer-events-none -z-10" />

                {/* Content */}
                <div className="relative z-10">
                  {children}
                </div>
              </main>
            </ThemeProvider>
            <ToasterProvider />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
