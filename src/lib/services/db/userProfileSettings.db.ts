// UserProfileSettings modeli için CRUD operasyonları

import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';
import {
    BusinessError,
    NotFoundError,
    ConflictError
} from '../../errors';
import { PrismaClientOrTransaction } from '../../types/db';

// Kullanıcı ayarları oluşturur
export async function createUserSettings(
    data: Prisma.UserProfileSettingsCreateInput,
    client: PrismaClientOrTransaction = prisma
) {
    try {
        return await client.userProfileSettings.create({
            data,
        });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictError('Kullanıcı ayarları zaten mevcut', {
                    field: error.meta?.target
                });
            }
        }
        throw new BusinessError('Kullanıcı ayarları oluşturulamadı');
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
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Kullanıcı ayarları bulunamadı');
            }
        }
        throw new BusinessError('Kullanıcı ayarları güncellenemedi');
    }
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