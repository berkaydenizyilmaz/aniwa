// VerificationToken DB servisi - Pure CRUD işlemleri
import { prisma } from '@/lib/prisma';
import { Prisma, VerificationToken } from '@prisma/client';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Token oluştur
export async function createVerificationToken(
  data: Prisma.VerificationTokenCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  return client.verificationToken.create({
    data
  });
}

// Token'ı token string ile bul
export async function findVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.findUnique({
    where: { token }
  });
}

// Token string ile sil
export async function deleteVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  return client.verificationToken.delete({
    where: { token }
  });
}

// Email ve tip ile token sil
export async function deleteVerificationTokenByEmailAndType(
  email: string, 
  type: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  const token = await client.verificationToken.findFirst({
    where: { email, type }
  });
  
  if (!token) return null;
  
  return client.verificationToken.delete({
    where: { id: token.id }
  });
}