// Favori anime modeli için CRUD operasyonları

import { Prisma, FavouriteAnimeSeries } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Favori anime CRUD operasyonları

// Yeni favori anime oluşturur
export async function createFavouriteAnimeSeries(
    data: Prisma.FavouriteAnimeSeriesCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries> {
    try {
        return await client.favouriteAnimeSeries.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Favori anime oluşturma', { data });
    }
}

// ID ile favori anime bulur
export async function findFavouriteAnimeSeriesById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries | null> {
    try {
        return await client.favouriteAnimeSeries.findUnique({
            where: { id },
        });
    } catch (error) {
        handleDatabaseError(error, 'Favori anime ID ile bulma', { id });
    }
}

// Kullanıcı ve anime serisi ile favori anime bulur
export async function findFavouriteAnimeSeriesByUserAndAnime(
    userId: string,
    animeSeriesId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries | null> {
    try {
        return await client.favouriteAnimeSeries.findUnique({
            where: {
                userId_animeSeriesId: {
                    userId,
                    animeSeriesId,
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve anime serisi ile favori anime bulma', { userId, animeSeriesId });
    }
}

// Kullanıcının tüm favori animelerini listeler
export async function findFavouriteAnimeSeriesByUserId(
  userId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries[]> {
    try {
        return await client.favouriteAnimeSeries.findMany({
            where: { userId },
            orderBy: { order: 'asc' },
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
        handleDatabaseError(error, 'Kullanıcının favori animelerini bulma', { userId });
    }
}

// Anime serisinin favori sayısını döner
export async function findFavouriteAnimeSeriesByAnimeSeriesId(
    animeSeriesId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries[]> {
    try {
        return await client.favouriteAnimeSeries.findMany({
            where: { animeSeriesId },
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
        handleDatabaseError(error, 'Anime serisinin favori sayısını bulma', { animeSeriesId });
    }
}

// Tüm favori animeleri listeler (filtrelemeli)
export async function findAllFavouriteAnimeSeries(
    where?: Prisma.FavouriteAnimeSeriesWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.FavouriteAnimeSeriesOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries[]> {
    try {
        return await client.favouriteAnimeSeries.findMany({
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
        handleDatabaseError(error, 'Tüm favori animeleri listeleme', { where, skip, take, orderBy });
    }
}

// Favori anime bilgilerini günceller
export async function updateFavouriteAnimeSeries(
    where: Prisma.FavouriteAnimeSeriesWhereUniqueInput,
    data: Prisma.FavouriteAnimeSeriesUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries> {
    try {
        return await client.favouriteAnimeSeries.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Favori anime güncelleme', { where, data });
    }
}

// Favori anime'yi siler
export async function deleteFavouriteAnimeSeries(
    where: Prisma.FavouriteAnimeSeriesWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<FavouriteAnimeSeries> {
    try {
        return await client.favouriteAnimeSeries.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Favori anime silme', { where });
    }
}

// Favori anime sayısını döner
export async function countFavouriteAnimeSeries(
    where?: Prisma.FavouriteAnimeSeriesWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.favouriteAnimeSeries.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Favori anime sayma', { where });
    }
} 