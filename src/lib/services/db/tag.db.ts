// Tag modeli için CRUD operasyonları

import { Prisma, Tag, TagCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Tag CRUD operasyonları

// Yeni tag oluşturur
export async function createTag(
    data: Prisma.TagCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    return await client.tag.create({
        data,
    });
}

// ID ile tag bulur
export async function findTagById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    return await client.tag.findUnique({
        where: { id },
    });
}

// Slug ile tag bulur
export async function findTagBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    return await client.tag.findUnique({
        where: { slug },
    });
}

// Name ile tag bulur
export async function findTagByName(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag | null> {
    return await client.tag.findUnique({
        where: { name },
    });
}

// Kategoriye göre tag'leri bulur
export async function findTagsByCategory(
    category: TagCategory,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    return await client.tag.findMany({
        where: { category },
        orderBy: { name: 'asc' },
    });
}

// Yetişkin içerik tag'lerini bulur
export async function findAdultTags(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    return await client.tag.findMany({
        where: { isAdult: true },
        orderBy: { name: 'asc' },
    });
}

// Spoiler tag'lerini bulur
export async function findSpoilerTags(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    return await client.tag.findMany({
        where: { isSpoiler: true },
        orderBy: { name: 'asc' },
    });
}

// Tüm tag'leri listeler
export async function findAllTags(
    client: PrismaClientOrTransaction = prisma
): Promise<Tag[]> {
    return await client.tag.findMany({
        orderBy: { name: 'asc' },
    });
}

// Tag bilgilerini günceller
export async function updateTag(
    where: Prisma.TagWhereUniqueInput,
    data: Prisma.TagUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    return await client.tag.update({
        where,
        data,
    });
}

// Tag'i siler
export async function deleteTag(
    where: Prisma.TagWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Tag> {
    return await client.tag.delete({ where });
}

// Tag sayısını döner
export async function countTags(
    where?: Prisma.TagWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.tag.count({ where });
} 