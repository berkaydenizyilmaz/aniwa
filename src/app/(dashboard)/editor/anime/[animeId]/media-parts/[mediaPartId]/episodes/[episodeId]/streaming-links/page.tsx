'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { StreamingLinkTable } from '@/components/modules/editor/anime/streaming-links/streaming-link-table';
import { StreamingLinkFormDialog } from '@/components/modules/editor/anime/streaming-links/streaming-link-form-dialog';
import { StreamingLink } from '@prisma/client';
import Link from 'next/link';
import { ROUTES_DOMAIN } from '@/lib/constants/domains/routes';

interface StreamingLinksPageProps {
  params: Promise<{
    animeId: string;
    mediaPartId: string;
    episodeId: string;
  }>;
}

export default function StreamingLinksPage({ params }: StreamingLinksPageProps) {
  const { animeId, mediaPartId, episodeId } = React.use(params);
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedStreamingLink, setSelectedStreamingLink] = React.useState<StreamingLink | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleEdit = (streamingLink: StreamingLink) => {
    setSelectedStreamingLink(streamingLink);
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedStreamingLink(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedStreamingLink(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={ROUTES_DOMAIN.PAGES.EDITOR.EPISODES.replace(':animeId', animeId)
            .replace(':mediaPartId', mediaPartId)}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">İzleme Linkleri</h1>
            <p className="text-muted-foreground">Bölüm için izleme linklerini yönetin</p>
          </div>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni İzleme Link
        </Button>
      </div>

      {/* Table */}
      <StreamingLinkTable
        episodeId={episodeId}
        onEdit={handleEdit}
        onCreateNew={handleCreateNew}
        refreshKey={refreshKey}
      />

      {/* Form Dialog */}
      <StreamingLinkFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        episodeId={episodeId}
        streamingLink={selectedStreamingLink}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
} 