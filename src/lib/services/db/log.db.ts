// Log DB servisi - Pure CRUD işlemleri
import { prisma } from '@/lib/prisma';
import { Prisma, Log } from '@prisma/client';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Log oluştur
export async function createLog(
  data: Prisma.LogCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Log> {
  return client.log.create({
    data
  });
}

// Log'u ID ile bul
export async function findLogById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log | null> {
  return client.log.findUnique({
    where: { id }
  });
}

// Log sil
export async function deleteLog(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log | null> {
  return client.log.delete({
    where: { id }
  });
} 