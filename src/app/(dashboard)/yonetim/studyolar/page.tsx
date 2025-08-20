'use client';

import { useState } from 'react';
import { StudioFilters } from "@/components/modules/admin/studio/studio-filters";
import { StudioTable } from "@/components/modules/admin/studio/studio-table";
import { StudioFormDialog } from "@/components/modules/admin/studio/studio-form-dialog";
import { Studio } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants/query-keys';

export default function StudiosPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudioType, setSelectedStudioType] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const handleAddNew = () => {
    setSelectedStudio(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (studio: Studio) => {
    setSelectedStudio(studio);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // Query'yi invalidate et
    queryClient.invalidateQueries({ queryKey: queryKeys.masterData.studio.all });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleStudioTypeChange = (isAnimationStudio: boolean | null) => {
    setSelectedStudioType(isAnimationStudio);
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
      <StudioFilters onSearch={handleSearch} onStudioTypeChange={handleStudioTypeChange} onAddNew={handleAddNew} />

      {/* Tablo */}
      <StudioTable 
        onEdit={handleEdit}
        searchTerm={searchTerm}
        selectedStudioType={selectedStudioType}
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