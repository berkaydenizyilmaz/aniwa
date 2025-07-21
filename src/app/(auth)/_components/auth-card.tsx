import { ReactNode } from 'react';
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

export function AuthCard({ title, description, children, links }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto min-w-[260px] md:min-w-[320px]">
      <div className="rounded-lg bg-card border border-border shadow-sm p-8 md:p-10">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-2xl md:text-3xl text-card-foreground tracking-tight font-bold">{title}</h1>
            {description && (
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          
          {/* Form */}
          <div className="space-y-5">
            {children}
          </div>
          
          {/* Links */}
          {links && links.length > 0 && (
            <div className="text-center space-y-3 pt-6 border-t border-border mt-8">
              {links.map((link, index) => (
                   <p key={index} className="text-xs md:text-sm text-muted-foreground">
                  {link.text}{' '}
                  <Link 
                    href={link.href} 
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </p>
              ))}
            </div>
          )}
      </div>
    </div>
  );
} 