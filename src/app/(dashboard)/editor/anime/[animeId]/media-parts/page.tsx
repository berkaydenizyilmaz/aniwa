'use client';

import { useState } from 'react';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaPartTable } from '@/components/modules/editor/anime/media-part-table';
import { MediaPartFormDialog } from '@/components/modules/editor/anime/media-part-form-dialog';
import { AnimeMediaPart } from '@prisma/client';
import { ROUTES } from '@/lib/constants/routes.constants';

interface MediaPartsPageProps {
  params: Promise<{
    animeId: string;
  }>;
}

export default function MediaPartsPage({ params }: MediaPartsPageProps) {
  const { animeId } = use(params);
  const router = useRouter();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedMediaPart, setSelectedMediaPart] = useState<AnimeMediaPart | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (mediaPart: AnimeMediaPart) => {
    setSelectedMediaPart(mediaPart);
    setFormDialogOpen(true);
  };

  const handleEpisodes = (mediaPart: AnimeMediaPart) => {
    // Episode sayfasına yönlendir
    const episodeRoute = ROUTES.PAGES.EDITOR.EPISODES
      .replace(':animeId', animeId)
      .replace(':mediaPartId', mediaPart.id);
    router.push(episodeRoute);
  };

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedMediaPart(null);
  };

  const handleCreateNew = () => {
    setSelectedMediaPart(null);
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
            <h1 className="text-2xl font-bold">Media Parts</h1>
            <p className="text-muted-foreground">
              Anime serisi için media part&apos;ları yönetin
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yeni Media Part</span>
        </Button>
      </div>

      {/* Media Parts Table */}
      <MediaPartTable
        seriesId={animeId}
        onEdit={handleEdit}
        onEpisodes={handleEpisodes}
        refreshKey={refreshKey}
      />

      {/* Form Dialog */}
      <MediaPartFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        seriesId={animeId}
        mediaPart={selectedMediaPart}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
} 