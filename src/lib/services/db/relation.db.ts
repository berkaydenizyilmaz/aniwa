// Anime Relation modeli için CRUD operasyonları

import { Prisma, AnimeRelation } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime ilişkisi oluşturma
export async function createAnimeRelation(
  data: Prisma.AnimeRelationCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation> {
  try {
    return await client.animeRelation.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Anime ilişkisi oluşturma', { data });
  }
}

// Anime ilişkisi getirme (ID ile)
export async function findAnimeRelationById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation | null> {
  try {
    return await client.animeRelation.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Anime ilişkisi ID ile bulma', { id });
  }
}

// Anime'nin kaynak ilişkilerini getirme
export async function findAnimeSourceRelations(
  sourceAnimeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation[]> {
  try {
    return await client.animeRelation.findMany({
      where: { sourceAnimeId },
      include: {
        targetAnime: { select: { id: true, title: true, coverImage: true, type: true, status: true } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime kaynak ilişkilerini bulma', { sourceAnimeId });
  }
}

// Anime'nin hedef ilişkilerini getirme
export async function findAnimeTargetRelations(
  targetAnimeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation[]> {
  try {
    return await client.animeRelation.findMany({
      where: { targetAnimeId },
      include: {
        sourceAnime: { select: { id: true, title: true, coverImage: true, type: true, status: true } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime hedef ilişkilerini bulma', { targetAnimeId });
  }
}

// Anime'nin tüm ilişkilerini getirme
export async function findAnimeAllRelations(
  animeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<{
  sourceRelations: AnimeRelation[];
  targetRelations: AnimeRelation[];
}> {
  try {
    const [sourceRelations, targetRelations] = await Promise.all([
      findAnimeSourceRelations(animeId, client),
      findAnimeTargetRelations(animeId, client),
    ]);

    return { sourceRelations, targetRelations };
  } catch (error) {
    handleDatabaseError(error, 'Anime tüm ilişkilerini bulma', { animeId });
  }
}

// Tüm anime ilişkilerini getirme (filtrelemeli)
export async function findAllAnimeRelations(
  where?: Prisma.AnimeRelationWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeRelationOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation[]> {
  try {
    return await client.animeRelation.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        sourceAnime: { select: { id: true, title: true, coverImage: true, type: true, status: true } },
        targetAnime: { select: { id: true, title: true, coverImage: true, type: true, status: true } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime ilişkilerini listeleme', { where, skip, take, orderBy });
  }
}

// Anime ilişkisi güncelleme
export async function updateAnimeRelation(
  where: Prisma.AnimeRelationWhereUniqueInput,
  data: Prisma.AnimeRelationUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation> {
  try {
    return await client.animeRelation.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Anime ilişkisi güncelleme', { where, data });
  }
}

// Anime ilişkisi silme
export async function deleteAnimeRelation(
  where: Prisma.AnimeRelationWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeRelation> {
  try {
    return await client.animeRelation.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime ilişkisi silme', { where });
  }
}

// Anime ilişkisi sayısı
export async function countAnimeRelations(
  where?: Prisma.AnimeRelationWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeRelation.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime ilişkisi sayma', { where });
  }
} 