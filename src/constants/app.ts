// Bu dosya tüm uygulama genelinde kullanılan sabitleri içerir

import { Theme } from "@prisma/client";

// Tema tercihleri
export const THEME_PREFERENCES = Object.fromEntries(
  Object.entries(Theme).map(([key, value]) => [key, value.toLowerCase()])
) as Record<Theme, Lowercase<Theme>>

// Varsayılan tema
export const DEFAULT_THEME = THEME_PREFERENCES.SYSTEM