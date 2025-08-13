import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { StoreInitializer } from "@/components/providers/store-initializer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${nunito.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            <QueryProvider>
              <StoreInitializer />
              <main className="relative min-h-screen pb-20 md:pb-0">
                {children}
              </main>
            </QueryProvider>
          </AuthSessionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
