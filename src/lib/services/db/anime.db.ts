// Anime modelleri için CRUD operasyonları

import { Prisma, AnimeSeries, AnimeMediaPart, Episode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrismaClientOrTransaction } from '@/lib/types/db';
import { handleDatabaseError } from '@/lib/utils/db-error-handler';

// Anime Serisi CRUD İşlemleri

// Anime serisi oluşturma
export async function createAnimeSeries(
  data: Prisma.AnimeSeriesCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi oluşturma', { data });
  }
}

// Anime serisi getirme (ID ile)
export async function findAnimeSeriesById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi ID ile bulma', { id });
  }
}

// Anime serisi getirme (Anilist ID ile)
export async function findAnimeSeriesByAnilistId(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { anilistId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi Anilist ID ile bulma', { anilistId });
  }
}

// Anime serisi getirme (MAL ID ile)
export async function findAnimeSeriesByMalId(
  idMal: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { idMal } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi MAL ID ile bulma', { idMal });
  }
}

// Anime serisi getirme (Aniwa Public ID ile)
export async function findAnimeSeriesByPublicId(
  aniwaPublicId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries | null> {
  try {
    return await client.animeSeries.findUnique({ where: { aniwaPublicId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi Aniwa Public ID ile bulma', { aniwaPublicId });
  }
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function findAllAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries[]> {
  try {
    return await client.animeSeries.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime serilerini listeleme', { where, skip, take, orderBy });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  data: Prisma.AnimeSeriesUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi güncelleme', { where, data });
  }
}

// Anime serisi silme
export async function deleteAnimeSeries(
  where: Prisma.AnimeSeriesWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeSeries> {
  try {
    return await client.animeSeries.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi silme', { where });
  }
}

// Anime serisi sayısı
export async function countAnimeSeries(
  where?: Prisma.AnimeSeriesWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeSeries.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi sayma', { where });
  }
}

// Anime serisi getirme (detaylı - tüm ilişkilerle)
export async function findAnimeSeriesByIdWithDetails(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeSeriesGetPayload<{
  include: {
    animeGenres: { include: { genre: true } };
    animeTags: { include: { tag: true } };
    animeStudios: { include: { studio: true } };
    mediaParts: { 
      include: { partsEpisodes: { orderBy: { episodeNumber: 'asc' } } };
    };
    streamingLinks: true;
    comments: { 
      include: { user: { select: { id: true, username: true, profilePicture: true } } };
      orderBy: { createdAt: 'desc' };
      take: 10;
    };
  };
}> | null> {
  try {
    return await client.animeSeries.findUnique({
      where: { id },
      include: {
        animeGenres: { include: { genre: true } },
        animeTags: { include: { tag: true } },
        animeStudios: { include: { studio: true } },
        mediaParts: { 
          include: { partsEpisodes: { orderBy: { episodeNumber: 'asc' } } }
        },
        streamingLinks: true,
        comments: { 
          include: { user: { select: { id: true, username: true, profilePicture: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi detaylı bulma', { id });
  }
}

// Tüm anime serilerini getirme (detaylı - filtrelemeli)
export async function findAllAnimeSeriesWithDetails(
  where?: Prisma.AnimeSeriesWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeSeriesOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeSeriesGetPayload<{
  include: {
    animeGenres: { include: { genre: true } };
    animeTags: { include: { tag: true } };
    animeStudios: { include: { studio: true } };
    mediaParts: { select: { id: true, title: true, type: true, episodes: true } };
  };
}>[]> {
  try {
    return await client.animeSeries.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        animeGenres: { include: { genre: true } },
        animeTags: { include: { tag: true } },
        animeStudios: { include: { studio: true } },
        mediaParts: { select: { id: true, title: true, type: true, episodes: true } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime serilerini detaylı listeleme', { where, skip, take, orderBy });
  }
}

// Anime Media Part CRUD İşlemleri

// Anime medya parçası oluşturma
export async function createAnimeMediaPart(
  data: Prisma.AnimeMediaPartCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası oluşturma', { data });
  }
}

// Anime medya parçası getirme (ID ile)
export async function findAnimeMediaPartById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  try {
    return await client.animeMediaPart.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası ID ile bulma', { id });
  }
}

// Anime medya parçası getirme (Anilist ID ile)
export async function findAnimeMediaPartByAnilistId(
  anilistId: number,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart | null> {
  try {
    return await client.animeMediaPart.findUnique({ where: { anilistId } });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası Anilist ID ile bulma', { anilistId });
  }
}

// Anime serisi için medya parçalarını getirme
export async function findAnimeMediaPartsBySeriesId(
  seriesId: string,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  try {
    return await client.animeMediaPart.findMany({
      where: { seriesId },
      orderBy,
      include: {
        partsEpisodes: { orderBy: { episodeNumber: 'asc' } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime serisi için medya parçalarını bulma', { seriesId, orderBy });
  }
}

// Tüm anime medya parçalarını getirme (filtrelemeli)
export async function findAllAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.AnimeMediaPartOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart[]> {
  try {
    return await client.animeMediaPart.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        series: { select: { id: true, title: true, englishTitle: true } },
        partsEpisodes: { orderBy: { episodeNumber: 'asc' } },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm anime medya parçalarını listeleme', { where, skip, take, orderBy });
  }
}

// Anime medya parçası güncelleme
export async function updateAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  data: Prisma.AnimeMediaPartUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası güncelleme', { where, data });
  }
}

// Anime medya parçası silme
export async function deleteAnimeMediaPart(
  where: Prisma.AnimeMediaPartWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<AnimeMediaPart> {
  try {
    return await client.animeMediaPart.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası silme', { where });
  }
}

// Anime medya parçası sayısı
export async function countAnimeMediaParts(
  where?: Prisma.AnimeMediaPartWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.animeMediaPart.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Anime medya parçası sayma', { where });
  }
}

// Episode CRUD İşlemleri

// Episode oluşturma
export async function createEpisode(
  data: Prisma.EpisodeCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.create({ data });
  } catch (error) {
    handleDatabaseError(error, 'Episode oluşturma', { data });
  }
}

// Episode getirme (ID ile)
export async function findEpisodeById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  try {
    return await client.episode.findUnique({ where: { id } });
  } catch (error) {
    handleDatabaseError(error, 'Episode ID ile bulma', { id });
  }
}

// Episode getirme (medya parçası ve bölüm numarası ile)
export async function findEpisodeByNumber(
  mediaPartId: string,
  episodeNumber: number,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode | null> {
  try {
    return await client.episode.findUnique({
      where: {
        mediaPartId_episodeNumber: {
          mediaPartId,
          episodeNumber,
        },
      },
      include: {
        mediaPart: {
          include: {
            series: { select: { id: true, title: true, englishTitle: true } },
          },
        },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode numara ile bulma', { mediaPartId, episodeNumber });
  }
}

// Medya parçası için bölümleri getirme
export async function findEpisodesByMediaPartId(
  mediaPartId: string,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  try {
    return await client.episode.findMany({
      where: { mediaPartId },
      orderBy: orderBy || { episodeNumber: 'asc' },
      include: {
        mediaPart: {
          include: {
            series: { select: { id: true, title: true, englishTitle: true } },
          },
        },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Episode medya parçası ID ile bulma', { mediaPartId, orderBy });
  }
}

// Tüm episode'ları listeleme
export async function findAllEpisodes(
  where?: Prisma.EpisodeWhereInput,
  skip?: number,
  take?: number,
  orderBy?: Prisma.EpisodeOrderByWithRelationInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode[]> {
  try {
    return await client.episode.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        mediaPart: {
          include: {
            series: { select: { id: true, title: true, englishTitle: true } },
          },
        },
      },
    });
  } catch (error) {
    handleDatabaseError(error, 'Tüm episode\'ları listeleme', { where, skip, take, orderBy });
  }
}

// Episode güncelleme
export async function updateEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  data: Prisma.EpisodeUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.update({ where, data });
  } catch (error) {
    handleDatabaseError(error, 'Episode güncelleme', { where, data });
  }
}

// Episode silme
export async function deleteEpisode(
  where: Prisma.EpisodeWhereUniqueInput,
  client: PrismaClientOrTransaction = prisma
): Promise<Episode> {
  try {
    return await client.episode.delete({ where });
  } catch (error) {
    handleDatabaseError(error, 'Episode silme', { where });
  }
}

// Episode sayısı
export async function countEpisodes(
  where?: Prisma.EpisodeWhereInput,
  client: PrismaClientOrTransaction = prisma
): Promise<number> {
  try {
    return await client.episode.count({ where });
  } catch (error) {
    handleDatabaseError(error, 'Episode sayma', { where });
  }
}

// İlişki CRUD İşlemleri

// Anime-Genre ilişkisi oluşturma
export async function createAnimeGenre(
  animeSeriesId: string,
  genreId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeGenreGetPayload<{ include: { genre: true } }>> {
  try {
    return await client.animeGenre.create({
      data: { animeSeriesId, genreId },
      include: { genre: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Genre ilişkisi oluşturma', { animeSeriesId, genreId });
  }
}

// Anime-Tag ilişkisi oluşturma
export async function createAnimeTag(
  animeSeriesId: string,
  tagId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeTagGetPayload<{ include: { tag: true } }>> {
  try {
    return await client.animeTag.create({
      data: { animeSeriesId, tagId },
      include: { tag: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Tag ilişkisi oluşturma', { animeSeriesId, tagId });
  }
}

// Anime-Studio ilişkisi oluşturma
export async function createAnimeStudio(
  animeSeriesId: string,
  studioId: string,
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.AnimeStudioGetPayload<{ include: { studio: true } }>> {
  try {
    return await client.animeStudio.create({
      data: { animeSeriesId, studioId },
      include: { studio: true },
    });
  } catch (error) {
    handleDatabaseError(error, 'Anime-Studio ilişkisi oluşturma', { animeSeriesId, studioId });
  }
}

// Toplu Anime-Genre ilişkileri oluşturma
export async function createAnimeGenres(
  animeSeriesId: string,
  genreIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeGenre.createMany({
      data: genreIds.map(genreId => ({ animeSeriesId, genreId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Genre ilişkileri oluşturma', { animeSeriesId, genreIds });
  }
}

// Toplu Anime-Tag ilişkileri oluşturma
export async function createAnimeTags(
  animeSeriesId: string,
  tagIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeTag.createMany({
      data: tagIds.map(tagId => ({ animeSeriesId, tagId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Tag ilişkileri oluşturma', { animeSeriesId, tagIds });
  }
}

// Toplu Anime-Studio ilişkileri oluşturma
export async function createAnimeStudios(
  animeSeriesId: string,
  studioIds: string[],
  client: PrismaClientOrTransaction = prisma
): Promise<Prisma.BatchPayload> {
  try {
    return await client.animeStudio.createMany({
      data: studioIds.map(studioId => ({ animeSeriesId, studioId })),
    });
  } catch (error) {
    handleDatabaseError(error, 'Toplu Anime-Studio ilişkileri oluşturma', { animeSeriesId, studioIds });
  }
} 