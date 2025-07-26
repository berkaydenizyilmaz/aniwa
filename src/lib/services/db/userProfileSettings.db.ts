// UserProfileSettings modeli için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Kullanıcı ayarları oluşturur
export async function createUserSettings(
    data: Prisma.UserProfileSettingsCreateInput,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.userProfileSettings.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ayarları oluşturma', { data });
    }
}

// Kullanıcı ayarlarını günceller
export async function updateUserSettings(
    where: Prisma.UserProfileSettingsWhereUniqueInput,
    data: Prisma.UserProfileSettingsUpdateInput,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.userProfileSettings.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ayarları güncelleme', { where, data });
    }
}

// Kullanıcı ayarlarını bulur
export async function findUserSettings(
    userId: string,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.userProfileSettings.findUnique({
            where: { userId },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcı ayarları bulma', { userId });
    }
}