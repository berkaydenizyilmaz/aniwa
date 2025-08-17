// Shared base schemas - Tüm domain'lerde ortak kullanılan şema parçaları

import { z } from 'zod';
import { SHARED_VALIDATION } from '@/lib/constants/shared/validation';

// Base name schema
export const baseNameSchema = z.string()
  .min(SHARED_VALIDATION.NAME.MIN_LENGTH, 'İsim gerekli')
  .max(SHARED_VALIDATION.NAME.MAX_LENGTH, 'İsim çok uzun');

// Base description schema
export const baseDescriptionSchema = z.string()
  .max(SHARED_VALIDATION.DESCRIPTION.MAX_LENGTH, 'Açıklama çok uzun')
  .optional();

// Base URL schema
export const baseUrlSchema = z.string()
  .url('Geçerli bir URL girin')
  .max(SHARED_VALIDATION.URL.MAX_LENGTH, 'URL çok uzun');

// Base pagination schema
export const basePaginationSchema = z.object({
  page: z.number()
    .min(SHARED_VALIDATION.PAGINATION.MIN_PAGE)
    .default(SHARED_VALIDATION.PAGINATION.MIN_PAGE),
  limit: z.number()
    .min(SHARED_VALIDATION.PAGINATION.MIN_PAGE)
    .max(SHARED_VALIDATION.PAGINATION.MAX_LIMIT)
    .default(SHARED_VALIDATION.PAGINATION.DEFAULT_LIMIT),
});

// Base search schema
export const baseSearchSchema = z.object({
  search: z.string().optional(),
});

// Base filters schema (combines pagination and search)
export const baseFiltersSchema = basePaginationSchema.merge(baseSearchSchema);
