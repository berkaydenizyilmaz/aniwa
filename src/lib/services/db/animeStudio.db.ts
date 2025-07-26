// AnimeStudio junction table için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime-Studio ilişkisi oluşturma
export async function createAnimeStudioDB(
  animeSeriesId: string,
  studioId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { studio: true } }>> {
  try {
    return await client.animeStudio.create({
      data: { animeSeriesId, studioId },
      include: { studio: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Studio ilişkisi oluşturma', { animeSeriesId, studioId });
  }
}

// Anime-Studio ilişkisi getirme (ID ile)
export async function findAnimeStudioByIdDB(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { studio: true } }> | null> {
  try {
    return await client.animeStudio.findUnique({
      where: { id },
      include: { studio: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Studio ilişkisi ID ile bulma', { id });
  }
}

// Anime serisi için studio'ları getirme
export async function findAnimeStudiosBySeriesIdDB(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { studio: true } }>[]> {
  try {
    return await client.animeStudio.findMany({
      where: { animeSeriesId },
      include: { studio: true },
      orderBy: { studio: { name: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için studio\'ları bulma', { animeSeriesId });
  }
}

// Studio için anime'leri getirme
export async function findAnimeStudiosByStudioIdDB(
  studioId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { animeSeries: true } }>[]> {
  try {
    return await client.animeStudio.findMany({
      where: { studioId },
      include: { animeSeries: true },
      orderBy: { animeSeries: { title: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Studio için anime\'leri bulma', { studioId });
  }
}

// Toplu Anime-Studio ilişkileri oluşturma
export async function createAnimeStudiosDB(
  animeSeriesId: string,
  studioIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeStudio.createMany({
      data: studioIds.map(studioId => ({ animeSeriesId, studioId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Studio ilişkileri oluşturma', { animeSeriesId, studioIds });
  }
}

// Anime-Studio ilişkisi silme
export async function deleteAnimeStudioDB(
  where: Prisma.AnimeStudioWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { studio: true } }>> {
  try {
    return await client.animeStudio.delete({
      where,
      include: { studio: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Studio ilişkisi silme', { where });
  }
}

// Anime serisi için tüm studio ilişkilerini silme
export async function deleteAnimeStudiosBySeriesIdDB(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeStudio.deleteMany({
      where: { animeSeriesId },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için studio ilişkilerini silme', { animeSeriesId });
  }
}

// Anime-Studio ilişkisi sayısı
export async function countAnimeStudiosDB(
  where?: Prisma.AnimeStudioWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeStudio.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Studio ilişkisi sayma', { where });
  }
} 