// Streaming modelleri için CRUD operasyonları

import { Prisma, StreamingPlatform, StreamingLink } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// =============================================================================
// STREAMING PLATFORM CRUD İŞLEMLERİ
// =============================================================================

// Streaming platform oluşturma
export async function createStreamingPlatform(
  data: Prisma.StreamingPlatformCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  return await client.streamingPlatform.create({ data });
}

// Streaming platform getirme (ID ile)
export async function findStreamingPlatformById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform | null> {
  return await client.streamingPlatform.findUnique({ where: { id } });
}

// Tüm streaming platformları getirme (filtrelemeli)
export async function findAllStreamingPlatforms(
  where?: Prisma.StreamingPlatformWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.StreamingPlatformOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform[]> {
  return await client.streamingPlatform.findMany({
    where,
    skip,
    take,
    orderBy,
  });
}

// Streaming platform güncelleme
export async function updateStreamingPlatform(
  where: Prisma.StreamingPlatformWhereUniqueInput,
  data: Prisma.StreamingPlatformUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  return await client.streamingPlatform.update({ where, data });
}

// Streaming platform silme
export async function deleteStreamingPlatform(
  where: Prisma.StreamingPlatformWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingPlatform> {
  return await client.streamingPlatform.delete({ where });
}

// Streaming platform sayısı
export async function countStreamingPlatforms(
  where?: Prisma.StreamingPlatformWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return await client.streamingPlatform.count({ where });
}

// =============================================================================
// STREAMING LINK CRUD İŞLEMLERİ
// =============================================================================

// Streaming link oluşturma
export async function createStreamingLink(
  data: Prisma.StreamingLinkCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  return await client.streamingLink.create({ data });
}

// Streaming link getirme (ID ile)
export async function findStreamingLinkById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  return await client.streamingLink.findUnique({ where: { id } });
}

// Streaming link getirme (URL ile)
export async function findStreamingLinkByUrl(
  url: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  return await client.streamingLink.findUnique({ where: { url } });
}

// Anime serisi için streaming linkleri getirme
export async function findStreamingLinksByAnimeSeriesId(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  return await client.streamingLink.findMany({
    where: { animeSeriesId },
    include: { platform: true }
  });
}

// Anime medya parçası için streaming linkleri getirme
export async function findStreamingLinksByMediaPartId(
  animeMediaPartId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  return await client.streamingLink.findMany({
    where: { animeMediaPartId },
    include: { platform: true }
  });
}

// Bölüm için streaming linkleri getirme
export async function findStreamingLinksByEpisodeId(
  episodeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  return await client.streamingLink.findMany({
    where: { episodeId },
    include: { platform: true }
  });
}

// Platform için streaming linkleri getirme
export async function findStreamingLinksByPlatformId(
  platformId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  return await client.streamingLink.findMany({
    where: { platformId },
    include: { 
      animeSeries: { select: { id: true, title: true } },
      animeMediaPart: { select: { id: true, title: true } },
      episode: { select: { id: true, title: true, episodeNumber: true } }
    }
  });
}

// Tüm streaming linkleri getirme (filtrelemeli)
export async function findAllStreamingLinks(
  where?: Prisma.StreamingLinkWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.StreamingLinkOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
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
}

// Streaming link güncelleme
export async function updateStreamingLink(
  where: Prisma.StreamingLinkWhereUniqueInput,
  data: Prisma.StreamingLinkUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  return await client.streamingLink.update({ where, data });
}

// Streaming link silme
export async function deleteStreamingLink(
  where: Prisma.StreamingLinkWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  return await client.streamingLink.delete({ where });
}

// Streaming link sayısı
export async function countStreamingLinks(
  where?: Prisma.StreamingLinkWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return await client.streamingLink.count({ where });
} 