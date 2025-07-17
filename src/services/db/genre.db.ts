import { Genre, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import type { PrismaClientOrTransaction } from '@/types'

// Yeni tür oluştur
export async function createGenre(
  data: Prisma.GenreCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
  return client.genre.create({ data })
}

// ID ile tür bul
export async function findGenreById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
  return client.genre.findUnique({ 
    where: { id } 
  })
}

// Slug ile tür bul
export async function findGenreBySlug(
  slug: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre | null> {
  return client.genre.findUnique({ 
    where: { slug } 
  })
}

// Tüm türleri listele
export async function findGenres(
  where?: Prisma.GenreWhereInput,
  orderBy: Prisma.GenreOrderByWithRelationInput = { name: 'asc' },
  take?: number,
  skip?: number,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre[]> {
  return client.genre.findMany({
    where,
    orderBy,
    take,
    skip,
  })
}

// Tür güncelle
export async function updateGenre(
  id: string,
  data: Prisma.GenreUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
  // Eğer isim güncelleniyorsa ve slug verilmediyse otomatik güncelle
  if (data.name && !data.slug) {
    const name = typeof data.name === 'string' ? data.name : data.name.set
    data.slug = name?.toLowerCase().replace(/\s+/g, '-')
  }

  return client.genre.update({
    where: { id },
    data,
  })
}

// Tür sil
export async function deleteGenre(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Genre> {
  // İlişkili anime türlerini de sil
  await client.animeGenre.deleteMany({
    where: { genreId: id }
  })

  return client.genre.delete({ 
    where: { id } 
  })
}

// Tür sayısını hesapla
export async function countGenres(
  where?: Prisma.GenreWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return client.genre.count({ where })
}

// Tür varlığını kontrol et
export async function genreExists(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<boolean> {
  const count = await client.genre.count({ 
    where: { id } 
  })
  return count > 0
}
