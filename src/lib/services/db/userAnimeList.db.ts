// UserAnimeList modeli için CRUD operasyonları

import { Prisma, UserAnimeList } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Yeni anime listesi oluşturur
export async function createUserAnimeListDB(
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
export async function findUserAnimeListByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList | null> {
    try {
        return await client.userAnimeList.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                animeSeries: {
                    select: {
                        id: true,
                        title: true,
                        englishTitle: true,
                        nativeTitle: true,
                        coverImage: true,
                        bannerImage: true,
                        type: true,
                        status: true,
                        season: true,
                        seasonYear: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi ID ile bulma', { id });
    }
}

// Kullanıcı ve anime ile anime listesi bulur
export async function findUserAnimeListByUserAndAnimeDB(
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
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                animeSeries: {
                    select: {
                        id: true,
                        title: true,
                        englishTitle: true,
                        nativeTitle: true,
                        coverImage: true,
                        bannerImage: true,
                        type: true,
                        status: true,
                        season: true,
                        seasonYear: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve anime ile anime listesi bulma', { userId, animeSeriesId });
    }
}

// Kullanıcının anime listelerini getirir
export async function findUserAnimeListsByUserIdDB(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeList[]> {
    try {
        return await client.userAnimeList.findMany({
            where: { userId },
            include: {
                animeSeries: {
                    select: {
                        id: true,
                        title: true,
                        englishTitle: true,
                        nativeTitle: true,
                        coverImage: true,
                        bannerImage: true,
                        type: true,
                        status: true,
                        season: true,
                        seasonYear: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının anime listelerini bulma', { userId });
    }
}

// Anime listesi bilgilerini günceller
export async function updateUserAnimeListDB(
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
export async function deleteUserAnimeListDB(
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
export async function countUserAnimeListsDB(
    where?: Prisma.UserAnimeListWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userAnimeList.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime listesi sayma', { where });
    }
} 