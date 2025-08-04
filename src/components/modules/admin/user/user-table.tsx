'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { User, UserRole } from '@prisma/client';
import { USER } from '@/lib/constants/user.constants';
import { getUsersAction, deleteUserAction } from '@/lib/actions/admin/user.action';
import { toast } from 'sonner';
import { GetUsersResponse } from '@/lib/types/api/user.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type UserFilters } from '@/lib/schemas/user.schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserTableProps {
  onEdit?: (user: User) => void;
  searchTerm?: string;
  selectedRole?: string;
  selectedBanned?: boolean | null;
}

export function UserTable({ onEdit, searchTerm = '', selectedRole = '', selectedBanned = null }: UserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Query key oluştur
  const queryKey = ['users', { searchTerm, selectedRole, selectedBanned, currentPage, limit }];

  // User'ları getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const filters: UserFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      if (selectedRole) filters.role = selectedRole as UserRole;
      if (selectedBanned !== null) filters.isBanned = selectedBanned;
      
      const result = await getUsersAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'Kullanıcılar yüklenirken bir hata oluştu');
      }
      return result.data as GetUsersResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteUserAction,
    onSuccess: () => {
      toast.success('Kullanıcı başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Delete user error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if (searchTerm || selectedRole || selectedBanned !== null) {
    setCurrentPage(1);
  }

  const handleEdit = (user: User) => {
    onEdit?.(user);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!data) return [];
    
    const pages = [];
    const maxVisiblePages = 5;
    
    if (data.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= data.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(data.totalPages);
      } else if (currentPage >= data.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = data.totalPages - 3; i <= data.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(data.totalPages);
      }
    }
    
    return pages;
  };

  if (isFetching) {
    return (
      <div className="glass-card">
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-destructive">Kullanıcılar yüklenirken bir hata oluştu</p>
      </div>
    );
  }

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.total || 0;

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Roller</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.roles?.map(role => USER.ROLE_LABELS[role]).join(', ') || '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isBanned 
                      ? USER.BAN_STATUS_COLORS.BANNED
                      : USER.BAN_STATUS_COLORS.ACTIVE
                  }`}>
                    {user.isBanned ? 'Yasaklı' : 'Aktif'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(user)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {totalUsers} kullanıcı, {currentPage}. sayfa / {totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Sayfa numaraları */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 py-1 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Sonraki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedUser?.username}&quot; kullanıcısını silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 