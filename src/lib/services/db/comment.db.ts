// Comment ve CommentLike modelleri için CRUD operasyonları

import { Prisma, Comment, CommentLike } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// Comment CRUD operasyonları

// Yeni yorum oluşturur
export async function createComment(
    data: Prisma.CommentCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    return await client.comment.create({
        data,
    });
}

// ID ile yorum bulur
export async function findCommentById(
    id: string,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment | null> {
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
}

// Kullanıcının yorumlarını listeler
export async function findCommentsByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
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
}

// Anime serisinin yorumlarını listeler
export async function findCommentsByAnimeSeriesId(
    animeSeriesId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
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
                        },
                    },
                },
            },
        },
    });
}

// Anime medya parçasının yorumlarını listeler
export async function findCommentsByAnimeMediaPartId(
    animeMediaPartId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
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
}

// Tüm yorumları listeler (filtrelemeli)
export async function findAllComments(
    where?: Prisma.CommentWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.CommentOrderByWithRelationInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment[]> {
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
}

// Yorum bilgilerini günceller
export async function updateComment(
    where: Prisma.CommentWhereUniqueInput,
    data: Prisma.CommentUpdateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    return await client.comment.update({
        where,
        data,
    });
}

// Yorumu siler
export async function deleteComment(
    where: Prisma.CommentWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<Comment> {
    return await client.comment.delete({ where });
}

// Yorum sayısını döner
export async function countComments(
    where?: Prisma.CommentWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.comment.count({ where });
}

// CommentLike CRUD operasyonları

// Yeni yorum beğenisi oluşturur
export async function createCommentLike(
    data: Prisma.CommentLikeCreateInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike> {
    return await client.commentLike.create({
        data,
    });
}

// Kullanıcı ve yorum ile beğeni bulur
export async function findCommentLikeByUserAndComment(
    userId: string,
    commentId: string,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike | null> {
    return await client.commentLike.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId,
            },
        },
    });
}

// Yorumun beğenilerini listeler
export async function findCommentLikesByCommentId(
    commentId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike[]> {
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
}

// Kullanıcının beğendiği yorumları listeler
export async function findCommentLikesByUserId(
    userId: string,
    skip?: number,
    take?: number,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike[]> {
    return await client.commentLike.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
            comment: {
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
                },
            },
        },
    });
}

// Beğeniyi siler
export async function deleteCommentLike(
    where: Prisma.CommentLikeWhereUniqueInput,
    client: PrismaClientOrTransaction = prisma
): Promise<CommentLike> {
    return await client.commentLike.delete({ where });
}

// Beğeni sayısını döner
export async function countCommentLikes(
    where?: Prisma.CommentLikeWhereInput,
    client: PrismaClientOrTransaction = prisma
): Promise<number> {
    return await client.commentLike.count({ where });
} 