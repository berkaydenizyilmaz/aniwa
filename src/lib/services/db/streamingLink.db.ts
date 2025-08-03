// Streaming Link modeli için CRUD operasyonları

import { Prisma, StreamingLink } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Streaming Link oluşturma
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

// Streaming Link getirme (ID ile)
export async function findStreamingLinkByIdDB(
  id: string,
  include?: Prisma.StreamingLinkInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink | null> {
  try {
    return await client.streamingLink.findUnique({ 
      where: { id },
      include
    });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link ID ile bulma', { id });
  }
}

// Episode için streaming linkleri getirme
export async function findStreamingLinksByEpisodeIdDB(
  episodeId: string,
  orderBy?: Prisma.StreamingLinkOrderByWithRelationInput,
  include?: Prisma.StreamingLinkInclude,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink[]> {
  try {
    return await client.streamingLink.findMany({
      where: { episodeId },
      include: include || {
        platform: true,
      },
      orderBy: orderBy || { createdAt: 'asc' },
    });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link episode ID ile bulma', { episodeId });
  }
}

// Streaming Link güncelleme
export async function updateStreamingLinkDB(
  where: Prisma.StreamingLinkWhereUniqueInput,
  data: Prisma.StreamingLinkUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<StreamingLink> {
  try {
    return await client.streamingLink.update({
      where,
      data,
    });
  } catch (error) {
    handleDatabaseError(error, 'Streaming link güncelleme', { where, data });
  }
}

// Streaming Link silme
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

// Streaming Link sayısını getirme
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