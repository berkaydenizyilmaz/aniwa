'use client';

import { useState } from 'react';
import { AnimeFilters } from '@/components/modules/editor/anime/anime-filters';
import { AnimeTable } from '@/components/modules/editor/anime/anime-table';
import { AnimeFormDialog } from '@/components/modules/editor/anime/anime-form-dialog';
import { AnimeSeries } from '@prisma/client';

export default function EditorAnimePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSeries | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (anime: AnimeSeries) => {
    setSelectedAnime(anime);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedAnime(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAnime(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Anime Yönetimi</h1>
        <p className="text-muted-foreground">
          Anime serilerini yönetin, düzenleyin ve yeni anime ekleyin.
        </p>
      </div>

      <AnimeFilters 
        onAddNew={() => setDialogOpen(true)}
        onSearch={setSearchTerm}
      />

      <AnimeTable 
        onEdit={handleEdit}
        searchTerm={searchTerm}
        key={refreshKey}
      />

      <AnimeFormDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        anime={selectedAnime}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 