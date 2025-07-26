// CustomList modeli için CRUD operasyonları

import { Prisma, CustomList } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Yeni özel liste oluşturur
export async function createCustomListDB(
    data: Prisma.CustomListCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    try {
        return await client.customList.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste oluşturma', { data });
    }
}

// ID ile özel liste bulur
export async function findCustomListByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList | null> {
    try {
        return await client.customList.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                listItems: {
                    include: {
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
                    orderBy: { order: 'asc' },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste ID ile bulma', { id });
    }
}

// Kullanıcı ve isim ile özel liste bulur
export async function findCustomListByUserAndNameDB(
    userId: string,
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList | null> {
    try {
        return await client.customList.findUnique({
            where: {
                userId_name: {
                    userId,
                    name,
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve isim ile özel liste bulma', { userId, name });
    }
}

// Kullanıcının özel listelerini getirir
export async function findCustomListsByUserIdDB(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList[]> {
    try {
        return await client.customList.findMany({
            where: { userId },
            include: {
                listItems: {
                    include: {
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
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının özel listelerini bulma', { userId });
    }
}

// Tüm özel listeleri listeler (filtrelemeli)
export async function findAllCustomListsDB(
    where?: Prisma.CustomListWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.CustomListOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList[]> {
    try {
        return await client.customList.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                listItems: {
                    include: {
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
                    orderBy: { order: 'asc' },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm özel listeleri listeleme', { where, skip, take, orderBy });
    }
}

// Özel liste günceller
export async function updateCustomListDB(
    where: Prisma.CustomListWhereUniqueInput,
    data: Prisma.CustomListUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    try {
        return await client.customList.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste güncelleme', { where, data });
    }
}

// Özel liste siler
export async function deleteCustomListDB(
    where: Prisma.CustomListWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    try {
        return await client.customList.delete({
            where,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste silme', { where });
    }
}

// Özel liste sayısını döner
export async function countCustomListsDB(
    where?: Prisma.CustomListWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.customList.count({
            where,
        });
    } catch (error) {
        handleDatabaseError(error, 'Özel liste sayma', { where });
    }
} 