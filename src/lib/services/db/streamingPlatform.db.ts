// StreamingPlatform modeli için CRUD operasyonları

import { Prisma, StreamingPlatform } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

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