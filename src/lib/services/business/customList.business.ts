// CustomList iş mantığı katmanı

import { BusinessError, ConflictError, NotFoundError, DatabaseError } from '@/lib/errors';
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
  GetCustomListItemsResponse,
} from '@/lib/types/api/customList.api';


// Özel liste oluşturma
export async function createCustomListBusiness(
  userId: string,
  data: CreateCustomListRequest
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
        name: result.name
      },
      userId
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Özel liste oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        name: data.name
      },
      userId
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

    // Kullanıcının listelerini getir
    const lists = await findCustomListsByUserId(userId);
    const total = await prisma.customList.count({ where: { userId } });
    const totalPages = Math.ceil(total / limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.CUSTOM_LISTS_RETRIEVED,
      'Kullanıcı özel listeleri görüntülendi',
      {
        userId,
        total,
        page,
        limit,
        totalPages,
      },
      userId
    );

    return {
      success: true,
      data: {
        customLists: lists,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı özel listeleri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Kullanıcı özel listeleri getirme başarısız');
  }
}

// Özel liste güncelleme
export async function updateCustomListBusiness(
  listId: string,
  userId: string,
  data: UpdateCustomListRequest
): Promise<ApiResponse<UpdateCustomListResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }

    if (existingList.userId !== userId) {
      throw new BusinessError('Bu listeyi düzenleme yetkiniz yok');
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
        oldName: existingList.name
      },
      userId
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Özel liste güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
        data,
      },
      userId
    );

    throw new BusinessError('Özel liste güncelleme başarısız');
  }
}

// Özel liste silme
export async function deleteCustomListBusiness(
  listId: string,
  userId: string
): Promise<ApiResponse<DeleteCustomListResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }

    if (existingList.userId !== userId) {
      throw new BusinessError('Bu listeyi silme yetkiniz yok');
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
        name: existingList.name
      },
      userId
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Özel liste silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
      },
      userId
    );

    throw new BusinessError('Özel liste silme başarısız');
  }
}

// Anime'yi listeye ekle/çıkar
export async function toggleAnimeInListBusiness(
  listId: string,
  userAnimeListId: string,
  userId: string
): Promise<ApiResponse<AddCustomListItemResponse>> {
  try {
    // Liste mevcut mu ve kullanıcıya ait mi kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }

    if (existingList.userId !== userId) {
      throw new BusinessError('Bu listeyi düzenleme yetkiniz yok');
    }

    // UserAnimeList mevcut mu kontrolü
    const userAnimeList = await prisma.userAnimeList.findUnique({
      where: { id: userAnimeListId },
    });
    if (!userAnimeList) {
      throw new NotFoundError('Anime listesi bulunamadı');
    }

    // Mevcut item kontrolü
    const existingItem = await findCustomListItemByListAndAnime(listId, userAnimeListId);

    let result;
    if (existingItem) {
      // Item'ı kaldır
      await deleteCustomListItemDB({ id: existingItem.id });
      result = undefined;
    } else {
      // Item ekle
      const newItem = await createCustomListItemDB({
        customList: { connect: { id: listId } },
        userAnimeList: { connect: { id: userAnimeListId } },
      });
      result = { id: newItem.id, createdAt: newItem.createdAt, updatedAt: newItem.updatedAt, order: newItem.order, userAnimeListId: newItem.userAnimeListId, customListId: newItem.customListId };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime listeye ekleme/çıkarma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userAnimeListId,
        userId,
      },
      userId
    );

    throw new BusinessError('Anime listeye ekleme/çıkarma başarısız');
  }
}

// Liste itemlarını getirme
export async function getListItemsBusiness(
  listId: string,
  userId: string,
  filters?: GetUserCustomListsRequest
): Promise<ApiResponse<GetCustomListItemsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;

    // Liste mevcut mu kontrolü
    const existingList = await findCustomListById(listId);
    if (!existingList) {
      throw new NotFoundError('Liste bulunamadı');
    }

    // Liste itemlarını getir
    const items = await prisma.customListItem.findMany({
      where: { customListId: listId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        userAnimeList: {
          include: {
            animeSeries: true,
          },
        },
      },
    });

    const total = await prisma.customListItem.count({ where: { customListId: listId } });
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        customListItems: items,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Liste itemları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        listId,
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Liste itemları getirme başarısız');
  }
} 