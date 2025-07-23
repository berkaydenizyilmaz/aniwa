import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  links?: React.ReactNode;
}

export function AuthCard({ title, description, children, links }: AuthCardProps) {
  return (
    <Card className="w-full shadow-lg border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {links && (
          <div className="text-center space-y-2 pt-2">
            {links}
          </div>
        )}
      </CardContent>
    </Card>
  );
}