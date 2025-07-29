'use client';

import { useState } from 'react';
import { TagFilters } from "@/components/modules/admin/tag/tag-filters";
import { TagTable } from "@/components/modules/admin/tag/tag-table";
import { TagFormDialog } from "@/components/modules/admin/tag/tag-form-dialog";
import { Tag } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

export default function TagsPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAdult, setSelectedAdult] = useState<boolean | null>(null);
  const [selectedSpoiler, setSelectedSpoiler] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const handleAddNew = () => {
    setSelectedTag(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // Query'yi invalidate et
    queryClient.invalidateQueries({ queryKey: ['tags'] });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAdultChange = (isAdult: boolean | null) => {
    setSelectedAdult(isAdult);
  };

  const handleSpoilerChange = (isSpoiler: boolean | null) => {
    setSelectedSpoiler(isSpoiler);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Etiketler</h1>
        <p className="text-muted-foreground">
          Anime etiketlerini yönetin
        </p>
      </div>

      {/* Filtreler */}
      <TagFilters 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange} 
        onAdultChange={handleAdultChange}
        onSpoilerChange={handleSpoilerChange}
        onAddNew={handleAddNew} 
      />

      {/* Tablo */}
      <TagTable 
        onEdit={handleEdit}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedAdult={selectedAdult}
        selectedSpoiler={selectedSpoiler}
      />

      {/* Form Dialog */}
      <TagFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        tag={selectedTag}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 