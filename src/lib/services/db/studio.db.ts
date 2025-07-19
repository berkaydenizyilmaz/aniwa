// Studio modeli için CRUD operasyonları

import { Prisma, Studio } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Studio CRUD operasyonları

// Yeni studio oluşturur
export async function createStudio(
    data: Prisma.StudioCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    return await client.studio.create({
        data,
    });
}

// ID ile studio bulur
export async function findStudioById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    return await client.studio.findUnique({
        where: { id },
    });
}

// Slug ile studio bulur
export async function findStudioBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    return await client.studio.findUnique({
        where: { slug },
    });
}

// Name ile studio bulur
export async function findStudioByName(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio | null> {
    return await client.studio.findUnique({
        where: { name },
    });
}

// Animasyon stüdyolarını bulur
export async function findAnimationStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    return await client.studio.findMany({
        where: { isAnimationStudio: true },
        orderBy: { name: 'asc' },
    });
}

// Prodüksiyon şirketlerini bulur
export async function findProductionStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    return await client.studio.findMany({
        where: { isAnimationStudio: false },
        orderBy: { name: 'asc' },
    });
}

// Tüm stüdyoları listeler
export async function findAllStudios(
    client: PrismaClientOrTransaction = prisma
): Promise<Studio[]> {
    return await client.studio.findMany({
        orderBy: { name: 'asc' },
    });
}

// Studio bilgilerini günceller
export async function updateStudio(
    where: Prisma.StudioWhereUniqueInput,
    data: Prisma.StudioUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    return await client.studio.update({
        where,
        data,
    });
}

// Studio'yu siler
export async function deleteStudio(
    where: Prisma.StudioWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Studio> {
    return await client.studio.delete({ where });
}

// Studio sayısını döner
export async function countStudios(
    where?: Prisma.StudioWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.studio.count({ where });
} 