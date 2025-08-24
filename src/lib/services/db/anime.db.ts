// Anime Series modeli için CRUD operasyonları

import { Prisma, AnimeSeries } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Son AniwaPublicId'yi getir
export async function getLastAniwaPublicIdDB(
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    const lastAnime = await client.animeSeries.findFirst({
      orderBy: { aniwaPublicId: 'desc' },
      select: { aniwaPublicId: true }
    });
    
    return lastAnime?.aniwaPublicId || 0;
  } catch (error) {
    handleDatabaseError(error, 'Son AniwaPublicId getirme', {});
  }
}

// Yeni AniwaPublicId oluştur
export async function generateNextAniwaPublicIdDB(
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    const lastId = await getLastAniwaPublicIdDB(client);
    return lastId + 1;
  } catch (error) {
    handleDatabaseError(error, 'Yeni AniwaPublicId oluşturma', {});
  }
}

// Anime serisi oluşturma
export async function createAnimeSeriesDB(
  data: Omit<Prisma.AnimeSeriesCreateInput, 'aniwaPublicId'>,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    // Yeni AniwaPublicId oluştur
    const nextId = await generateNextAniwaPublicIdDB(client);
    
    return await client.animeSeries.create({ 
      data: {
        ...data,
        aniwaPublicId: nextId
      }
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi oluşturma', { data });
  }
}

// Anime serisi getirme (ID ile)
export async function findAnimeSeriesByIdDB(
  id: string,
  include?: Prisma.AnimeSeriesInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ 
      where: { id },
      include
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi ID ile bulma', { id });
  }
}

// Anime serisi getirme (Aniwa Public ID ile)
export async function findAnimeSeriesByPublicIdDB(
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
export async function findAllAnimeSeriesDB(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  select?: Prisma.AnimeSeriesSelect,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries[]> {
  try {
    return await client.animeSeries.findMany({
      where,
      skip,
      take,
      orderBy,
      select,
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime serilerini listeleme', { where, skip, take, orderBy });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesDB(
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
export async function deleteAnimeSeriesDB(
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
export async function countAnimeSeriesDB(
  where?: Prisma.AnimeSeriesWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeSeries.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi sayma', { where });
  }
}

// Anime listesi getirme (filtreleme, sıralama, sayfalama ile)
export async function getAnimeListWithFiltersDB(
  where: Prisma.AnimeSeriesWhereInput,
  skip: number,
  take: number,
  orderBy: Prisma.AnimeSeriesOrderByWithRelationInput,
  include: Prisma.AnimeSeriesInclude,
  client: PrismaClientOrTransaction = prisma
) {
  try {
    const [animes, total] = await Promise.all([
      client.animeSeries.findMany({
        where,
        skip,
        take,
        orderBy,
        include
      }),
      client.animeSeries.count({ where })
    ]);

    return { animes, total };
  } catch (error) {
    handleDatabaseError(error, 'Anime listesi filtreleme', { where, skip, take, orderBy });
  }
}

 