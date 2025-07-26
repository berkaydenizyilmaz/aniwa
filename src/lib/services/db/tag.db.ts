// Tag modeli için CRUD operasyonları

import { Prisma, Tag, TagCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Tag CRUD operasyonları

// Yeni tag oluşturur
export async function createTagDB(
    data: Prisma.TagCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    try {
        return await client.tag.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag oluşturma', { data });
    }
}

// ID ile tag bulur
export async function findTagByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    try {
        return await client.tag.findUnique({
            where: { id },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag ID ile bulma', { id });
    }
}

// Slug ile tag bulur
export async function findTagBySlugDB(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    try {
        return await client.tag.findUnique({
            where: { slug },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag slug ile bulma', { slug });
    }
}

// Name ile tag bulur
export async function findTagByNameDB(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    try {
        return await client.tag.findUnique({
            where: { name },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag name ile bulma', { name });
    }
}

// Kategoriye göre tag'leri bulur
export async function findTagsByCategoryDB(
    category: TagCategory,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    try {
        return await client.tag.findMany({
            where: { category },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag\'leri kategoriye göre bulma', { category });
    }
}

// Yetişkin içerik tag'lerini bulur
export async function findAdultTagsDB(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    try {
        return await client.tag.findMany({
            where: { isAdult: true },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Yetişkin tag\'lerini bulma');
    }
}

// Spoiler tag'lerini bulur
export async function findSpoilerTagsDB(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    try {
        return await client.tag.findMany({
            where: { isSpoiler: true },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Spoiler tag\'lerini bulma');
    }
}

// Tüm tag'leri listeler
export async function findAllTagsDB(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    try {
        return await client.tag.findMany({
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm tag\'leri listeleme');
    }
}

// Tag bilgilerini günceller
export async function updateTagDB(
    where: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    try {
        return await client.tag.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Tag güncelleme', { where, data });
    }
}

// Tag'i siler
export async function deleteTagDB(
    where: Prisma.TagWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    try {
        return await client.tag.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Tag silme', { where });
    }
}

// Tag sayısını döner
export async function countTagsDB(
    where?: Prisma.TagWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.tag.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Tag sayma', { where });
    }
} 