// CommentLike modeli için CRUD operasyonları

import { Prisma, CommentLike } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

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