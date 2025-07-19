// User modeli için CRUD operasyonları

import { Prisma, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { UserWithSettings } from '@/lib/types/db/user';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// User CRUD operasyonları

// Yeni kullanıcı oluşturur
export async function createUser(
    data: Prisma.UserCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings> {
        return await client.user.create({
            data,
            include: {
                userSettings: true,
            },
        });
}

// ID ile kullanıcı bulur
export async function findUserById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    return await client.user.findUnique({
        where: { id },
        include: {
            userSettings: true,
        },
    });
}

// E-posta ile kullanıcı bulur
export async function findUserByEmail(
    email: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    return await client.user.findUnique({
        where: { email },
        include: {
            userSettings: true,
        },
    });
}

// Kullanıcı adı ile kullanıcı bulur
export async function findUserByUsername(
    username: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    return await client.user.findUnique({
        where: { username },
        include: {
            userSettings: true,
        },
    });
}

// Slug ile kullanıcı bulur
export async function findUserBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    return await client.user.findUnique({
        where: { slug },
        include: {
            userSettings: true,
        },
    });
}

// Tüm kullanıcıları getirir (filtrelemeli)
export async function findAllUsers(
    where?: Prisma.UserWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<User[]> {
    return await client.user.findMany({
        where,
        skip,
        take,
        orderBy,
    });
}

// Kullanıcının son giriş zamanını günceller
export async function updateUserLastLogin(
    userId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<void> {
    await client.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() }
    });
}

// Kullanıcı bilgilerini günceller
export async function updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<User> {
        return await client.user.update({
            where,
            data,
                });
            }

// Kullanıcıyı siler
export async function deleteUser(
    where: Prisma.UserWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
) {
        return await client.user.delete({ where });
}

// Kullanıcı sayısını döner
export async function countUsers(
    where?: Prisma.UserWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.user.count({ where });
}

