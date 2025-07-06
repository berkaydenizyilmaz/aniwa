// Aniwa Projesi - Genel Uygulama Sabitleri
// Bu dosya tüm uygulama genelinde kullanılan sabitleri içerir

import { Theme } from "@prisma/client";

/**
 * @description Tema tercihleri için sabitler. Prisma Enum'dan türetilmiştir.
 * Değerler küçük harfe çevrilmiştir çünkü next-themes kütüphanesi
 * `setTheme` fonksiyonunda küçük harf tema isimleri beklemektedir.
 */
export const THEME_PREFERENCES = Object.fromEntries(
  Object.entries(Theme).map(([key, value]) => [key, value.toLowerCase()])
) as Record<Theme, Lowercase<Theme>>
