// Anime modelleri için CRUD operasyonları

import { Prisma, AnimeSeries, AnimeMediaPart, Episode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';

// =============================================================================
// ANIME SERIES CRUD İŞLEMLERİ
// =============================================================================

// Anime serisi oluşturma
export async function createAnimeSeries(
  data: Prisma.AnimeSeriesCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  return await client.animeSeries.create({ data });
}

// Anime serisi getirme (ID ile)
export async function findAnimeSeriesById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  return await client.animeSeries.findUnique({ where: { id } });
}

// Anime serisi getirme (Anilist ID ile)
export async function findAnimeSeriesByAnilistId(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  return await client.animeSeries.findUnique({ where: { anilistId } });
}

// Anime serisi getirme (MAL ID ile)
export async function findAnimeSeriesByMalId(
  idMal: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  return await client.animeSeries.findUnique({ where: { idMal } });
}

// Anime serisi getirme (Aniwa Public ID ile)
export async function findAnimeSeriesByPublicId(
  aniwaPublicId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  return await client.animeSeries.findUnique({ where: { aniwaPublicId } });
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function findAllAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries[]> {
  return await client.animeSeries.findMany({
    where,
    skip,
    take,
    orderBy,
  });
}

// Anime serisi güncelleme
export async function updateAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  data: Prisma.AnimeSeriesUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  return await client.animeSeries.update({ where, data });
}

// Anime serisi silme
export async function deleteAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  return await client.animeSeries.delete({ where });
}

// Anime serisi sayısı
export async function countAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return await client.animeSeries.count({ where });
}

// =============================================================================
// ANIME MEDIA PART CRUD İŞLEMLERİ
// =============================================================================

// Anime medya parçası oluşturma
export async function createAnimeMediaPart(
  data: Prisma.AnimeMediaPartCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  return await client.animeMediaPart.create({ data });
}

// Anime medya parçası getirme (ID ile)
export async function findAnimeMediaPartById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  return await client.animeMediaPart.findUnique({ where: { id } });
}

// Anime medya parçası getirme (Anilist ID ile)
export async function findAnimeMediaPartByAnilistId(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  return await client.animeMediaPart.findUnique({ where: { anilistId } });
}

// Seriye ait medya parçalarını getirme
export async function findAnimeMediaPartsBySeriesId(
  seriesId: string,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  return await client.animeMediaPart.findMany({
    where: { seriesId },
    orderBy,
  });
}

// Tüm anime medya parçalarını getirme (filtrelemeli)
export async function findAllAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  return await client.animeMediaPart.findMany({
    where,
    skip,
    take,
    orderBy,
  });
}

// Anime medya parçası güncelleme
export async function updateAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  data: Prisma.AnimeMediaPartUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  return await client.animeMediaPart.update({ where, data });
}

// Anime medya parçası silme
export async function deleteAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  return await client.animeMediaPart.delete({ where });
}

// Anime medya parçası sayısı
export async function countAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return await client.animeMediaPart.count({ where });
}

// =============================================================================
// EPISODE CRUD İŞLEMLERİ
// =============================================================================

// Bölüm oluşturma
export async function createEpisode(
  data: Prisma.EpisodeCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  return await client.episode.create({ data });
}

// Bölüm getirme (ID ile)
export async function findEpisodeById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  return await client.episode.findUnique({ where: { id } });
}

// Bölüm getirme (medya parçası ID ve bölüm numarası ile)
export async function findEpisodeByNumber(
  mediaPartId: string,
  episodeNumber: number,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  return await client.episode.findUnique({
    where: {
      mediaPartId_episodeNumber: {
        mediaPartId,
        episodeNumber,
      },
    },
  });
}

// Medya parçasına ait bölümleri getirme
export async function findEpisodesByMediaPartId(
  mediaPartId: string,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  return await client.episode.findMany({
    where: { mediaPartId },
    orderBy,
  });
}

// Tüm bölümleri getirme (filtrelemeli)
export async function findAllEpisodes(
  where?: Prisma.EpisodeWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  return await client.episode.findMany({
    where,
    skip,
    take,
    orderBy,
  });
}

// Bölüm güncelleme
export async function updateEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  data: Prisma.EpisodeUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  return await client.episode.update({ where, data });
}

// Bölüm silme
export async function deleteEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  return await client.episode.delete({ where });
}

// Bölüm sayısı
export async function countEpisodes(
  where?: Prisma.EpisodeWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  return await client.episode.count({ where });
} 