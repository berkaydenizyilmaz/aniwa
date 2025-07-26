// Streaming modelleri için CRUD operasyonları

import { Prisma, StreamingPlatform, StreamingLink } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Streaming Platform CRUD İşlemleri

// Streaming platform oluşturma
export async function createStreamingPlatform(
  data: Prisma.StreamingPlatformCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  try {
    return await client.streamingPlatform.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform oluşturma', { data });
  }
}

// Streaming platform getirme (ID ile)
export async function findStreamingPlatformById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform | null> {
  try {
    return await client.streamingPlatform.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform ID ile bulma', { id });
  }
}

// Streaming platform getirme (name ile)
export async function findStreamingPlatformByName(
  name: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform | null> {
  try {
    return await client.streamingPlatform.findFirst({ where: { name } });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform name ile bulma', { name });
  }
}

// Tüm streaming platformları getirme (filtrelemeli)
export async function findAllStreamingPlatforms(
  where?: Prisma.StreamingPlatformWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.StreamingPlatformOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform[]> {
  try {
    return await client.streamingPlatform.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm streaming platformları listeleme', { where, skip, take, orderBy });
  }
}

// Streaming platform güncelleme
export async function updateStreamingPlatform(
  where: Prisma.StreamingPlatformWhereUniqueInput,
  data: Prisma.StreamingPlatformUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  try {
    return await client.streamingPlatform.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform güncelleme', { where, data });
  }
}

// Streaming platform silme
export async function deleteStreamingPlatform(
  where: Prisma.StreamingPlatformWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  try {
    return await client.streamingPlatform.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform silme', { where });
  }
}

// Streaming platform sayısı
export async function countStreamingPlatforms(
  where?: Prisma.StreamingPlatformWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.streamingPlatform.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Streaming platform sayma', { where });
  }
}

// Streaming Link CRUD İşlemleri

// Streaming link oluşturma
export async function createStreamingLink(
  data: Prisma.StreamingLinkCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  try {
    return await client.streamingLink.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link oluşturma', { data });
  }
}

// Streaming link getirme (ID ile)
export async function findStreamingLinkById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  try {
    return await client.streamingLink.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link ID ile bulma', { id });
  }
}

// Streaming link getirme (URL ile)
export async function findStreamingLinkByUrl(
  url: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  try {
    return await client.streamingLink.findUnique({ where: { url } });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link URL ile bulma', { url });
  }
}

// Anime serisi için streaming linkleri getirme
export async function findStreamingLinksByAnimeSeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { animeSeriesId },
      include: { platform: true }
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için streaming linkleri bulma', { animeSeriesId });
  }
}

// Anime medya parçası için streaming linkleri getirme
export async function findStreamingLinksByMediaPartId(
  animeMediaPartId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { animeMediaPartId },
      include: { platform: true }
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası için streaming linkleri bulma', { animeMediaPartId });
  }
}

// Bölüm için streaming linkleri getirme
export async function findStreamingLinksByEpisodeId(
  episodeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { episodeId },
      include: { platform: true }
    });
  } catch (error) {
    handleDatabaseError(error, 'Bölüm için streaming linkleri bulma', { episodeId });
  }
}

// Platform için streaming linkleri getirme
export async function findStreamingLinksByPlatformId(
  platformId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { platformId },
      include: { 
        animeSeries: { select: { id: true, title: true } },
        animeMediaPart: { select: { id: true, title: true } },
        episode: { select: { id: true, title: true, episodeNumber: true } }
      }
    });
  } catch (error) {
    handleDatabaseError(error, 'Platform için streaming linkleri bulma', { platformId });
  }
}

// Tüm streaming linkleri getirme (filtrelemeli)
export async function findAllStreamingLinks(
  where?: Prisma.StreamingLinkWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.StreamingLinkOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { 
        platform: true,
        animeSeries: { select: { id: true, title: true } },
        animeMediaPart: { select: { id: true, title: true } },
        episode: { select: { id: true, title: true, episodeNumber: true } }
      }
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm streaming linkleri listeleme', { where, skip, take, orderBy });
  }
}

// Streaming link güncelleme
export async function updateStreamingLink(
  where: Prisma.StreamingLinkWhereUniqueInput,
  data: Prisma.StreamingLinkUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  try {
    return await client.streamingLink.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link güncelleme', { where, data });
  }
}

// Streaming link silme
export async function deleteStreamingLink(
  where: Prisma.StreamingLinkWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  try {
    return await client.streamingLink.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link silme', { where });
  }
}

// Streaming link sayısı
export async function countStreamingLinks(
  where?: Prisma.StreamingLinkWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.streamingLink.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link sayma', { where });
  }
} 