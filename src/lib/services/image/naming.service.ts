// Cloudinary isimlendirme ve public ID yönetimi

import { 
  IMAGE_CONFIG, 
  CLOUDINARY_PREFIX, 
  ENTITY_PREFIXES,
  type ImageType 
} from '@/lib/constants/image.constants';

/**
 * Görsel dosyası için benzersiz isim oluşturur
 * Pattern: {entityPrefix}_{entityId}_{timestamp}
 */
export function generateImageName(
  imageType: ImageType,
  entityId: string,
  timestamp?: number
): string {
  const entityPrefix = ENTITY_PREFIXES[imageType];
  const ts = timestamp || Date.now();
  return `${entityPrefix}_${entityId}_${ts}`;
}

/**
 * Cloudinary public ID oluşturur
 * Pattern: aniwa/{folder}/{entityPrefix}_{entityId}_{timestamp}
 */
export function generatePublicId(
  imageType: ImageType,
  entityId: string,
  timestamp?: number
): string {
  const config = IMAGE_CONFIG[imageType];
  const imageName = generateImageName(imageType, entityId, timestamp);
  return `${CLOUDINARY_PREFIX}/${config.folder}/${imageName}`;
}

/**
 * URL'den public ID çıkarır
 */
export function extractPublicId(url: string): string | null {
  if (!url) return null;
  
  try {
    // Cloudinary URL pattern'i: .../{version}/{public_id}.{format}
    const match = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|webp|gif)$/i);
    if (match) {
      return match[1];
    }
    
    // Version olmayan durumlar için
    const altMatch = url.match(/upload\/(.+?)\.(jpg|jpeg|png|webp|gif)$/i);
    if (altMatch) {
      return altMatch[1];
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Public ID'den entity bilgilerini çıkarır
 */
export function parsePublicId(publicId: string): {
  entityType: string;
  entityId: string;
  timestamp: string;
} | null {
  try {
    // Pattern: aniwa/folder/entityType_entityId_timestamp
    const parts = publicId.split('/');
    const fileName = parts[parts.length - 1]; // Son part dosya adı
    
    const [entityType, entityId, timestamp] = fileName.split('_');
    
    if (!entityType || !entityId || !timestamp) {
      return null;
    }
    
    return { entityType, entityId, timestamp };
  } catch {
    return null;
  }
}

/**
 * Dosya boyutunu human-readable formata çevirir
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Dosya formatını normalize eder
 */
export function normalizeFileFormat(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    default:
      return 'jpeg'; // Varsayılan
  }
}
