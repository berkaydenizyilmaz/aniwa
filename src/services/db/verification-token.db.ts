import { VerificationToken, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction, ID } from '@/types'

// Yeni doğrulama token'ı oluştur
export async function createVerificationToken(
  data: Prisma.VerificationTokenCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  return client.verificationToken.create({ data })
}

// ID ile token bul
export async function findVerificationTokenById(
  id: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.findUnique({ where: { id } })
}

// Token string ile bul
export async function findVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.findUnique({ where: { token } })
}

// Email ve type ile token bul
export async function findVerificationTokenByEmailAndType(
  email: string,
  type: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.findFirst({
    where: { email, type }
  })
}

// Token güncelle
export async function updateVerificationToken(
  id: ID,
  data: Prisma.VerificationTokenUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  return client.verificationToken.update({
    where: { id },
    data,
  })
}

// Token sil
export async function deleteVerificationToken(
  id: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  return client.verificationToken.delete({ where: { id } })
}

// Token string ile sil
export async function deleteVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  try {
    return await client.verificationToken.delete({ where: { token } })
  } catch {
    return null
  }
}

// Email ile token'ları sil
export async function deleteVerificationTokensByEmail(
  email: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  return client.verificationToken.deleteMany({
    where: { email }
  })
}

// Email ve type ile token'ları sil
export async function deleteVerificationTokensByEmailAndType(
  email: string,
  type: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  return client.verificationToken.deleteMany({
    where: { email, type }
  })
}

// Token'ları listele
export async function findVerificationTokens(
  where?: Prisma.VerificationTokenWhereInput,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken[]> {
  return client.verificationToken.findMany({
    where,
    take,
    skip,
  })
}

// Token sayısını hesapla
export async function countVerificationTokens(
  where?: Prisma.VerificationTokenWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.verificationToken.count({ where })
}

// Token varlığını kontrol et
export async function verificationTokenExists(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.verificationToken.count({ where: { token } })
  return count > 0
}

// Süresi dolmuş token'ları sil
export async function deleteExpiredVerificationTokens(
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  return client.verificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
} 