// Constants types - Sabitlerden türetilen tip tanımları

import { ANIME_DOMAIN } from '@/lib/constants/domains/anime';
import { AUTH_DOMAIN } from '@/lib/constants/domains/auth';
import { MASTER_DATA_DOMAIN } from '@/lib/constants/domains/masterData';
import { USER_DOMAIN } from '@/lib/constants/domains/user';
import { DomainType, DomainStatus, DomainCategory } from './shared';

// Anime types
export type AnimeType = DomainType<typeof ANIME_DOMAIN.UI.TYPE_LABELS>;
export type AnimeStatus = DomainStatus<typeof ANIME_DOMAIN.UI.STATUS_LABELS>;
export type AnimeSeason = DomainType<typeof ANIME_DOMAIN.UI.SEASON_LABELS>;
export type AnimeSource = DomainType<typeof ANIME_DOMAIN.UI.SOURCE_LABELS>;
export type AnimeCountryOfOrigin = DomainType<typeof ANIME_DOMAIN.UI.COUNTRY_OF_ORIGIN_LABELS>;

// Master data types
export type TagCategory = DomainType<typeof MASTER_DATA_DOMAIN.UI.TAG_CATEGORY_LABELS>;
export type StudioType = DomainType<typeof MASTER_DATA_DOMAIN.UI.STUDIO_TYPE_LABELS>;

// User types
export type UserRole = DomainType<typeof USER_DOMAIN.UI.ROLE_LABELS>;
export type ProfileVisibility = DomainType<typeof USER_DOMAIN.UI.PROFILE_VISIBILITY_LABELS>;
export type ScoreFormat = DomainType<typeof USER_DOMAIN.UI.SCORE_FORMAT_LABELS>;
