// UserFollow modeli için CRUD operasyonları

import { Prisma, UserFollow } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// UserFollow CRUD operasyonları

// Yeni takip ilişkisi oluşturur
export async function createUserFollowDB(
    data: Prisma.UserFollowCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
    try {
        return await client.userFollow.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Takip ilişkisi oluşturma', { data });
    }
}

// ID ile takip ilişkisi bulur
export async function findUserFollowByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow | null> {
    try {
        return await client.userFollow.findUnique({
            where: { id },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                        bio: true,
                    },
                },
                following: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                        bio: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Takip ilişkisi ID ile bulma', { id });
    }
}

// Kullanıcı ve takip edilen ile takip ilişkisi bulur
export async function findUserFollowByFollowerAndFollowingDB(
    followerId: string,
    followingId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow | null> {
    try {
        return await client.userFollow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                following: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ve takip edilen ile takip ilişkisi bulma', { followerId, followingId });
    }
}

// Kullanıcının takipçilerini listeler
export async function findFollowersByUserIdDB(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
    try {
        return await client.userFollow.findMany({
            where: { followingId: userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                        bio: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının takipçilerini bulma', { userId, skip, take });
    }
}

// Kullanıcının takip ettiklerini listeler
export async function findFollowingByUserIdDB(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
    try {
        return await client.userFollow.findMany({
            where: { followerId: userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                        bio: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının takip ettiklerini bulma', { userId, skip, take });
    }
}

// Tüm takip ilişkilerini listeler (filtrelemeli)
export async function findAllUserFollowsDB(
    where?: Prisma.UserFollowWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserFollowOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
    try {
        return await client.userFollow.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                following: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm takip ilişkilerini listeleme', { where, skip, take, orderBy });
    }
}

// Takip ilişkisini siler
export async function deleteUserFollowDB(
    where: Prisma.UserFollowWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
    try {
        return await client.userFollow.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Takip ilişkisi silme', { where });
    }
}

// Takipçi sayısını döner
export async function countFollowersDB(
    where?: Prisma.UserFollowWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userFollow.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Takipçi sayma', { where });
    }
}

// Takip edilen sayısını döner
export async function countFollowingDB(
    where?: Prisma.UserFollowWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.userFollow.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Takip edilen sayma', { where });
    }
} 