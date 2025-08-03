// Episode modeli için CRUD operasyonları

import { Prisma, Episode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Episode oluşturma
export async function createEpisodeDB(
  data: Prisma.EpisodeCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Episode oluşturma', { data });
  }
}

// Episode getirme (ID ile)
export async function findEpisodeByIdDB(
  id: string,
  include?: Prisma.EpisodeInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  try {
    return await client.episode.findUnique({ 
      where: { id },
      include
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode ID ile bulma', { id });
  }
}

// Episode getirme (medya parçası ve bölüm numarası ile)
export async function findEpisodeByNumberDB(
  mediaPartId: string,
  episodeNumber: number,
  include?: Prisma.EpisodeInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  try {
    return await client.episode.findUnique({
      where: {
        mediaPartId_episodeNumber: {
          mediaPartId,
          episodeNumber,
        },
      },
      include,
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode numara ile bulma', { mediaPartId, episodeNumber });
  }
}

// Medya parçası için bölümleri getirme
export async function findEpisodesByMediaPartIdDB(
  mediaPartId: string,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  include?: Prisma.EpisodeInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  try {
    return await client.episode.findMany({
      where: { mediaPartId },
      orderBy: orderBy || { episodeNumber: 'asc' },
      include,
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode medya parçası ID ile bulma', { mediaPartId, orderBy });
  }
}

// Tüm episode'ları listeleme
export async function findAllEpisodesDB(
  where?: Prisma.EpisodeWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  include?: Prisma.EpisodeInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  try {
    return await client.episode.findMany({
      where,
      skip,
      take,
      orderBy,
      include,
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm episode\'ları listeleme', { where, skip, take, orderBy });
  }
}

// Episode güncelleme
export async function updateEpisodeDB(
  where: Prisma.EpisodeWhereUniqueInput,
  data: Prisma.EpisodeUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Episode güncelleme', { where, data });
  }
}

// Episode silme
export async function deleteEpisodeDB(
  where: Prisma.EpisodeWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Episode silme', { where });
  }
}

// Episode sayısı
export async function countEpisodesDB(
  where?: Prisma.EpisodeWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.episode.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Episode sayma', { where });
  }
} 