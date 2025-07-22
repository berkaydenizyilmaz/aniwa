'use client';

import { useState, useEffect } from 'react';
import { Tag, TagCategory } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Edit } from 'lucide-react';
import { TagForm } from './tag-form';
import { updateTag, deleteTag } from '../_actions/tag.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTagSchema, type UpdateTagInput } from '@/lib/schemas/tag.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';
import { 
  DeleteAlert, 
  CreateDialog, 
  SearchInput, 
  LoadingSkeleton,
  EditDialog
} from '../../_components';

export function TagTable() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Edit form
  const editForm = useForm<UpdateTagInput>({
    resolver: zodResolver(updateTagSchema),
  });

  // Veri çekme
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags');
      const result = await response.json();
      
      if (result.success) {
        setTags(result.data.tags);
      } else {
        toastError('Hata', 'Etiketler yüklenemedi');
      }
    } catch {
      toastError('Hata', 'Etiketler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Filtreleme
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit işlemi
  const handleEdit = async (tagId: string, data: UpdateTagInput) => {
    setIsUpdating(tagId);
    try {
      const result = await updateTag(tagId, data);

      if (!result.success) {
        if (result.fieldErrors) {
          setFormFieldErrors<UpdateTagInput>(result.fieldErrors, editForm.setError);
        } else {
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Etiket başarıyla güncellendi!');
        editForm.reset();
        fetchTags(); // Verileri yenile
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Silme işlemi
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTag(id);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Etiket başarıyla silindi!');
        fetchTags(); // Verileri yenile
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Edit dialog'u aç
  const openEditDialog = (tag: Tag) => {
    editForm.reset({ 
      name: tag.name,
      description: tag.description || undefined,
      category: tag.category as TagCategory,
      isAdult: tag.isAdult,
      isSpoiler: tag.isSpoiler
    });
  };

  // Loading skeleton
  if (isLoading) {
    return <LoadingSkeleton itemCount={5} showSearch={true} showActionButton={true} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Etiketler ({filteredTags.length})</CardTitle>
          <CreateDialog
            title="Yeni Etiket Ekle"
            description="Yeni bir anime etiketi ekleyin. Etiket adı benzersiz olmalıdır."
          >
            {({ onClose }) => (
              <TagForm
                onSuccess={() => {
                  fetchTags();
                }}
                onClose={onClose}
              />
            )}
          </CreateDialog>
        </div>
        
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Etiket ara..."
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {filteredTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz etiket eklenmemiş.'}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{tag.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {tag.description ? `${tag.description} | ` : ''}
                    {tag.category ? `Kategori: ${tag.category} | ` : ''}
                    {tag.isAdult ? 'Yetişkin İçerik | ' : ''}
                    {tag.isSpoiler ? 'Spoiler | ' : ''}
                    Slug: {tag.slug}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Edit Dialog */}
                  <EditDialog
                    title="Etiket Düzenle"
                    description={`"${tag.name}" etiketini güncelleyin.`}
                    onEdit={(data: UpdateTagInput) => handleEdit(tag.id, data)}
                    isLoading={isUpdating === tag.id}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        loading={isUpdating === tag.id}
                        onClick={() => openEditDialog(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  >
                    {({ onClose, onSubmit, isUpdating: isDialogUpdating }) => (
                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Etiket Adı</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Etiket adı"
                                    disabled={isDialogUpdating}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={editForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Açıklama</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Etiket açıklaması"
                                    disabled={isDialogUpdating}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={editForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select
                                  disabled={isDialogUpdating}
                                  onValueChange={field.onChange}
                                  value={field.value || ''}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(MASTER_DATA.TAG_CATEGORY).map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <FormField
                              control={editForm.control}
                              name="isAdult"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Yetişkin İçerik</FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={isDialogUpdating}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editForm.control}
                              name="isSpoiler"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Spoiler</FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={isDialogUpdating}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={onClose}
                              disabled={isDialogUpdating}
                            >
                              İptal
                            </Button>
                            <Button 
                              type="submit"
                              loading={isDialogUpdating}
                            >
                              Güncelle
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    )}
                  </EditDialog>

                  {/* Delete Alert */}
                  <DeleteAlert
                    title="Etiketi Sil"
                    description={`"${tag.name}" etiketini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve etiket ile ilişkili tüm anime verileri etkilenebilir.`}
                    onDelete={() => handleDelete(tag.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}