import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Skeleton */}
      <nav className="flex justify-between items-center p-4 border-b border-border">
        <Skeleton className="h-8 w-20" /> {/* Logo */}
        <Skeleton className="h-10 w-10 rounded-md" /> {/* Theme toggle */}
      </nav>
      
      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section Skeleton */}
          <section className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" /> {/* Title */}
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" /> {/* Description line 1 */}
            <Skeleton className="h-6 w-80 mx-auto" /> {/* Description line 2 */}
          </section>

          {/* Cards Grid Skeleton */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-border rounded-lg bg-card space-y-3">
                <Skeleton className="h-6 w-32" /> {/* Card title */}
                <Skeleton className="h-4 w-full" /> {/* Card description line 1 */}
                <Skeleton className="h-4 w-24" /> {/* Card description line 2 */}
              </div>
            ))}
          </section>

          {/* Additional Content Skeleton */}
          <section className="space-y-4">
            <Skeleton className="h-8 w-48" /> {/* Section title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-md" /> {/* Image placeholder */}
                  <Skeleton className="h-4 w-full" /> {/* Text line 1 */}
                  <Skeleton className="h-4 w-20" /> {/* Text line 2 */}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}