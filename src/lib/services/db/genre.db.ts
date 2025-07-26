// Genre modeli için CRUD operasyonları

import { Prisma, Genre } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Genre CRUD operasyonları

// Yeni genre oluşturur
export async function createGenreDB(
    data: Prisma.GenreCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    try {
        return await client.genre.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Genre oluşturma', { data });
    }
}

// ID ile genre bulur
export async function findGenreByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    try {
        return await client.genre.findUnique({
            where: { id },
        });
    } catch (error) {
        handleDatabaseError(error, 'Genre ID ile bulma', { id });
    }
}

// Slug ile genre bulur
export async function findGenreBySlugDB(
    slug: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    try {
        return await client.genre.findUnique({
            where: { slug },
        });
    } catch (error) {
        handleDatabaseError(error, 'Genre slug ile bulma', { slug });
    }
}

// Name ile genre bulur
export async function findGenreByNameDB(
    name: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
    try {
        return await client.genre.findUnique({
            where: { name },
        });
    } catch (error) {
        handleDatabaseError(error, 'Genre name ile bulma', { name });
    }
}

// Tüm genre'leri listeler
export async function findAllGenresDB(
    client: PrismaClientOrTransaction = prisma
): Promise<Genre[]> {
    try {
        return await client.genre.findMany({
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm genre\'leri listeleme');
    }
}

// Genre bilgilerini günceller
export async function updateGenreDB(
    where: Prisma.GenreWhereUniqueInput,
    data: Prisma.GenreUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    try {
        return await client.genre.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Genre güncelleme', { where, data });
    }
}

// Genre'yi siler
export async function deleteGenreDB(
    where: Prisma.GenreWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
    try {
        return await client.genre.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Genre silme', { where });
    }
}

// Genre sayısını döner
export async function countGenresDB(
    where?: Prisma.GenreWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.genre.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Genre sayma', { where });
    }
}