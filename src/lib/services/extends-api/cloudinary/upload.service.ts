import { CloudinaryService, CloudinaryUploadResult } from './cloudinary.service';

export interface UploadAnimeImagesResult {
  coverImage?: CloudinaryUploadResult;
  bannerImage?: CloudinaryUploadResult;
}

export interface UploadUserImagesResult {
  avatar?: CloudinaryUploadResult;
  banner?: CloudinaryUploadResult;
}

export class UploadService {
  /**
   * Anime resimlerini yükle
   */
  static async uploadAnimeImages(
    coverFile?: Buffer,
    bannerFile?: Buffer,
    animeId: string = 'temp'
  ): Promise<UploadAnimeImagesResult> {
    const result: UploadAnimeImagesResult = {};

    try {
      // Kapak resmi yükle
      if (coverFile) {
        result.coverImage = await CloudinaryService.uploadAnimeCover(coverFile, animeId);
      }

      // Banner resmi yükle
      if (bannerFile) {
        result.bannerImage = await CloudinaryService.uploadAnimeBanner(bannerFile, animeId);
      }

      return result;
    } catch (error) {
      // Hata durumunda yüklenen dosyaları temizle
      if (result.coverImage) {
        await CloudinaryService.deleteFile(result.coverImage.publicId);
      }
      if (result.bannerImage) {
        await CloudinaryService.deleteFile(result.bannerImage.publicId);
      }
      throw error;
    }
  }

  /**
   * Kullanıcı resimlerini yükle
   */
  static async uploadUserImages(
    avatarFile?: Buffer,
    bannerFile?: Buffer,
    userId: string = 'temp'
  ): Promise<UploadUserImagesResult> {
    const result: UploadUserImagesResult = {};

    try {
      // Avatar yükle
      if (avatarFile) {
        result.avatar = await CloudinaryService.uploadUserAvatar(avatarFile, userId);
      }

      // Banner yükle
      if (bannerFile) {
        result.banner = await CloudinaryService.uploadUserBanner(bannerFile, userId);
      }

      return result;
    } catch (error) {
      // Hata durumunda yüklenen dosyaları temizle
      if (result.avatar) {
        await CloudinaryService.deleteFile(result.avatar.publicId);
      }
      if (result.banner) {
        await CloudinaryService.deleteFile(result.banner.publicId);
      }
      throw error;
    }
  }

  /**
   * Dosya formatını kontrol et
   */
  static validateImageFile(file: Buffer, maxSize: number = 5 * 1024 * 1024): boolean {
    // Dosya boyutu kontrolü
    if (file.length > maxSize) {
      throw new Error(`Dosya boyutu ${Math.round(maxSize / 1024 / 1024)}MB'dan büyük olamaz`);
    }

    // Dosya formatı kontrolü (basit kontrol)
    const header = file.subarray(0, 4);
    const isJPEG = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
    const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    const isWebP = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;

    if (!isJPEG && !isPNG && !isWebP) {
      throw new Error('Sadece JPEG, PNG ve WebP formatları desteklenir');
    }

    return true;
  }

  /**
   * Base64'ten Buffer'a çevir
   */
  static base64ToBuffer(base64: string): Buffer {
    // Data URL formatını kontrol et
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Geçersiz base64 formatı');
    }

    const buffer = Buffer.from(matches[2], 'base64');
    return buffer;
  }

  /**
   * Dosya boyutunu formatla
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 