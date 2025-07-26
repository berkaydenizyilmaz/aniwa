// CustomListItem modeli için CRUD operasyonları

import { Prisma, CustomListItem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Yeni özel liste öğesi oluşturur
export async function createCustomListItem(
    data: Prisma.CustomListItemCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    try {
        return await client.customListItem.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste öğesi oluşturma', { data });
    }
}

// ID ile özel liste öğesi bulur
export async function findCustomListItemById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem | null> {
    try {
        return await client.customListItem.findUnique({
            where: { id },
            include: {
                customList: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                userAnimeList: {
                    include: {
                        animeSeries: {
                            select: {
                                id: true,
                                title: true,
                                englishTitle: true,
                                japaneseTitle: true,
                                coverImage: true,
                                bannerImage: true,
                                type: true,
                                status: true,
                                season: true,
                                seasonYear: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste öğesi ID ile bulma', { id });
    }
}

// Liste ve anime ile özel liste öğesi bulur
export async function findCustomListItemByListAndAnime(
    customListId: string,
    userAnimeListId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem | null> {
    try {
        return await client.customListItem.findUnique({
            where: {
                customListId_userAnimeListId: {
                    customListId,
                    userAnimeListId,
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Liste ve anime ile özel liste öğesi bulma', { customListId, userAnimeListId });
    }
}

// Özel liste öğesi bilgilerini günceller
export async function updateCustomListItem(
    where: Prisma.CustomListItemWhereUniqueInput,
    data: Prisma.CustomListItemUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    try {
        return await client.customListItem.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste öğesi güncelleme', { where, data });
    }
}

// Özel liste öğesini siler
export async function deleteCustomListItem(
    where: Prisma.CustomListItemWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    try {
        return await client.customListItem.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste öğesi silme', { where });
    }
}

// Özel liste öğesi sayısını döner
export async function countCustomListItems(
    where?: Prisma.CustomListItemWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.customListItem.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste öğesi sayma', { where });
    }
} 