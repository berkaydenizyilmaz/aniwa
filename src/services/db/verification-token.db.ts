import { VerificationToken, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction } from '@/types'

// Yeni doğrulama token'ı oluştur
export async function createVerificationToken(
  data: Prisma.VerificationTokenCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  return client.verificationToken.create({ data })
}

// Token string ile bul
export async function findVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.findUnique({ where: { token } })
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

// Token varlığını kontrol et
export async function verificationTokenExists(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.verificationToken.count({ where: { token } })
  return count > 0
}