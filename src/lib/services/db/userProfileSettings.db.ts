// UserProfileSettings modeli için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Kullanıcı ayarları oluşturur
export async function createUserSettings(
    data: Prisma.UserProfileSettingsCreateInput,
    client: PrismaClientOrTransaction = prisma
) {
    return await client.userProfileSettings.create({
        data,
    });
}

// Kullanıcı ayarlarını günceller
export async function updateUserSettings(
    where: Prisma.UserProfileSettingsWhereUniqueInput,
    data: Prisma.UserProfileSettingsUpdateInput,
    client: PrismaClientOrTransaction = prisma
) {
    return await client.userProfileSettings.update({
        where,
        data,
    });
}

// Kullanıcı ayarlarını bulur
export async function findUserSettings(
    userId: string,
    client: PrismaClientOrTransaction = prisma
) {
    return await client.userProfileSettings.findUnique({
        where: { userId },
    });
}