import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./db/prisma"

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

// OAuth'dan gelen name'den benzersiz username oluşturur
export async function generateUsernameFromName(name: string): Promise<string> {
  // Name'i temizle ve küçük harfe çevir
  const baseName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Sadece harf ve rakam kalır
    .substring(0, 16) // Maksimum 16 karakter (sonuna 4 rakam eklenecek)
  
  // Eğer baseName boşsa varsayılan kullan
  const cleanBaseName = baseName || 'user'
  
  // Benzersiz username bulana kadar dene
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    // 4 haneli rastgele sayı ekle
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const candidateUsername = `${cleanBaseName}${randomSuffix}`
    
    // Veritabanında kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { username: candidateUsername }
    })
    
    if (!existingUser) {
      return candidateUsername
    }
    
    attempts++
  }
  
  // Eğer 10 deneme sonunda bulunamazsa timestamp ekle
  const timestamp = Date.now().toString().slice(-6)
  return `${cleanBaseName}${timestamp}`
}
