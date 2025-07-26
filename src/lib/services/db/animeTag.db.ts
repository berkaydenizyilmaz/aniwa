// AnimeTag junction table için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime-Tag ilişkisi oluşturma
export async function createAnimeTag(
  animeSeriesId: string,
  tagId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { tag: true } }>> {
  try {
    return await client.animeTag.create({
      data: { animeSeriesId, tagId },
      include: { tag: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Tag ilişkisi oluşturma', { animeSeriesId, tagId });
  }
}

// Anime-Tag ilişkisi getirme (ID ile)
export async function findAnimeTagById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { tag: true } }> | null> {
  try {
    return await client.animeTag.findUnique({
      where: { id },
      include: { tag: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Tag ilişkisi ID ile bulma', { id });
  }
}

// Anime serisi için tag'leri getirme
export async function findAnimeTagsBySeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { tag: true } }>[]> {
  try {
    return await client.animeTag.findMany({
      where: { animeSeriesId },
      include: { tag: true },
      orderBy: { tag: { name: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için tag\'leri bulma', { animeSeriesId });
  }
}

// Tag için anime'leri getirme
export async function findAnimeTagsByTagId(
  tagId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { animeSeries: true } }>[]> {
  try {
    return await client.animeTag.findMany({
      where: { tagId },
      include: { animeSeries: true },
      orderBy: { animeSeries: { title: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tag için anime\'leri bulma', { tagId });
  }
}

// Toplu Anime-Tag ilişkileri oluşturma
export async function createAnimeTags(
  animeSeriesId: string,
  tagIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeTag.createMany({
      data: tagIds.map(tagId => ({ animeSeriesId, tagId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Tag ilişkileri oluşturma', { animeSeriesId, tagIds });
  }
}

// Anime-Tag ilişkisi silme
export async function deleteAnimeTag(
  where: Prisma.AnimeTagWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { tag: true } }>> {
  try {
    return await client.animeTag.delete({
      where,
      include: { tag: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Tag ilişkisi silme', { where });
  }
}

// Anime serisi için tüm tag ilişkilerini silme
export async function deleteAnimeTagsBySeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeTag.deleteMany({
      where: { animeSeriesId },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için tag ilişkilerini silme', { animeSeriesId });
  }
}

// Anime-Tag ilişkisi sayısı
export async function countAnimeTags(
  where?: Prisma.AnimeTagWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeTag.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Tag ilişkisi sayma', { where });
  }
} 