import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="pb-12 md:pb-0">{children}</main>
      <BottomNav />
    </>
  );
}