// UserAnimePartProgress modeli için CRUD operasyonları

import { Prisma, UserAnimePartProgress } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Yeni anime parça ilerlemesi oluşturur
export async function createUserAnimePartProgressDB(
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
export async function findUserAnimePartProgressByIdDB(
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
                },
                animeMediaPart: {
                    select: {
                        id: true,
                        title: true,
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
export async function findUserAnimePartProgressByListAndPartDB(
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
export async function updateUserAnimePartProgressDB(
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
export async function deleteUserAnimePartProgressDB(
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
export async function countUserAnimePartProgressDB(
    where?: Prisma.UserAnimePartProgressWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userAnimePartProgress.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime parça ilerlemesi sayma', { where });
    }
} 