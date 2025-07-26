// VerificationToken DB servisi - Pure CRUD işlemleri
import { prisma } from '@/lib/prisma';
import { Prisma, VerificationToken } from '@prisma/client';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Token oluştur
export async function createVerificationToken(
  data: Prisma.VerificationTokenCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken> {
  try {
    return client.verificationToken.create({
      data
    });
  } catch (error) {
    handleDatabaseError(error, 'Verification token oluşturma', { data });
  }
}

// Token'ı token string ile bul
export async function findVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  try {
    return client.verificationToken.findUnique({
      where: { token }
    });
  } catch (error) {
    handleDatabaseError(error, 'Verification token bulma', { token });
  }
}

// Token string ile sil
export async function deleteVerificationTokenByToken(
  token: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  try {
    return client.verificationToken.delete({
      where: { token }
    });
  } catch (error) {
    handleDatabaseError(error, 'Verification token silme', { token });
  }
}

// Email ve tip ile token sil
export async function deleteVerificationTokenByEmailAndType(
  email: string, 
  type: string,
  client: PrismaClientOrTransaction = prisma
): Promise<VerificationToken | null> {
  try {
    const token = await client.verificationToken.findFirst({
      where: { email, type }
    });
    
    if (!token) return null;
    
    return client.verificationToken.delete({
      where: { id: token.id }
    });
  } catch (error) {
    handleDatabaseError(error, 'Email ve tip ile verification token silme', { email, type });
  }
}