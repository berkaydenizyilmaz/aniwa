// UserAnimeList modeli için CRUD operasyonları

import { Prisma, UserAnimeList, UserAnimePartProgress } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// UserAnimeList CRUD operasyonları

// Yeni anime listesi oluşturur
export async function createUserAnimeList(
    data: Prisma.UserAnimeListCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    return await client.userAnimeList.create({
        data,
    });
}

// ID ile anime listesi bulur
export async function findUserAnimeListById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList | null> {
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
}

// Kullanıcı ve anime serisi ile anime listesi bulur
export async function findUserAnimeListByUserAndAnime(
    userId: string,
    animeSeriesId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList | null> {
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
}

// Kullanıcının tüm anime listelerini listeler
export async function findUserAnimeListsByUserId(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList[]> {
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
}

// Anime listesi bilgilerini günceller
export async function updateUserAnimeList(
    where: Prisma.UserAnimeListWhereUniqueInput,
    data: Prisma.UserAnimeListUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    return await client.userAnimeList.update({
        where,
        data,
    });
}

// Anime listesini siler
export async function deleteUserAnimeList(
    where: Prisma.UserAnimeListWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList> {
    return await client.userAnimeList.delete({ where });
}

// Anime listesi sayısını döner
export async function countUserAnimeLists(
    where?: Prisma.UserAnimeListWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.userAnimeList.count({ where });
}

// UserAnimePartProgress CRUD operasyonları

// Yeni medya parçası ilerlemesi oluşturur
export async function createUserAnimePartProgress(
    data: Prisma.UserAnimePartProgressCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    return await client.userAnimePartProgress.create({
        data,
    });
}

// ID ile medya parçası ilerlemesi bulur
export async function findUserAnimePartProgressById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress | null> {
    return await client.userAnimePartProgress.findUnique({
        where: { id },
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
    });
}

// Anime listesi ve medya parçası ile ilerleme bulur
export async function findUserAnimePartProgressByListAndPart(
    userAnimeListId: string,
    animeMediaPartId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress | null> {
    return await client.userAnimePartProgress.findUnique({
        where: {
            userAnimeListId_animeMediaPartId: {
                userAnimeListId,
                animeMediaPartId,
            },
        },
    });
}

// Medya parçası ilerlemesi bilgilerini günceller
export async function updateUserAnimePartProgress(
    where: Prisma.UserAnimePartProgressWhereUniqueInput,
    data: Prisma.UserAnimePartProgressUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    return await client.userAnimePartProgress.update({
        where,
        data,
    });
}

// Medya parçası ilerlemesini siler
export async function deleteUserAnimePartProgress(
    where: Prisma.UserAnimePartProgressWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimePartProgress> {
    return await client.userAnimePartProgress.delete({ where });
}

// Medya parçası ilerlemesi sayısını döner
export async function countUserAnimePartProgress(
    where?: Prisma.UserAnimePartProgressWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.userAnimePartProgress.count({ where });
} 