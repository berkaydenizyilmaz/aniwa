// Streaming modelleri için CRUD operasyonları

import { Prisma, StreamingPlatform, StreamingLink } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Streaming Platform CRUD İşlemleri

// Streaming platform oluşturma
export async function createStreamingPlatformDB(
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
export async function findStreamingPlatformByIdDB(
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
export async function findStreamingPlatformByNameDB(
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
export async function findAllStreamingPlatformsDB(
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
export async function updateStreamingPlatformDB(
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
export async function deleteStreamingPlatformDB(
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
export async function countStreamingPlatformsDB(
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
export async function createStreamingLinkDB(
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
export async function findStreamingLinkByIdDB(
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
export async function findStreamingLinkByUrlDB(
  url: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  try {
    return await client.streamingLink.findFirst({ where: { url } });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link URL ile bulma', { url });
  }
}

// Anime serisi ID'sine göre streaming link'leri getirme
export async function findStreamingLinksByAnimeSeriesIdDB(
  animeSeriesId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { animeSeriesId },
      include: {
        streamingPlatform: true,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi streaming link\'lerini bulma', { animeSeriesId });
  }
}

// Media part ID'sine göre streaming link'leri getirme
export async function findStreamingLinksByMediaPartIdDB(
  animeMediaPartId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { animeMediaPartId },
      include: {
        streamingPlatform: true,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Media part streaming link\'lerini bulma', { animeMediaPartId });
  }
}

// Episode ID'sine göre streaming link'leri getirme
export async function findStreamingLinksByEpisodeIdDB(
  episodeId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { episodeId },
      include: {
        streamingPlatform: true,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode streaming link\'lerini bulma', { episodeId });
  }
}

// Platform ID'sine göre streaming link'leri getirme
export async function findStreamingLinksByPlatformIdDB(
  platformId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { streamingPlatformId: platformId },
      include: {
        animeSeries: true,
        animeMediaPart: true,
        episode: true,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Platform streaming link\'lerini bulma', { platformId });
  }
}

// Tüm streaming link'leri getirme (filtrelemeli)
export async function findAllStreamingLinksDB(
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
        streamingPlatform: true,
        animeSeries: true,
        animeMediaPart: true,
        episode: true,
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm streaming link\'leri listeleme', { where, skip, take, orderBy });
  }
}

// Streaming link güncelleme
export async function updateStreamingLinkDB(
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
export async function deleteStreamingLinkDB(
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
export async function countStreamingLinksDB(
  where?: Prisma.StreamingLinkWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.streamingLink.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link sayma', { where });
  }
} 