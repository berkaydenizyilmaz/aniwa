// AnimeGenre junction table için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime-Genre ilişkisi oluşturma
export async function createAnimeGenre(
  animeSeriesId: string,
  genreId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { genre: true } }>> {
  try {
    return await client.animeGenre.create({
      data: { animeSeriesId, genreId },
      include: { genre: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Genre ilişkisi oluşturma', { animeSeriesId, genreId });
  }
}

// Anime-Genre ilişkisi getirme (ID ile)
export async function findAnimeGenreById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { genre: true } }> | null> {
  try {
    return await client.animeGenre.findUnique({
      where: { id },
      include: { genre: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Genre ilişkisi ID ile bulma', { id });
  }
}

// Anime serisi için genre'leri getirme
export async function findAnimeGenresBySeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { genre: true } }>[]> {
  try {
    return await client.animeGenre.findMany({
      where: { animeSeriesId },
      include: { genre: true },
      orderBy: { genre: { name: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için genre\'leri bulma', { animeSeriesId });
  }
}

// Genre için anime'leri getirme
export async function findAnimeGenresByGenreId(
  genreId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { animeSeries: true } }>[]> {
  try {
    return await client.animeGenre.findMany({
      where: { genreId },
      include: { animeSeries: true },
      orderBy: { animeSeries: { title: 'asc' } },
    });
  } catch (error) {
    handleDatabaseError(error, 'Genre için anime\'leri bulma', { genreId });
  }
}

// Toplu Anime-Genre ilişkileri oluşturma
export async function createAnimeGenres(
  animeSeriesId: string,
  genreIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeGenre.createMany({
      data: genreIds.map(genreId => ({ animeSeriesId, genreId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Genre ilişkileri oluşturma', { animeSeriesId, genreIds });
  }
}

// Anime-Genre ilişkisi silme
export async function deleteAnimeGenre(
  where: Prisma.AnimeGenreWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { genre: true } }>> {
  try {
    return await client.animeGenre.delete({
      where,
      include: { genre: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Genre ilişkisi silme', { where });
  }
}

// Anime serisi için tüm genre ilişkilerini silme
export async function deleteAnimeGenresBySeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeGenre.deleteMany({
      where: { animeSeriesId },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için genre ilişkilerini silme', { animeSeriesId });
  }
}

// Anime-Genre ilişkisi sayısı
export async function countAnimeGenres(
  where?: Prisma.AnimeGenreWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeGenre.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Genre ilişkisi sayma', { where });
  }
} 