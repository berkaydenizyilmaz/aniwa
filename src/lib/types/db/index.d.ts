// DB katmanı için ortak tipler

import { PrismaClient, Prisma } from '@prisma/client';

// Prisma transaction uyumluluğu için tip
export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;