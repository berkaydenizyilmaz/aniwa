// Anime veritabanı işlemleri

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// =============================================================================
// ANIME SERIES CRUD İŞLEMLERİ
// =============================================================================

// Anime serisi oluşturma
export async function createAnimeSeries(
  data: Prisma.AnimeSeriesCreateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object>> {
  const client = tx || prisma;
  return client.animeSeries.create({ data });
}

// Anime serisi getirme (ID ile)
export async function findAnimeSeriesById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeSeries.findUnique({ where: { id } });
}

// Anime serisi getirme (Anilist ID ile)
export async function findAnimeSeriesByAnilistId(
  anilistId: number,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeSeries.findUnique({ where: { anilistId } });
}

// Anime serisi getirme (MAL ID ile)
export async function findAnimeSeriesByMalId(
  idMal: number,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeSeries.findUnique({ where: { idMal } });
}

// Anime serisi getirme (Aniwa Public ID ile)
export async function findAnimeSeriesByPublicId(
  aniwaPublicId: number,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeSeries.findUnique({ where: { aniwaPublicId } });
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function findAllAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  include?: Prisma.AnimeSeriesInclude,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<{ include: typeof include }>[]> {
  const client = tx || prisma;
  return client.animeSeries.findMany({
    where,
    skip,
    take,
    orderBy,
    include
  });
}

// Anime serisi güncelleme
export async function updateAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  data: Prisma.AnimeSeriesUpdateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object>> {
  const client = tx || prisma;
  return client.animeSeries.update({ where, data });
}

// Anime serisi silme
export async function deleteAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeSeriesGetPayload<object>> {
  const client = tx || prisma;
  return client.animeSeries.delete({ where });
}

// Anime serisi sayısı
export async function countAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  tx?: Prisma.TransactionClient
): Promise<number> {
  const client = tx || prisma;
  return client.animeSeries.count({ where });
}

// =============================================================================
// ANIME MEDIA PART CRUD İŞLEMLERİ
// =============================================================================

// Anime medya parçası oluşturma
export async function createAnimeMediaPart(
  data: Prisma.AnimeMediaPartCreateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<object>> {
  const client = tx || prisma;
  return client.animeMediaPart.create({ data });
}

// Anime medya parçası getirme (ID ile)
export async function findAnimeMediaPartById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeMediaPart.findUnique({ where: { id } });
}

// Anime medya parçası getirme (Anilist ID ile)
export async function findAnimeMediaPartByAnilistId(
  anilistId: number,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<object> | null> {
  const client = tx || prisma;
  return client.animeMediaPart.findUnique({ where: { anilistId } });
}

// Seriye ait medya parçalarını getirme
export async function findAnimeMediaPartsBySeriesId(
  seriesId: string,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  include?: Prisma.AnimeMediaPartInclude,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<{ include: typeof include }>[]> {
  const client = tx || prisma;
  return client.animeMediaPart.findMany({
    where: { seriesId },
    orderBy,
    include
  });
}

// Tüm anime medya parçalarını getirme (filtrelemeli)
export async function findAllAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  include?: Prisma.AnimeMediaPartInclude,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<{ include: typeof include }>[]> {
  const client = tx || prisma;
  return client.animeMediaPart.findMany({
    where,
    skip,
    take,
    orderBy,
    include
  });
}

// Anime medya parçası güncelleme
export async function updateAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  data: Prisma.AnimeMediaPartUpdateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<object>> {
  const client = tx || prisma;
  return client.animeMediaPart.update({ where, data });
}

// Anime medya parçası silme
export async function deleteAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.AnimeMediaPartGetPayload<object>> {
  const client = tx || prisma;
  return client.animeMediaPart.delete({ where });
}

// Anime medya parçası sayısı
export async function countAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  tx?: Prisma.TransactionClient
): Promise<number> {
  const client = tx || prisma;
  return client.animeMediaPart.count({ where });
}

// =============================================================================
// EPISODE CRUD İŞLEMLERİ
// =============================================================================

// Bölüm oluşturma
export async function createEpisode(
  data: Prisma.EpisodeCreateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<object>> {
  const client = tx || prisma;
  return client.episode.create({ data });
}

// Bölüm getirme (ID ile)
export async function findEpisodeById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<object> | null> {
  const client = tx || prisma;
  return client.episode.findUnique({ where: { id } });
}

// Bölüm getirme (medya parçası ID ve bölüm numarası ile)
export async function findEpisodeByNumber(
  mediaPartId: string,
  episodeNumber: number,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<object> | null> {
  const client = tx || prisma;
  return client.episode.findUnique({ 
    where: { 
      mediaPartId_episodeNumber: { mediaPartId, episodeNumber } 
    } 
  });
}

// Medya parçasına ait bölümleri getirme
export async function findEpisodesByMediaPartId(
  mediaPartId: string,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  include?: Prisma.EpisodeInclude,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<{ include: typeof include }>[]> {
  const client = tx || prisma;
  return client.episode.findMany({
    where: { mediaPartId },
    orderBy,
    include
  });
}

// Tüm bölümleri getirme (filtrelemeli)
export async function findAllEpisodes(
  where?: Prisma.EpisodeWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  include?: Prisma.EpisodeInclude,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<{ include: typeof include }>[]> {
  const client = tx || prisma;
  return client.episode.findMany({
    where,
    skip,
    take,
    orderBy,
    include
  });
}

// Bölüm güncelleme
export async function updateEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  data: Prisma.EpisodeUpdateInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<object>> {
  const client = tx || prisma;
  return client.episode.update({ where, data });
}

// Bölüm silme
export async function deleteEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  tx?: Prisma.TransactionClient
): Promise<Prisma.EpisodeGetPayload<object>> {
  const client = tx || prisma;
  return client.episode.delete({ where });
}

// Bölüm sayısı
export async function countEpisodes(
  where?: Prisma.EpisodeWhereInput,
  tx?: Prisma.TransactionClient
): Promise<number> {
  const client = tx || prisma;
  return client.episode.count({ where });
} 