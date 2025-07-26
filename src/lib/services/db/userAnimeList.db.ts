// UserAnimeList modeli için CRUD operasyonları

import { Prisma, UserAnimeList, UserAnimePartProgress } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// UserAnimeList CRUD operasyonları

// Yeni anime listesi oluşturur
export async function createUserAnimeList(
    data: Prisma.UserAnimeListCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    try {
        return await client.userAnimeList.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi oluşturma', { data });
    }
}

// ID ile anime listesi bulur
export async function findUserAnimeListById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList | null> {
    try {
        return await client.userAnimeList.findUnique({
            where: { id },
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
                userPartProgress: {
                    include: {
                        animeMediaPart: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                episodes: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi ID ile bulma', { id });
    }
}

// Kullanıcı ve anime serisi ile anime listesi bulur
export async function findUserAnimeListByUserAndAnime(
    userId: string,
    animeSeriesId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList | null> {
    try {
        return await client.userAnimeList.findUnique({
            where: {
                userId_animeSeriesId: {
                    userId,
                    animeSeriesId,
                },
            },
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
                userPartProgress: {
                    include: {
                        animeMediaPart: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                episodes: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve anime serisi ile anime listesi bulma', { userId, animeSeriesId });
    }
}

// Kullanıcının tüm anime listelerini listeler
export async function findUserAnimeListsByUserId(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList[]> {
    try {
        return await client.userAnimeList.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
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
                userPartProgress: {
                    include: {
                        animeMediaPart: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                episodes: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının anime listelerini bulma', { userId });
    }
}

// Anime listesi bilgilerini günceller
export async function updateUserAnimeList(
    where: Prisma.UserAnimeListWhereUniqueInput,
    data: Prisma.UserAnimeListUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    try {
        return await client.userAnimeList.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi güncelleme', { where, data });
    }
}

// Anime listesini siler
export async function deleteUserAnimeList(
    where: Prisma.UserAnimeListWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    try {
        return await client.userAnimeList.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi silme', { where });
    }
}

// Anime listesi sayısını döner
export async function countUserAnimeLists(
    where?: Prisma.UserAnimeListWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userAnimeList.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi sayma', { where });
    }
}

// UserAnimePartProgress CRUD operasyonları

// Yeni anime parça ilerlemesi oluşturur
export async function createUserAnimePartProgress(
    data: Prisma.UserAnimePartProgressCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    try {
        return await client.userAnimePartProgress.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi oluşturma', { data });
    }
}

// ID ile anime parça ilerlemesi bulur
export async function findUserAnimePartProgressById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress | null> {
    try {
        return await client.userAnimePartProgress.findUnique({
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
                animeMediaPart: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        episodes: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi ID ile bulma', { id });
    }
}

// Liste ve parça ile anime parça ilerlemesi bulur
export async function findUserAnimePartProgressByListAndPart(
    userAnimeListId: string,
    animeMediaPartId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress | null> {
    try {
        return await client.userAnimePartProgress.findUnique({
            where: {
                userAnimeListId_animeMediaPartId: {
                    userAnimeListId,
                    animeMediaPartId,
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Liste ve parça ile anime parça ilerlemesi bulma', { userAnimeListId, animeMediaPartId });
    }
}

// Anime parça ilerlemesi bilgilerini günceller
export async function updateUserAnimePartProgress(
    where: Prisma.UserAnimePartProgressWhereUniqueInput,
    data: Prisma.UserAnimePartProgressUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    try {
        return await client.userAnimePartProgress.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi güncelleme', { where, data });
    }
}

// Anime parça ilerlemesini siler
export async function deleteUserAnimePartProgress(
    where: Prisma.UserAnimePartProgressWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    try {
        return await client.userAnimePartProgress.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi silme', { where });
    }
}

// Anime parça ilerlemesi sayısını döner
export async function countUserAnimePartProgress(
    where?: Prisma.UserAnimePartProgressWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userAnimePartProgress.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi sayma', { where });
    }
} 