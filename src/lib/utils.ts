import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Username'den slug oluşturur
export function generateUserSlug(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '-') // Sadece harf, rakam ve underscore kalır, diğerleri tire olur
    .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
    .replace(/^-+|-+$/g, '') // Başındaki ve sonundaki tireleri kaldır
}
