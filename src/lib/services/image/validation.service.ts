// Dosya validasyon fonksiyonları

import { IMAGE_CONFIG, type ImageType } from '@/lib/constants/image.constants';
import { BusinessError } from '@/lib/errors';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: string;
}

/**
 * Dosya boyutunu valide eder
 */
export function validateFileSize(file: File, imageType: ImageType): ValidationResult {
  const config = IMAGE_CONFIG[imageType];
  
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz`,
      errorCode: 'FILE_TOO_LARGE'
    };
  }
  
  return { isValid: true };
}

/**
 * Dosya formatını valide eder
 */
export function validateFileFormat(file: File, imageType: ImageType): ValidationResult {
  const config = IMAGE_CONFIG[imageType];
  
  // MIME type kontrolü
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Sadece resim dosyaları yüklenebilir',
      errorCode: 'INVALID_FILE_TYPE'
    };
  }
  
  // Dosya uzantısı kontrolü
  const fileName = file.name.toLowerCase();
  const hasValidExtension = config.allowedFormats.some(format => 
    fileName.endsWith(`.${format}`)
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Sadece ${config.allowedFormats.join(', ')} formatları desteklenir`,
      errorCode: 'INVALID_FILE_FORMAT'
    };
  }
  
  return { isValid: true };
}

/**
 * Dosya boyutlarını valide eder (client-side)
 */
export function validateImageDimensions(
  file: File, 
  imageType: ImageType
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const config = IMAGE_CONFIG[imageType];
    const img = new Image();
    
    img.onload = () => {
      // Min boyut kontrolü (çok küçük resimler kabul edilmez)
      const minWidth = config.dimensions.width * 0.5;
      const minHeight = config.dimensions.height * 0.5;
      
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          isValid: false,
          error: `Resim en az ${Math.round(minWidth)}x${Math.round(minHeight)} piksel olmalıdır`,
          errorCode: 'IMAGE_TOO_SMALL'
        });
        return;
      }
      
      // Max boyut kontrolü (çok büyük resimler performans sorunu)
      const maxWidth = config.dimensions.width * 4;
      const maxHeight = config.dimensions.height * 4;
      
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          isValid: false,
          error: `Resim en fazla ${maxWidth}x${maxHeight} piksel olabilir`,
          errorCode: 'IMAGE_TOO_LARGE'
        });
        return;
      }
      
      resolve({ isValid: true });
    };
    
    img.onerror = () => {
      resolve({
        isValid: false,
        error: 'Resim dosyası bozuk veya geçersiz',
        errorCode: 'INVALID_IMAGE_FILE'
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Tüm validasyonları tek seferde yapar
 */
export async function validateImageFile(
  file: File, 
  imageType: ImageType
): Promise<ValidationResult> {
  // 1. Dosya boyutu kontrolü
  const sizeValidation = validateFileSize(file, imageType);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  // 2. Dosya formatı kontrolü
  const formatValidation = validateFileFormat(file, imageType);
  if (!formatValidation.isValid) {
    return formatValidation;
  }
  
  // 3. Resim boyutları kontrolü
  const dimensionsValidation = await validateImageDimensions(file, imageType);
  if (!dimensionsValidation.isValid) {
    return dimensionsValidation;
  }
  
  return { isValid: true };
}

/**
 * Validasyon hatası fırlatır
 */
export function throwValidationError(result: ValidationResult): never {
  throw new BusinessError(
    result.error || 'Dosya validasyon hatası',
    result.errorCode || 'VALIDATION_ERROR'
  );
}

/**
 * Quick validation (async olmadan sadece temel kontroller)
 */
export function quickValidateFile(file: File, imageType: ImageType): ValidationResult {
  // Dosya boyutu
  const sizeValidation = validateFileSize(file, imageType);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  // Dosya formatı
  const formatValidation = validateFileFormat(file, imageType);
  if (!formatValidation.isValid) {
    return formatValidation;
  }
  
  return { isValid: true };
}
