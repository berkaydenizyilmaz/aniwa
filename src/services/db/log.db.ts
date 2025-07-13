import { Log, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction } from '@/types'

// Log kullanıcı seçimi tipi
type LogUserSelect = {
  id: string
  username: string
  email: string
  roles: string[]
}

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
): Promise<Log & { user: LogUserSelect | null }> {
  return client.log.create({
    data,
    include: {
      user: { select: logUserSelect },
    },
  })
}

// ID ile log bul
export async function findLogById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log | null> {
  return client.log.findUnique({ where: { id } })
}

// ID ile log'u kullanıcı bilgisiyle bul
export async function findLogByIdWithUser(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log & { user: LogUserSelect | null } | null> {
  return client.log.findUnique({
    where: { id },
    include: {
      user: { select: logUserSelect },
    },
  })
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
): Promise<(Log & { user: LogUserSelect | null })[]> {
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

// Log sayısını hesapla
export async function countLogs(
  where?: Prisma.LogWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.log.count({ where })
}

// Log güncelle
export async function updateLog(
  id: string,
  data: Prisma.LogUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Log> {
  return client.log.update({
    where: { id },
    data,
  })
}

// Log sil
export async function deleteLog(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Log> {
  return client.log.delete({ where: { id } })
}

// Belirli koşullardaki logları sil
export async function deleteLogs(
  where: Prisma.LogWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  return client.log.deleteMany({ where })
}

// Belirli tarihten eski logları sil
export async function deleteLogsBefore(
  date: Date,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  return client.log.deleteMany({
    where: {
      timestamp: {
        lt: date
      }
    }
  })
}

// Log varlığını kontrol et
export async function logExists(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.log.count({ where: { id } })
  return count > 0
} 