'use client';

import { useState } from 'react';
import { TagFilters } from "@/components/modules/admin/tag/tag-filters";
import { TagTable } from "@/components/modules/admin/tag/tag-table";
import { TagFormDialog } from "@/components/modules/admin/tag/tag-form-dialog";
import { Tag } from '@prisma/client';

export default function TagsPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleAddNew = () => {
    setSelectedTag(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
      <TagFilters onSearch={handleSearch} onCategoryChange={handleCategoryChange} onAddNew={handleAddNew} />

      {/* Tablo */}
      <TagTable 
        key={refreshKey}
        onEdit={handleEdit}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
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