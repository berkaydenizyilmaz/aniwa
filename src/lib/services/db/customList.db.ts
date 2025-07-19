// CustomList modeli için CRUD operasyonları

import { Prisma, CustomList, CustomListItem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// CustomList CRUD operasyonları

// Yeni özel liste oluşturur
export async function createCustomList(
    data: Prisma.CustomListCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    return await client.customList.create({
        data,
    });
}

// ID ile özel liste bulur
export async function findCustomListById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList | null> {
    return await client.customList.findUnique({
        where: { id },
        include: {
            listItems: {
                orderBy: { order: 'asc' },
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
            },
        },
    });
}

// Kullanıcı ve isim ile özel liste bulur
export async function findCustomListByUserAndName(
    userId: string,
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList | null> {
    return await client.customList.findUnique({
        where: {
            userId_name: {
                userId,
                name,
            },
        },
    });
}

// Kullanıcının tüm özel listelerini listeler
export async function findCustomListsByUserId(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList[]> {
    return await client.customList.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            listItems: {
                orderBy: { order: 'asc' },
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
            },
        },
    });
}

// Tüm özel listeleri listeler (filtrelemeli)
export async function findAllCustomLists(
    where?: Prisma.CustomListWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.CustomListOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList[]> {
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
                orderBy: { order: 'asc' },
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
            },
        },
    });
}

// Özel liste bilgilerini günceller
export async function updateCustomList(
    where: Prisma.CustomListWhereUniqueInput,
    data: Prisma.CustomListUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    return await client.customList.update({
        where,
        data,
    });
}

// Özel listeyi siler
export async function deleteCustomList(
    where: Prisma.CustomListWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomList> {
    return await client.customList.delete({ where });
}

// Özel liste sayısını döner
export async function countCustomLists(
    where?: Prisma.CustomListWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.customList.count({ where });
}

// CustomListItem CRUD operasyonları

// Yeni liste öğesi oluşturur
export async function createCustomListItem(
    data: Prisma.CustomListItemCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    return await client.customListItem.create({
        data,
    });
}

// ID ile liste öğesi bulur
export async function findCustomListItemById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem | null> {
    return await client.customListItem.findUnique({
        where: { id },
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
    });
}

// Liste ve anime ile liste öğesi bulur
export async function findCustomListItemByListAndAnime(
    customListId: string,
    userAnimeListId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem | null> {
    return await client.customListItem.findUnique({
        where: {
            customListId_userAnimeListId: {
                customListId,
                userAnimeListId,
            },
        },
    });
}

// Liste öğesi bilgilerini günceller
export async function updateCustomListItem(
    where: Prisma.CustomListItemWhereUniqueInput,
    data: Prisma.CustomListItemUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    return await client.customListItem.update({
        where,
        data,
    });
}

// Liste öğesini siler
export async function deleteCustomListItem(
    where: Prisma.CustomListItemWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CustomListItem> {
    return await client.customListItem.delete({ where });
}

// Liste öğesi sayısını döner
export async function countCustomListItems(
    where?: Prisma.CustomListItemWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.customListItem.count({ where });
} 