import { UserFollow, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction, ID } from '@/types'

// Yeni takip ilişkisi oluştur
export async function createUserFollow(
  followData: Prisma.UserFollowCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
  return client.userFollow.create({ data: followData })
}

// Takip ilişkisini bul
export async function findUserFollow(
  followerId: ID,
  followingId: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<UserFollow | null> {
  return client.userFollow.findFirst({
    where: {
      followerId,
      followingId,
    },
  })
}

// Kullanıcının takip ettiği kişileri listele
export async function findUserFollowing(
  userId: ID,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
  return client.userFollow.findMany({
    where: { followerId: userId },
    take,
    skip,
    include: {
      following: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
          slug: true,
        },
      },
    },
  })
}

// Kullanıcıyı takip eden kişileri listele
export async function findUserFollowers(
  userId: ID,
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
  return client.userFollow.findMany({
    where: { followingId: userId },
    take,
    skip,
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
          slug: true,
        },
      },
    },
  })
}

// Takip ilişkisini sil
export async function deleteUserFollow(
  followerId: ID,
  followingId: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
  return client.userFollow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  })
}

// Kullanıcının takip edip etmediğini kontrol et
export async function checkIfUserFollows(
  followerId: ID,
  followingId: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.userFollow.count({
    where: {
      followerId,
      followingId,
    },
  })
  return count > 0
}

// Kullanıcının takip ettiği kişi sayısını say
export async function countUserFollowing(
  userId: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.userFollow.count({
    where: { followerId: userId },
  })
}

// Kullanıcıyı takip eden kişi sayısını say
export async function countUserFollowers(
  userId: ID,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.userFollow.count({
    where: { followingId: userId },
  })
} 