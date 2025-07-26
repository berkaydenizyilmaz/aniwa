// Log DB servisi - Pure CRUD işlemleri
import { prisma } from '@/lib/prisma';
import { Prisma, Log } from '@prisma/client';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Log oluştur
export async function createLog(
  data: Prisma.LogCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Log> {
  try {
    return client.log.create({
      data
    });
  } catch (error) {
    handleDatabaseError(error, 'Log oluşturma', { data });
  }
}

// Log'u ID ile bul
export async function findLogById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log | null> {
  try {
    return client.log.findUnique({
      where: { id }
    });
  } catch (error) {
    handleDatabaseError(error, 'Log ID ile bulma', { id });
  }
}

// Log sil
export async function deleteLog(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log | null> {
  try {
    return client.log.delete({
      where: { id }
    });
  } catch (error) {
    handleDatabaseError(error, 'Log silme', { id });
  }
} 