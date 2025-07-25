'use client';

import { useState } from 'react';
import { StudioFilters } from "@/components/modules/admin/studio/studio-filters";
import { StudioTable } from "@/components/modules/admin/studio/studio-table";
import { StudioFormDialog } from "@/components/modules/admin/studio/studio-form-dialog";
import { Studio } from '@prisma/client';

export default function StudiosPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedStudio(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (studio: Studio) => {
    setSelectedStudio(studio);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Stüdyolar</h1>
        <p className="text-muted-foreground">
          Anime stüdyolarını yönetin
        </p>
      </div>

      {/* Filtreler */}
      <StudioFilters onSearch={handleSearch} onAddNew={handleAddNew} />

      {/* Tablo */}
      <StudioTable 
        key={refreshKey}
        onEdit={handleEdit}
        searchTerm={searchTerm}
      />

      {/* Form Dialog */}
      <StudioFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        studio={selectedStudio}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 