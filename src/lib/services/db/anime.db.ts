// Anime Series modeli için CRUD operasyonları

import { Prisma, AnimeSeries } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime Serisi CRUD İşlemleri

// Anime serisi oluşturma
export async function createAnimeSeries(
  data: Prisma.AnimeSeriesCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi oluşturma', { data });
  }
}

// Anime serisi getirme (ID ile)
export async function findAnimeSeriesById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi ID ile bulma', { id });
  }
}

// Anime serisi getirme (Anilist ID ile)
export async function findAnimeSeriesByAnilistId(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { anilistId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi Anilist ID ile bulma', { anilistId });
  }
}

// Anime serisi getirme (MAL ID ile)
export async function findAnimeSeriesByMalId(
  idMal: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { idMal } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi MAL ID ile bulma', { idMal });
  }
}

// Anime serisi getirme (Aniwa Public ID ile)
export async function findAnimeSeriesByPublicId(
  aniwaPublicId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { aniwaPublicId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi Aniwa Public ID ile bulma', { aniwaPublicId });
  }
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function findAllAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries[]> {
  try {
    return await client.animeSeries.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime serilerini listeleme', { where, skip, take, orderBy });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  data: Prisma.AnimeSeriesUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi güncelleme', { where, data });
  }
}

// Anime serisi silme
export async function deleteAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi silme', { where });
  }
}

// Anime serisi sayısı
export async function countAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeSeries.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi sayma', { where });
  }
} 