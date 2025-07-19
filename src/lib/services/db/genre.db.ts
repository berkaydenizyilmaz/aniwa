// Genre modeli için CRUD operasyonları

import { Prisma, Genre } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Genre CRUD operasyonları

// Yeni genre oluşturur
export async function createGenre(
    data: Prisma.GenreCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    return await client.genre.create({
        data,
    });
}

// ID ile genre bulur
export async function findGenreById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    return await client.genre.findUnique({
        where: { id },
    });
}

// Slug ile genre bulur
export async function findGenreBySlug(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    return await client.genre.findUnique({
        where: { slug },
    });
}

// Name ile genre bulur
export async function findGenreByName(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    return await client.genre.findUnique({
        where: { name },
    });
}

// Tüm genre'leri listeler
export async function findAllGenres(
    client: PrismaClientOrTransaction = prisma
): Promise<Genre[]> {
    return await client.genre.findMany({
        orderBy: { name: 'asc' },
    });
}

// Genre bilgilerini günceller
export async function updateGenre(
    where: Prisma.GenreWhereUniqueInput,
    data: Prisma.GenreUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    return await client.genre.update({
        where,
        data,
    });
}

// Genre'yi siler
export async function deleteGenre(
    where: Prisma.GenreWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    return await client.genre.delete({ where });
}

// Genre sayısını döner
export async function countGenres(
    where?: Prisma.GenreWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.genre.count({ where });
} 