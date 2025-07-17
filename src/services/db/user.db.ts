import { User, UserProfileSettings, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction } from '@/types'

// Yeni kullanıcı oluştur
export async function createUser(
  userData: Prisma.UserCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<User> {
  return client.user.create({ data: userData })
}

// ID ile kullanıcı bul
export async function findUserById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User | null> {
  return client.user.findUnique({ where: { id } })
}

// Email ile kullanıcı bul
export async function findUserByEmail(
  email: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User | null> {
  return client.user.findUnique({ where: { email } })
}

// Username ile kullanıcı bul
export async function findUserByUsername(
  username: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User | null> {
  return client.user.findUnique({ where: { username } })
}

// Kullanıcı güncelle
export async function updateUser(
  id: string,
  userData: Prisma.UserUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<User> {
  return client.user.update({
    where: { id },
    data: userData,
  })
}

// Kullanıcı sil
export async function deleteUser(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User> {
  return client.user.delete({ where: { id } })
}

// Kullanıcıları listele
export async function findUsers(
  where?: Prisma.UserWhereInput,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<User[]> {
  return client.user.findMany({
    where,
    take,
    skip,
  })
}

// Kullanıcı sayısını hesapla
export async function countUsers(
  where?: Prisma.UserWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.user.count({ where })
}

// Kullanıcı varlığını kontrol et
export async function userExists(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.user.count({ where: { id } })
  return count > 0
}

// Kullanıcıyı ayarları ile birlikte getir
export async function findUserWithSettings(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User & { userSettings: UserProfileSettings | null } | null> {
  return client.user.findUnique({
    where: { id },
    include: { userSettings: true }
  })
}

// Username ile kullanıcıyı ayarları ile birlikte getir
export async function findUserByUsernameWithSettings(
  username: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User & { userSettings: UserProfileSettings | null } | null> {
  return client.user.findUnique({
    where: { username },
    include: { userSettings: true }
  })
} 