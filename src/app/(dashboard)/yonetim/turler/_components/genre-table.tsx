'use client';

import { useState, useEffect, useCallback } from 'react';
import { Genre } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Edit } from 'lucide-react';
import { GenreForm } from './genre-form';
import { updateGenre, deleteGenre } from '../_actions/genre.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGenreSchema, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  DeleteAlert, 
  CreateDialog, 
  SearchInput, 
  LoadingSkeleton,
  EditDialog
} from '../../_components';

export function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Edit form
  const editForm = useForm<UpdateGenreInput>({
    resolver: zodResolver(updateGenreSchema),
  });

  // Veri çekme
  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/admin/genres');
      const result = await response.json();
      
      if (result.success) {
        setGenres(result.data.genres);
      } else {
        toastError('Hata', 'Türler yüklenemedi');
      }
    } catch (error) {
      console.error('Fetch genres error:', error);
      toastError('Hata', 'Türler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Filtreleme
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit işlemi - useCallback ile optimize edildi
  const handleEdit = useCallback(async (genreId: string, data: UpdateGenreInput) => {
    if (isUpdating) return; // Prevent double submission
    
    setIsUpdating(genreId);
    try {
      const result = await updateGenre(genreId, data);

      if (!result.success) {
        if (result.fieldErrors) {
          setFormFieldErrors<UpdateGenreInput>(result.fieldErrors, editForm.setError);
        } else {
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla güncellendi!');
        editForm.reset();
        // Verileri yenilemek için state'i tetikle
        setGenres(prev => [...prev]);
      }
    } catch (error) {
      console.error('Edit genre error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(null);
    }
  }, [isUpdating, editForm]);

  // Silme işlemi - useCallback ile optimize edildi
  const handleDelete = useCallback(async (id: string) => {
    try {
      const result = await deleteGenre(id);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla silindi!');
        // Verileri yenilemek için state'i tetikle
        setGenres(prev => prev.filter(genre => genre.id !== id));
      }
    } catch (error) {
      console.error('Delete genre error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, []);

  // Edit dialog'u aç - useCallback ile optimize edildi
  const openEditDialog = useCallback((genre: Genre) => {
    editForm.reset({ name: genre.name });
  }, [editForm]);

  // Loading skeleton
  const loadingSkeleton = (
    <LoadingSkeleton itemCount={5} showSearch={true} showActionButton={true} />
  );

  // Empty state
  const emptyState = (
    <div className="text-center py-8 text-muted-foreground">
      {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz tür eklenmemiş.'}
    </div>
  );

  // Genre item component
  const GenreItem = ({ genre }: { genre: Genre }) => (
    <div
      key={genre.id}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/20 rounded-lg hover:bg-muted/30 transition-all duration-200 gap-3 bg-card/80 backdrop-blur-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate text-foreground">{genre.name}</div>
        <div className="text-sm text-muted-foreground truncate">
          Slug: {genre.slug}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 shrink-0">
        {/* Edit Dialog */}
        <EditDialog
          title="Tür Düzenle"
          description={`"${genre.name}" türünün adını güncelleyin.`}
          onEdit={(data) => handleEdit(genre.id, data as UpdateGenreInput)}
          isLoading={isUpdating === genre.id}
          trigger={
            <Button
              variant="outline"
              size="sm"
              loading={isUpdating === genre.id}
              onClick={() => openEditDialog(genre)}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
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
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Tür adı"
                          disabled={isDialogUpdating}
                          className="bg-card/80 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isDialogUpdating}
                    className="hover:bg-muted/80 transition-all duration-200"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit"
                    loading={isDialogUpdating}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
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
          title="Türü Sil"
          description={`"${genre.name}" türünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tür ile ilişkili tüm anime verileri etkilenebilir.`}
          onDelete={() => handleDelete(genre.id)}
        />
      </div>
    </div>
  );

  // Loading skeleton
  if (isLoading) {
    return loadingSkeleton;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-md border border-border/20 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-foreground">Türler ({filteredGenres.length})</CardTitle>
          <CreateDialog
            title="Yeni Tür Ekle"
            description="Yeni bir anime türü ekleyin. Tür adı benzersiz olmalıdır."
          >
            {({ onClose }) => (
              <GenreForm
                onSuccess={() => {
                  fetchGenres();
                }}
                onClose={onClose}
              />
            )}
          </CreateDialog>
        </div>
        
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tür ara..."
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {filteredGenres.length === 0 ? (
            emptyState
          ) : (
            filteredGenres.map((genre) => (
              <GenreItem key={genre.id} genre={genre} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 