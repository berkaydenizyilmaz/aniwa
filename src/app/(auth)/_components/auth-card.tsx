import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        
        {links && links.length > 0 && (
          <div className="text-center space-y-2">
            {links.map((link, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {link.text}{' '}
                <a href={link.href} className="text-primary hover:underline">
                  {link.label}
                </a>
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 