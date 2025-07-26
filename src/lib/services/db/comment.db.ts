// Comment modeli için CRUD operasyonları

import { Prisma, Comment } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Yeni yorum oluşturur
export async function createCommentDB(
    data: Prisma.CommentCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    try {
        return await client.comment.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum oluşturma', { data });
    }
}

// ID ile yorum bulur
export async function findCommentByIdDB(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment | null> {
    try {
        return await client.comment.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum ID ile bulma', { id });
    }
}

// Kullanıcının yorumlarını listeler
export async function findCommentsByUserIdDB(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
    try {
        return await client.comment.findMany({
            where: { userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının yorumlarını bulma', { userId, skip, take });
    }
}

// Anime serisi için yorumları listeler
export async function findCommentsByAnimeSeriesIdDB(
    animeSeriesId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
    try {
        return await client.comment.findMany({
            where: { animeSeriesId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime serisi yorumlarını bulma', { animeSeriesId, skip, take });
    }
}

// Anime medya parçası için yorumları listeler
export async function findCommentsByAnimeMediaPartIdDB(
    animeMediaPartId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
    try {
        return await client.comment.findMany({
            where: { animeMediaPartId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime medya parçası yorumlarını bulma', { animeMediaPartId, skip, take });
    }
}

// Tüm yorumları listeler (filtrelemeli)
export async function findAllCommentsDB(
    where?: Prisma.CommentWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.CommentOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
    try {
        return await client.comment.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Tüm yorumları listeleme', { where, skip, take, orderBy });
    }
}

// Yorum günceller
export async function updateCommentDB(
    where: Prisma.CommentWhereUniqueInput,
    data: Prisma.CommentUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    try {
        return await client.comment.update({
            where,
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum güncelleme', { where, data });
    }
}

// Yorum siler
export async function deleteCommentDB(
    where: Prisma.CommentWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    try {
        return await client.comment.delete({
            where,
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum silme', { where });
    }
}

// Yorum sayısını döner
export async function countCommentsDB(
    where?: Prisma.CommentWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.comment.count({
            where,
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum sayma', { where });
    }
} 