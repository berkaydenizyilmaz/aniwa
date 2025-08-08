// Modern görsel yükleme servisi

import { v2 as cloudinary } from 'cloudinary';
import { IMAGE_CONFIG, type ImageType } from '@/lib/constants/image.constants';
import { BusinessError } from '@/lib/errors';
import { validateImageFile, throwValidationError } from './validation.service';
import { generatePublicId } from './naming.service';

export interface UploadResult {
  publicId: string;
  secureUrl: string;
  variants: Record<string, string>;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

/**
 * Transformation URL'lerini oluşturur
 */
function generateVariantUrls(publicId: string, imageType: ImageType): Record<string, string> {
  const config = IMAGE_CONFIG[imageType];
  const variants: Record<string, string> = {};
  
  Object.entries(config.transformations).forEach(([variantName, transformation]) => {
    variants[variantName] = cloudinary.url(publicId, {
      ...transformation,
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp'
    });
  });
  
  return variants;
}

/**
 * Tek görsel yükleme - Ana fonksiyon
 */
export async function uploadImage(
  file: File,
  imageType: ImageType,
  entityId: string
): Promise<UploadResult> {
  try {
    // 1. Dosya validasyonu
    const validation = await validateImageFile(file, imageType);
    if (!validation.isValid) {
      throwValidationError(validation);
    }
    
    const config = IMAGE_CONFIG[imageType];
    const publicId = generatePublicId(imageType, entityId);
    
    // 2. Dosyayı buffer'a çevir
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;
    
    // 3. Cloudinary'e yükle
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: 'image',
      quality: 'auto',
      format: 'webp',
      overwrite: true,
      invalidate: true,
      transformation: [
        {
          width: config.dimensions.width,
          height: config.dimensions.height,
          crop: 'fill',
          quality: config.quality
        }
      ]
    });
    
    // 4. Variant URL'lerini oluştur
    const variants = generateVariantUrls(result.public_id, imageType);
    
    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      variants,
      metadata: {
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    };
    
  } catch (error) {
    // BusinessError'ları direkt fırlat
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Cloudinary hatalarını logla ve fırlat
    console.error('Cloudinary upload error:', error);
    throw new BusinessError(
      'Görsel yükleme başarısız oldu',
      'UPLOAD_FAILED'
    );
  }
}

/**
 * Görsel silme
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Transformation URL'i oluştur (existing image için)
 */
export function getImageUrl(
  publicId: string, 
  imageType: ImageType, 
  variant: string = 'main'
): string {
  const config = IMAGE_CONFIG[imageType];
  const transformation = config.transformations[variant];
  
  if (!transformation) {
    throw new BusinessError(
      `Transformation variant '${variant}' bulunamadı`,
      'INVALID_VARIANT'
    );
  }
  
  return cloudinary.url(publicId, {
    ...transformation,
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    format: 'webp'
  });
}

/**
 * Görsel değiştirme (eski sil, yeni yükle)
 */
export async function replaceImage(
  oldPublicId: string,
  newFile: File,
  imageType: ImageType,
  entityId: string
): Promise<UploadResult> {
  try {
    // 1. Yeni görseli yükle
    const uploadResult = await uploadImage(newFile, imageType, entityId);
    
    // 2. Eski görseli sil (async, hata vermese de devam eder)
    deleteImage(oldPublicId).catch(error => {
      console.warn('Eski görsel silinemedi:', error);
    });
    
    return uploadResult;
  } catch (error) {
    throw error;
  }
}

/**
 * Toplu silme (entity silindiğinde)
 */
export async function deleteImagesByEntity(
  entityId: string,
  entityType: 'user' | 'anime' | 'episode'
): Promise<void> {
  try {
    // Entity'e ait tüm görselleri bul
    const searchExpression = `public_id:*${entityType}_${entityId}_*`;
    const searchResult = await cloudinary.search
      .expression(searchExpression)
      .max_results(100)
      .execute();
    
    // Tüm görselleri sil
    const deletePromises = searchResult.resources.map((resource: any) => 
      deleteImage(resource.public_id)
    );
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Bulk delete error:', error);
    // Hata fırlatmıyoruz, sadece logluyoruz
  }
}
