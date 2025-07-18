// User modeli için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';
import {
    BusinessError,
    NotFoundError,
    ConflictError
} from '../../errors';
import { UserWithSettings } from '../../types/db/user';
import { PrismaClientOrTransaction } from '../../types/db';

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
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictError('Kullanıcı adı veya e-posta zaten kullanımda', { 
                    field: error.meta?.target 
                });
            }
        }
        throw new BusinessError('Kullanıcı oluşturulamadı');
    }
}

// ID ile kullanıcı bulur
export async function findUserById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings> {
    const user = await client.user.findUnique({
        where: { id },
        include: {
            userSettings: true,
        },
    });

    if (!user) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    return user;
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

// Kullanıcı bilgilerini günceller
export async function updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<UserWithSettings> {
    try {
        return await client.user.update({
            where,
            data,
            include: {
                userSettings: true,
            },
        });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictError('Kullanıcı adı veya e-posta zaten kullanımda', {
                    field: error.meta?.target
                });
            }
            if (error.code === 'P2025') {
                throw new NotFoundError('Kullanıcı bulunamadı');
            }
        }
        throw new BusinessError('Kullanıcı güncellenemedi');
    }
}

// Kullanıcıyı siler
export async function deleteUser(
    where: Prisma.UserWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.user.delete({ where });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Kullanıcı bulunamadı');
            }
        }
        throw new BusinessError('Kullanıcı silinemedi');
    }
}

// Kullanıcı sayısını döner
export async function countUsers(
    where?: Prisma.UserWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.user.count({ where });
}