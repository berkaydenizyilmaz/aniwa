// Comment ve CommentLike modelleri için CRUD operasyonları

import { Prisma, Comment, CommentLike } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Comment CRUD operasyonları

// Yeni yorum oluşturur
export async function createComment(
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
export async function findCommentById(
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
export async function findCommentsByUserId(
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
                animeSeries: {
                    select: {
                        id: true,
                        title: true,
                        englishTitle: true,
                        coverImage: true,
                    },
                },
                animeMediaPart: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                    },
                },
                commentLikes: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının yorumlarını bulma', { userId, skip, take });
    }
}

// Anime serisinin yorumlarını listeler
export async function findCommentsByAnimeSeriesId(
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
                    select: {
                        id: true,
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime serisinin yorumlarını bulma', { animeSeriesId, skip, take });
    }
}

// Anime medya parçasının yorumlarını listeler
export async function findCommentsByAnimeMediaPartId(
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
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Anime medya parçasının yorumlarını bulma', { animeMediaPartId, skip, take });
    }
}

// Tüm yorumları listeler (filtrelemeli)
export async function findAllComments(
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
                animeSeries: {
                    select: {
                        id: true,
                        title: true,
                        englishTitle: true,
                        coverImage: true,
                    },
                },
                animeMediaPart: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                    },
                },
                commentLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
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

// Yorum bilgilerini günceller
export async function updateComment(
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

// Yorum'u siler
export async function deleteComment(
    where: Prisma.CommentWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    try {
        return await client.comment.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Yorum silme', { where });
    }
}

// Yorum sayısını döner
export async function countComments(
    where?: Prisma.CommentWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.comment.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Yorum sayma', { where });
    }
}

// CommentLike CRUD operasyonları

// Yorum beğenisi oluşturur
export async function createCommentLike(
    data: Prisma.CommentLikeCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike> {
    try {
        return await client.commentLike.create({
            data,
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorum beğenisi oluşturma', { data });
    }
}

// Kullanıcının yorum beğenisini bulur
export async function findCommentLikeByUserAndComment(
    userId: string,
    commentId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike | null> {
    try {
        return await client.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının yorum beğenisini bulma', { userId, commentId });
    }
}

// Yorumun beğenilerini listeler
export async function findCommentLikesByCommentId(
    commentId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike[]> {
    try {
        return await client.commentLike.findMany({
            where: { commentId },
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
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Yorumun beğenilerini bulma', { commentId, skip, take });
    }
}

// Kullanıcının beğenilerini listeler
export async function findCommentLikesByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike[]> {
    try {
        return await client.commentLike.findMany({
            where: { userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                comment: {
                    include: {
                        animeSeries: {
                            select: {
                                id: true,
                                title: true,
                                englishTitle: true,
                                coverImage: true,
                            },
                        },
                        animeMediaPart: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        handleDatabaseError(error, 'Kullanıcının beğenilerini bulma', { userId, skip, take });
    }
}

// Yorum beğenisini siler
export async function deleteCommentLike(
    where: Prisma.CommentLikeWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike> {
    try {
        return await client.commentLike.delete({ where });
    } catch (error) {
        handleDatabaseError(error, 'Yorum beğenisi silme', { where });
    }
}

// Yorum beğeni sayısını döner
export async function countCommentLikes(
    where?: Prisma.CommentLikeWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    try {
        return await client.commentLike.count({ where });
    } catch (error) {
        handleDatabaseError(error, 'Yorum beğeni sayma', { where });
    }
} 