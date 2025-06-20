import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}