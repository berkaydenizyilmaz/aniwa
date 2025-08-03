'use client';

import { useState } from 'react';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EpisodeTable } from '@/components/modules/editor/anime/episodes/episode-table';
import { EpisodeFormDialog } from '@/components/modules/editor/anime/episodes/episode-form-dialog';
import { Episode } from '@prisma/client';
import { ROUTES } from '@/lib/constants/routes.constants';

interface EpisodesPageProps {
  params: Promise<{
    animeId: string;
    mediaPartId: string;
  }>;
}

export default function EpisodesPage({ params }: EpisodesPageProps) {
  const { animeId, mediaPartId } = use(params);
  const router = useRouter();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (episode: Episode) => {
    setSelectedEpisode(episode);
    setFormDialogOpen(true);
  };

  const handleStreamingLinks = (episode: Episode) => {
    // Streaming link sayfasına yönlendir
    router.push(ROUTES.PAGES.EDITOR.ANIME.STREAMING_LINKS(animeId, mediaPartId, episode.id));
  };

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedEpisode(null);
  };

  const handleCreateNew = () => {
    setSelectedEpisode(null);
    setFormDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Episodes</h1>
            <p className="text-muted-foreground">
              Media part için episode&apos;ları yönetin
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yeni Episode</span>
        </Button>
      </div>

      {/* Episodes Table */}
      <EpisodeTable
        mediaPartId={mediaPartId}
        onEdit={handleEdit}
        onStreamingLinks={handleStreamingLinks}
        refreshKey={refreshKey}
      />

      {/* Form Dialog */}
      <EpisodeFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        mediaPartId={mediaPartId}
        episode={selectedEpisode}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
} 