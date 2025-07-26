// CustomList iş mantığı katmanı

import { BusinessError, ConflictError, NotFoundError } from '@/lib/errors';
import {
  createCustomList as createCustomListDB,
  findCustomListById,
  findCustomListByUserAndName,
  findCustomListsByUserId,
  updateCustomList as updateCustomListDB,
  deleteCustomList as deleteCustomListDB,
  createCustomListItem as createCustomListItemDB,
  findCustomListItemByListAndAnime,
  deleteCustomListItem as deleteCustomListItemDB,
} from '@/lib/services/db/customList.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  CreateCustomListRequest,
  GetUserCustomListsResponse,
  UpdateCustomListRequest,
  CreateCustomListResponse,
  UpdateCustomListResponse,
  DeleteCustomListResponse,
  GetUserCustomListsRequest,
  AddCustomListItemResponse,
} from '@/lib/types/api/customList.api';


// Özel liste oluşturma
export async function createCustomListBusiness(
  userId: string,
  data: CreateCustomListRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<CreateCustomListResponse>> {
  try {
    // İsim benzersizlik kontrolü (aynı kullanıcı için)
    const existingList = await findCustomListByUserAndName(userId, data.name);
    if (existingList) {
      throw new ConflictError('Bu isimde bir liste zaten mevcut');
    }

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      return await createCustomListDB({
        user: { connect: { id: userId } },
        name: data.name,
        description: data.description,
        isPublic: data.isPublic ?? true,
      }, tx);
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.USER.CUSTOM_LIST_CREATED,
      'Özel liste başarıyla oluşturuldu',
      {
        listId: result.id,
        name: result.name,
        userId: user.id,
        username: user.username,
      }
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Özel liste oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        name: data.name,
        username: user.username,
      }
    );

    throw new BusinessError('Özel liste oluşturma başarısız');
  }
}

// Kullanıcının özel listelerini getirme
export async function getUserCustomListsBusiness(
  userId: string,
  filters?: GetUserCustomListsRequest
): Promise<ApiResponse<GetUserCustomListsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının özel listelerini getir
    const customLists = await findCustomListsByUserId(userId);

    const total = customLists.length;
    const totalPages = Math.ceil(total / limit);

    // Sayfalama
    const paginatedLists = customLists.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        customLists: paginatedLists,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı özel listeleri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Özel listeler getirme başarısız');
  }
}

// Özel liste güncelleme
export async function updateCustomListBusiness(
  listId: string,
  userId: string,
  data: UpdateCustomListRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<UpdateCustomListResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }
    if (existingList.userId !== userId) {
      throw new NotFoundError('Liste bulunamadı');
    }

    // İsim güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingList.name) {
      const nameExists = await findCustomListByUserAndName(userId, data.name);
      if (nameExists) {
        throw new ConflictError('Bu isimde bir liste zaten mevcut');
      }
    }

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      return await updateCustomListDB(
        { id: listId },
        {
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
        },
        tx
      );
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.CUSTOM_LIST_UPDATED,
      'Özel liste başarıyla güncellendi',
      {
        listId: result.id,
        name: result.name,
        userId: user.id,
        username: user.username,
      }
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Özel liste güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
        username: user.username,
      }
    );

    throw new BusinessError('Özel liste güncelleme başarısız');
  }
}

// Özel liste silme
export async function deleteCustomListBusiness(
  listId: string,
  userId: string,
  user: { id: string; username: string }
): Promise<ApiResponse<DeleteCustomListResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }
    if (existingList.userId !== userId) {
      throw new NotFoundError('Liste bulunamadı');
    }

    // Transaction ile güvenli işlem
    await prisma.$transaction(async (tx) => {
      await deleteCustomListDB({ id: listId }, tx);
    });

    // Başarılı silme logu
    await logger.info(
      EVENTS.USER.CUSTOM_LIST_DELETED,
      'Özel liste başarıyla silindi',
      {
        listId,
        name: existingList.name,
        userId: user.id,
        username: user.username,
      }
    );

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Özel liste silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
        username: user.username,
      }
    );

    throw new BusinessError('Özel liste silme başarısız');
  }
}

// Listeye anime ekleme/çıkarma (toggle)
export async function toggleAnimeInListBusiness(
  listId: string,
  userAnimeListId: string,
  userId: string,
  user: { id: string; username: string }
): Promise<ApiResponse<AddCustomListItemResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }
    if (existingList.userId !== userId) {
      throw new NotFoundError('Liste bulunamadı');
    }

    // Mevcut liste öğesi durumunu kontrol et
    const existingItem = await findCustomListItemByListAndAnime(listId, userAnimeListId);

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingItem) {
        // Liste öğesi varsa çıkar
        const deletedItem = await deleteCustomListItemDB(
          { customListId_userAnimeListId: { customListId: listId, userAnimeListId } },
          tx
        );

        return deletedItem;
      } else {
        // Liste öğesi yoksa ekle
        // Son sıra numarasını bul
        const lastOrder = await tx.customListItem.findFirst({
          where: { customListId: listId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });

        const newOrder = (lastOrder?.order || 0) + 1;

        const newItem = await createCustomListItemDB({
          customList: { connect: { id: listId } },
          userAnimeList: { connect: { id: userAnimeListId } },
          order: newOrder,
        }, tx);

        return newItem;
      }
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Liste anime toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userAnimeListId,
        userId,
        username: user.username,
      }
    );

    throw new BusinessError('Liste anime işlemi başarısız');
  }
}

// Liste içeriğini getirme
export async function getListItemsBusiness(
  listId: string,
  userId: string,
  filters?: GetUserCustomListsRequest
): Promise<ApiResponse<GetUserCustomListsResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }
    if (existingList.userId !== userId) {
      throw new NotFoundError('Liste bulunamadı');
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;

    // Liste zaten include ile geldiği için direkt döndür
    return {
      success: true,
      data: {
        customLists: [existingList], // Tek liste olarak döndür
        total: 1,
        page,
        limit,
        totalPages: 1,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Liste içeriği getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
        filters,
      }
    );

    throw new BusinessError('Liste içeriği getirme başarısız');
  }
} 