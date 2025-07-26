// User modeli için CRUD operasyonları

import { Prisma, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { UserWithSettings } from '@/lib/types/db/user';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// User CRUD operasyonları

// Yeni kullanıcı oluşturur
export async function createUser(
    data: Prisma.UserCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings> {
    try {
        return await client.user.create({
            data,
            include: {
                userSettings: true,
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı oluşturma', { data });
    }
}

// ID ile kullanıcı bulur
export async function findUserById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    try {
        return await client.user.findUnique({
            where: { id },
            include: {
                userSettings: true,
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ID ile bulma', { id });
    }
}

// E-posta ile kullanıcı bulur
export async function findUserByEmail(
    email: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    try {
        return await client.user.findUnique({
            where: { email },
            include: {
                userSettings: true,
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı email ile bulma', { email });
    }
}

// Kullanıcı adı ile kullanıcı bulur
export async function findUserByUsername(
    username: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    try {
        return await client.user.findUnique({
            where: { username },
            include: {
                userSettings: true,
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı username ile bulma', { username });
    }
}

// Slug ile kullanıcı bulur
export async function findUserBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings | null> {
    try {
        return await client.user.findUnique({
            where: { slug },
            include: {
                userSettings: true,
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı slug ile bulma', { slug });
    }
}

// Tüm kullanıcıları getirir (filtrelemeli)
export async function findAllUsers(
    where?: Prisma.UserWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<User[]> {
    try {
        return await client.user.findMany({
            where,
            skip,
            take,
            orderBy,
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm kullanıcıları listeleme', { where, skip, take, orderBy });
    }
}

// Kullanıcı bilgilerini günceller
export async function updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<User> {
    try {
        return await client.user.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı güncelleme', { where, data });
    }
}

// Kullanıcıyı siler
export async function deleteUser(
    where: Prisma.UserWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.user.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı silme', { where });
    }
}

// Kullanıcı sayısını döner
export async function countUsers(
    where?: Prisma.UserWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.user.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı sayma', { where });
    }
}

