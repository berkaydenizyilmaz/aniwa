import { Header } from "@/components/layout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Header />
      <div className="relative overflow-hidden">
        {/* Arka plan dekoratif elementleri */}
        <div className="absolute inset-0 -z-10">
          {/* Sol üst - Primary renk */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Sağ alt - Accent renk */}
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Merkez - Subtle primary */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
          
          {/* Sol alt - Accent renk */}
          <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        {children}
      </div>
    </>
  );
} 