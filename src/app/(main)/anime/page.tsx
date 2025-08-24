import { Suspense } from 'react';
import { AnimeListPage } from '@/components/modules/anime/anime-list-page';

export default function AnimePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimeListPage />
      </Suspense>
    </div>
  );
}
