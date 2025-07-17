import { UserProfileSettings, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction } from '@/types'

// Yeni kullanıcı profil ayarları oluştur
export async function createUserSettings(
  data: Prisma.UserProfileSettingsCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<UserProfileSettings> {
  return client.userProfileSettings.create({ data })
}

// Kullanıcı ID'sine göre ayarları bul
export async function findUserSettingsByUserId(
  userId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<UserProfileSettings | null> {
  return client.userProfileSettings.findUnique({ where: { userId } })
}

// Kullanıcı ayarlarını güncelle
export async function updateUserSettings(
  userId: string,
  data: Prisma.UserProfileSettingsUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<UserProfileSettings> {
  return client.userProfileSettings.update({
    where: { userId },
    data,
  })
}

// Kullanıcı ayarlarını sil
export async function deleteUserSettings(
  userId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<UserProfileSettings> {
  return client.userProfileSettings.delete({ where: { userId } })
}

// Kullanıcı ayarlarının varlığını kontrol et
export async function userSettingsExists(
  userId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.userProfileSettings.count({ where: { userId } })
  return count > 0
}

// Tüm kullanıcı ayarlarını listele
export async function findAllUserSettings(
  where?: Prisma.UserProfileSettingsWhereInput,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<UserProfileSettings[]> {
  return client.userProfileSettings.findMany({
    where,
    take,
    skip,
  })
}