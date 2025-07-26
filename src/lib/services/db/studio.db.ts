// Studio modeli için CRUD operasyonları

import { Prisma, Studio } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Studio CRUD operasyonları

// Yeni studio oluşturur
export async function createStudio(
    data: Prisma.StudioCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    try {
        return await client.studio.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Studio oluşturma', { data });
    }
}

// ID ile studio bulur
export async function findStudioById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    try {
        return await client.studio.findUnique({
            where: { id },
        });
    } catch (error) {
        handleDatabaseError(error, 'Studio ID ile bulma', { id });
    }
}

// Slug ile studio bulur
export async function findStudioBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    try {
        return await client.studio.findUnique({
            where: { slug },
        });
    } catch (error) {
        handleDatabaseError(error, 'Studio slug ile bulma', { slug });
    }
}

// Name ile studio bulur
export async function findStudioByName(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    try {
        return await client.studio.findUnique({
            where: { name },
        });
    } catch (error) {
        handleDatabaseError(error, 'Studio name ile bulma', { name });
    }
}

// Animasyon stüdyolarını bulur
export async function findAnimationStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    try {
        return await client.studio.findMany({
            where: { isAnimationStudio: true },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Animasyon stüdyolarını bulma');
    }
}

// Prodüksiyon şirketlerini bulur
export async function findProductionStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    try {
        return await client.studio.findMany({
            where: { isAnimationStudio: false },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Prodüksiyon stüdyolarını bulma');
    }
}

// Tüm stüdyoları listeler
export async function findAllStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    try {
        return await client.studio.findMany({
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm stüdyoları listeleme');
    }
}

// Studio bilgilerini günceller
export async function updateStudio(
    where: Prisma.StudioWhereUniqueInput,
    data: Prisma.StudioUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    try {
        return await client.studio.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Studio güncelleme', { where, data });
    }
}

// Studio'yu siler
export async function deleteStudio(
    where: Prisma.StudioWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    try {
        return await client.studio.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Studio silme', { where });
    }
}

// Studio sayısını döner
export async function countStudios(
    where?: Prisma.StudioWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.studio.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Studio sayma', { where });
    }
} 