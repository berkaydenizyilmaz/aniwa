// Constants types - Sabitlerden türetilen tip tanımları

import { ANIME_DOMAIN } from '@/lib/constants/domains/anime';
import { AUTH_DOMAIN } from '@/lib/constants/domains/auth';
import { MASTER_DATA_DOMAIN } from '@/lib/constants/domains/masterData';
import { USER_DOMAIN } from '@/lib/constants/domains/user';

// Anime types
export type AnimeType = keyof typeof ANIME_DOMAIN.UI.TYPE_LABELS;
export type AnimeStatus = keyof typeof ANIME_DOMAIN.UI.STATUS_LABELS;
export type AnimeSeason = keyof typeof ANIME_DOMAIN.UI.SEASON_LABELS;
export type AnimeSource = keyof typeof ANIME_DOMAIN.UI.SOURCE_LABELS;
export type AnimeCountryOfOrigin = keyof typeof ANIME_DOMAIN.UI.COUNTRY_OF_ORIGIN_LABELS;

// Master data types
export type TagCategory = keyof typeof MASTER_DATA_DOMAIN.UI.TAG_CATEGORY_LABELS;
export type StudioType = keyof typeof MASTER_DATA_DOMAIN.UI.STUDIO_TYPE_LABELS;

// User types
export type UserRole = keyof typeof USER_DOMAIN.UI.ROLE_LABELS;
export type ProfileVisibility = keyof typeof USER_DOMAIN.UI.PROFILE_VISIBILITY_LABELS;
export type ScoreFormat = keyof typeof USER_DOMAIN.UI.SCORE_FORMAT_LABELS;

// Utility types
export type ValidationRule<T> = {
  min?: number;
  max?: number;
  pattern?: RegExp;
};

export type UILabels<T> = Record<keyof T, string>;
export type UIColors<T> = Record<keyof T, string>;
