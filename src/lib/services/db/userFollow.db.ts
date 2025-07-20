// UserFollow modeli için CRUD operasyonları

import { Prisma, UserFollow } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// UserFollow CRUD operasyonları

// Yeni takip ilişkisi oluşturur
export async function createUserFollow(
    data: Prisma.UserFollowCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
    return await client.userFollow.create({
        data,
    });
}

// ID ile takip ilişkisi bulur
export async function findUserFollowById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow | null> {
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
}

// Kullanıcı ve takip edilen ile takip ilişkisi bulur
export async function findUserFollowByFollowerAndFollowing(
    followerId: string,
    followingId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow | null> {
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
}

// Kullanıcının takipçilerini listeler
export async function findFollowersByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
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
}

// Kullanıcının takip ettiklerini listeler
export async function findFollowingByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
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
}

// Tüm takip ilişkilerini listeler (filtrelemeli)
export async function findAllUserFollows(
    where?: Prisma.UserFollowWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserFollowOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow[]> {
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
}

// Takip ilişkisini siler
export async function deleteUserFollow(
    where: Prisma.UserFollowWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserFollow> {
    return await client.userFollow.delete({ where });
}

// Takipçi sayısını döner
export async function countFollowers(
    where?: Prisma.UserFollowWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.userFollow.count({ where });
}

// Takip edilen sayısını döner
export async function countFollowing(
    where?: Prisma.UserFollowWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.userFollow.count({ where });
} 