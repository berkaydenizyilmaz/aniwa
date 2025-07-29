// Anime Media Part modeli için CRUD operasyonları

import { Prisma, AnimeMediaPart } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime medya parçası oluşturma
export async function createAnimeMediaPartDB(
  data: Prisma.AnimeMediaPartCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası oluşturma', { data });
  }
}

// Anime medya parçası getirme (ID ile)
export async function findAnimeMediaPartByIdDB(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  try {
    return await client.animeMediaPart.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası ID ile bulma', { id });
  }
}

// Anime medya parçası getirme (Anilist ID ile)
export async function findAnimeMediaPartByAnilistIdDB(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  try {
    return await client.animeMediaPart.findUnique({ where: { anilistId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası Anilist ID ile bulma', { anilistId });
  }
}

// Anime medya parçası getirme (MAL ID ile)
export async function findAnimeMediaPartByMalIdDB(
  malId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  try {
    return await client.animeMediaPart.findUnique({ where: { malId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası MAL ID ile bulma', { malId });
  }
}

// Anime serisi için medya parçalarını getirme
export async function findAnimeMediaPartsBySeriesIdDB(
  seriesId: string,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  try {
    return await client.animeMediaPart.findMany({
      where: { seriesId },
      orderBy,
      include: {
        partsEpisodes: { orderBy: { episodeNumber: 'asc' } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için medya parçalarını bulma', { seriesId, orderBy });
  }
}

// Tüm anime medya parçalarını getirme (filtrelemeli)
export async function findAllAnimeMediaPartsDB(
  where?: Prisma.AnimeMediaPartWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  try {
    return await client.animeMediaPart.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        series: { select: { id: true, title: true, englishTitle: true } },
        partsEpisodes: { orderBy: { episodeNumber: 'asc' } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime medya parçalarını listeleme', { where, skip, take, orderBy });
  }
}

// Anime medya parçası güncelleme
export async function updateAnimeMediaPartDB(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  data: Prisma.AnimeMediaPartUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası güncelleme', { where, data });
  }
}

// Anime medya parçası silme
export async function deleteAnimeMediaPartDB(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası silme', { where });
  }
}

// Anime medya parçası sayısı
export async function countAnimeMediaPartsDB(
  where?: Prisma.AnimeMediaPartWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeMediaPart.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası sayma', { where });
  }
} 