// UserAnimeTracking modeli için CRUD operasyonları

import { Prisma, UserAnimeTracking } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// UserAnimeTracking CRUD operasyonları

// Yeni anime takip kaydı oluşturur
export async function createUserAnimeTracking(
    data: Prisma.UserAnimeTrackingCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking> {
    try {
        return await client.userAnimeTracking.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime takip kaydı oluşturma', { data });
    }
}

// ID ile anime takip kaydı bulur
export async function findUserAnimeTrackingById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking | null> {
    try {
        return await client.userAnimeTracking.findUnique({
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
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime takip kaydı ID ile bulma', { id });
    }
}

// Kullanıcı ve anime serisi ile anime takip kaydı bulur
export async function findUserAnimeTrackingByUserAndAnime(
    userId: string,
    animeSeriesId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking | null> {
    try {
        return await client.userAnimeTracking.findUnique({
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
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve anime serisi ile anime takip kaydı bulma', { userId, animeSeriesId });
    }
}

// Kullanıcının tüm anime takip kayıtlarını listeler
export async function findUserAnimeTrackingByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking[]> {
    try {
        return await client.userAnimeTracking.findMany({
            where: { userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
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
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının anime takip kayıtlarını bulma', { userId, skip, take });
    }
}

// Anime serisinin takip eden kullanıcılarını listeler
export async function findUserAnimeTrackingByAnimeSeriesId(
    animeSeriesId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking[]> {
    try {
        return await client.userAnimeTracking.findMany({
            where: { animeSeriesId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime serisinin takip eden kullanıcılarını bulma', { animeSeriesId, skip, take });
    }
}

// Tüm anime takip kayıtlarını listeler (filtrelemeli)
export async function findAllUserAnimeTracking(
    where?: Prisma.UserAnimeTrackingWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserAnimeTrackingOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking[]> {
    try {
        return await client.userAnimeTracking.findMany({
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
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm anime takip kayıtlarını listeleme', { where, skip, take, orderBy });
    }
}

// Anime takip kaydını siler
export async function deleteUserAnimeTracking(
    where: Prisma.UserAnimeTrackingWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserAnimeTracking> {
    try {
        return await client.userAnimeTracking.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime takip kaydı silme', { where });
    }
}

// Anime takip kaydı sayısını döner
export async function countUserAnimeTracking(
    where?: Prisma.UserAnimeTrackingWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userAnimeTracking.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Anime takip kaydı sayma', { where });
    }
} 