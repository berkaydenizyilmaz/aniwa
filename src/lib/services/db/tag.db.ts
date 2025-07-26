// Tag modeli için CRUD operasyonları

import { Prisma, Tag, TagCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Tag CRUD operasyonları

// Yeni tag oluşturur
export async function createTag(
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
export async function findTagById(
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
export async function findTagBySlug(
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
export async function findTagByName(
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
export async function findTagsByCategory(
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
export async function findAdultTags(
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
export async function findSpoilerTags(
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
export async function findAllTags(
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
export async function updateTag(
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
export async function deleteTag(
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
export async function countTags(
    where?: Prisma.TagWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.tag.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Tag sayma', { where });
    }
} 