import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Aniwa</h1>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground">
        Anime takip ve topluluk platformu
      </p>
    </div>
  );
}
