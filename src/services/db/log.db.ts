import { Log, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction, SessionUser } from '@/types'

// Log kullanıcı seçimi
const logUserSelect = {
  id: true,
  username: true,
  email: true,
  roles: true,
}

// Yeni log kaydı oluştur
export async function createLog(
  data: Prisma.LogCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Log> {
  return client.log.create({ data })
}

// Log kaydını kullanıcı bilgisiyle oluştur
export async function createLogWithUser(
  data: Prisma.LogCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Log & { user: SessionUser | null }> {
  return client.log.create({
    data,
    include: {
      user: { select: logUserSelect },
    },
  })
}

// Log sayısını hesapla
export async function countLogs(
  where?: Prisma.LogWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.log.count({ where })
}

// Logları listele
export async function findLogs(
  where?: Prisma.LogWhereInput,
  orderBy?: Prisma.LogOrderByWithRelationInput,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<Log[]> {
  return client.log.findMany({
    where,
    orderBy,
    take,
    skip,
  })
}

// Logları kullanıcı bilgisiyle listele
export async function findLogsWithUser(
  where?: Prisma.LogWhereInput,
  orderBy?: Prisma.LogOrderByWithRelationInput,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<(Log & { user: SessionUser | null })[]> {
  return client.log.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      user: { select: logUserSelect },
    },
  })
}

