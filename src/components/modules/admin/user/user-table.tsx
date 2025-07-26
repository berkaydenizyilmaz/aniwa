'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { User, UserRole } from '@prisma/client';
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
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { type UserFilters } from '@/lib/schemas/user.schema';

interface UserTableProps {
  onEdit?: (user: User) => void;
  searchTerm?: string;
  selectedRole?: string;
  selectedBanned?: boolean | null;
}

export function UserTable({ onEdit, searchTerm = '', selectedRole = '', selectedBanned = null }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(50);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // User'ları getir (server-side filtreleme)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.USERS, true);
        const filters: UserFilters = {
          page: currentPage,
          limit: limit,
        };
        if (searchTerm) filters.search = searchTerm;
        if (selectedRole) filters.role = selectedRole as UserRole;
        if (selectedBanned !== null) filters.isBanned = selectedBanned;
        const result = await getUsersAction(filters);
        if (!result.success) {
          toast.error(result.error || 'Kullanıcılar yüklenirken bir hata oluştu');
          return;
        }
        const data = result.data as GetUsersResponse;
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalUsers(data.total);
      } catch (error) {
        console.error('Fetch users error:', error);
        toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.USERS, false);
      }
    };
    fetchUsers();
  }, [setLoadingStore, searchTerm, selectedRole, selectedBanned, currentPage, limit]);

  // Filtreler değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedBanned]);

  // Client-side filtreleme kaldırıldı, direkt users kullanılıyor
  const handleEdit = (user: User) => {
    onEdit?.(user);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || isLoading(LOADING_KEYS.ACTIONS.DELETE_USER)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_USER, true);

    try {
      const result = await deleteUserAction(selectedUser.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Kullanıcı başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getUsersAction({ page: currentPage, limit });
      if (fetchResult.success) {
        const data = fetchResult.data as GetUsersResponse;
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalUsers(data.total);
      }

    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_USER, false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading(LOADING_KEYS.PAGES.USERS)) {
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

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Kullanıcı Adı</TableHead>
              <TableHead className="w-1/5">Email</TableHead>
              <TableHead className="w-1/5">Roller</TableHead>
              <TableHead className="w-1/5">Durum</TableHead>
              <TableHead className="w-1/5">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.roles?.join(', ') || '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isBanned 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
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
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.USERS)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.USERS)}
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
                        disabled={isLoading(LOADING_KEYS.PAGES.USERS)}
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
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.USERS)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.USERS)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedUser?.username}</strong> kullanıcısını silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_USER)}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_USER)}
              variant="destructive"
            >
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 