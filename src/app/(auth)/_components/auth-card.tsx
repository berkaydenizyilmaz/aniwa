import { ReactNode, memo } from 'react';
import Link from 'next/link';

interface AuthLink {
  text: string;
  href: string;
  label: string;
}

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  links?: AuthLink[];
}

export const AuthCard = memo(function AuthCard({ title, description, children, links }: AuthCardProps) {
  // Link component
  const LinkItem = ({ link, index, isMobile = false }: { link: AuthLink; index: number; isMobile?: boolean }) => (
    <p key={index} className={`text-xs ${!isMobile ? 'md:text-sm' : ''} font-semibold text-muted-foreground`}>
      {link.text}{' '}
      <Link 
        href={link.href} 
        className="text-primary hover:text-primary/80 transition-colors duration-200 font-semibold"
      >
        {link.label}
      </Link>
    </p>
  );

  // Links section
  const LinksSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!links || links.length === 0) return null;
    
    return (
      <div className={`text-center space-y-${isMobile ? '2' : '3'} ${isMobile ? 'pt-4 mt-6' : 'pt-6 border-t border-border/20 mt-8'}`}>
        {links.map((link, index) => (
          <LinkItem key={index} link={link} index={index} isMobile={isMobile} />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile: Kart yok, form direkt ekranı kullanır */}
      <div className="sm:hidden w-full min-h-screen flex flex-col justify-start pt-14 pb-20 p-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl text-card-foreground tracking-tight font-bold">{title}</h1>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground font-semibold">{description}</p>
          )}
        </div>
        
        {/* Form */}
        <div className="space-y-4 [&_input]:bg-card [&_input::placeholder]:text-foreground/60">
          {children}
        </div>
        
        {/* Links */}
        <LinksSection isMobile={true} />
      </div>

      {/* Desktop: Kart görünümü */}
      <div className="hidden sm:block w-full max-w-md mx-auto min-w-[380px] md:min-w-[360px]">
        <div className="rounded-lg bg-card/80 backdrop-blur-md border border-border/20 shadow-xl">
          <div className="p-10 md:p-18">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-2xl md:text-3xl text-card-foreground tracking-tight font-bold">{title}</h1>
              {description && (
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-semibold">{description}</p>
              )}
            </div>
            
            {/* Form */}
            <div className="space-y-5">
              {children}
            </div>
            
            {/* Links */}
            <LinksSection isMobile={false} />
          </div>
        </div>
      </div>
    </>
  );
}); 