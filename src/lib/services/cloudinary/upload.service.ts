import cloudinary from '@/lib/cloudinary';
import { CLOUDINARY } from '@/lib/constants/cloudinary.constants';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface UploadAnimeImagesResult {
  coverImage?: CloudinaryUploadResult;
  bannerImage?: CloudinaryUploadResult;
}

export interface UploadEpisodeThumbnailResult {
  thumbnailImage?: CloudinaryUploadResult;
}

export interface UploadUserImagesResult {
  avatar?: CloudinaryUploadResult;
  banner?: CloudinaryUploadResult;
}

export class UploadService {
  /**
   * Dosya yükleme (genel)
   */
  private static async uploadFile(
    file: Buffer,
    config: typeof CLOUDINARY.CONFIGS[keyof typeof CLOUDINARY.CONFIGS],
    publicId: string
  ): Promise<CloudinaryUploadResult> {
    try {
      // MIME tespit et (JPEG/PNG/WebP)
      const header = file.subarray(0, 4);
      const isJPEG = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
      const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
      const isWebP = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
      const mime = isJPEG ? 'image/jpeg' : isPNG ? 'image/png' : isWebP ? 'image/webp' : 'application/octet-stream';

      // Cloudinary base64 upload için Data URI bekler; buffer'ı doğru prefix ile gönder
      const base64 = file.toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: config.folder,
        public_id: publicId,
        resource_type: 'image',
        transformation: {
          width: config.width,
          height: config.height,
          crop: 'fill',
          quality: 'auto',
          format: 'webp',
        },
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Dosya yüklenirken hata oluştu');
    }
  }

  /**
   * Dosya silme
   */
  private static async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  /**
   * Public ID ile sil (public API)
   */
  static async deleteByPublicId(publicId: string): Promise<boolean> {
    return this.deleteFile(publicId);
  }

  /**
   * Anime resimlerini yükle
   */
  static async uploadAnimeImages(
    coverFile?: File,
    bannerFile?: File,
    animeId: string = 'temp'
  ): Promise<UploadAnimeImagesResult> {
    const result: UploadAnimeImagesResult = {};
    const timestamp = Date.now();

    try {
      // Kapak resmi yükle
      if (coverFile) {
        const buffer = Buffer.from(await coverFile.arrayBuffer());
        const publicId = `aniwa/anime/covers/${animeId}_${timestamp}`;
        result.coverImage = await this.uploadFile(buffer, CLOUDINARY.CONFIGS.ANIME_COVER, publicId);
      }

      // Banner resmi yükle
      if (bannerFile) {
        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        const publicId = `aniwa/anime/banners/${animeId}_${timestamp}`;
        result.bannerImage = await this.uploadFile(buffer, CLOUDINARY.CONFIGS.ANIME_BANNER, publicId);
      }

      return result;
    } catch (error) {
      // Hata durumunda yüklenen dosyaları temizle
      if (result.coverImage) {
        await this.deleteFile(result.coverImage.publicId);
      }
      if (result.bannerImage) {
        await this.deleteFile(result.bannerImage.publicId);
      }
      throw error;
    }
  }

  /**
   * Anime resimlerini sil
   */
  static async deleteAnimeImages(animeId: string): Promise<void> {
    try {
      // Anime ID'si ile başlayan tüm resimleri bul ve sil
      const coverResult = await cloudinary.search
        .expression(`folder:aniwa/anime/covers AND public_id:aniwa/anime/covers/${animeId}_*`)
        .execute();
      
      const bannerResult = await cloudinary.search
        .expression(`folder:aniwa/anime/banners AND public_id:aniwa/anime/banners/${animeId}_*`)
        .execute();

      // Cover resimlerini sil
      for (const resource of coverResult.resources) {
        await this.deleteFile(resource.public_id);
      }

      // Banner resimlerini sil
      for (const resource of bannerResult.resources) {
        await this.deleteFile(resource.public_id);
      }
    } catch (error) {
      console.error('Anime images delete error:', error);
    }
  }

  /**
   * Anime serisine ait tüm episode thumbnail'lerini sil
   */
  static async deleteEpisodeThumbnailsByAnimeSeries(animeSeriesId: string): Promise<void> {
    try {
      const result = await cloudinary.search
        .expression(`folder:aniwa/episodes/thumbnails AND public_id:aniwa/episodes/thumbnails/${animeSeriesId}_*`)
        .execute();

      for (const resource of result.resources) {
        await this.deleteFile(resource.public_id);
      }
    } catch (error) {
      console.error('Anime series episode thumbnails delete error:', error);
    }
  }

  /**
   * Episode thumbnail yükle
   */
  static async uploadEpisodeThumbnail(
    thumbnailFile: File,
    episodeId: string
  ): Promise<UploadEpisodeThumbnailResult> {
    const result: UploadEpisodeThumbnailResult = {};
    const timestamp = Date.now();

    try {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const publicId = `aniwa/episodes/thumbnails/${episodeId}_${timestamp}`;
      result.thumbnailImage = await this.uploadFile(buffer, CLOUDINARY.CONFIGS.EPISODE_THUMBNAIL, publicId);

      return result;
    } catch (error) {
      // Hata durumunda yüklenen dosyaları temizle
      if (result.thumbnailImage) {
        await this.deleteFile(result.thumbnailImage.publicId);
      }
      throw error;
    }
  }

  /**
   * Episode thumbnail sil
   */
  static async deleteEpisodeThumbnail(episodeId: string): Promise<void> {
    try {
      const result = await cloudinary.search
        .expression(`folder:aniwa/episodes/thumbnails AND public_id:aniwa/episodes/thumbnails/${episodeId}_*`)
        .execute();

      for (const resource of result.resources) {
        await this.deleteFile(resource.public_id);
      }
    } catch (error) {
      console.error('Episode thumbnail delete error:', error);
    }
  }

  /**
   * Media part'a ait tüm episode thumbnail'lerini sil
   */
  static async deleteEpisodeThumbnailsByMediaPart(mediaPartId: string): Promise<void> {
    try {
      const result = await cloudinary.search
        .expression(`folder:aniwa/episodes/thumbnails AND public_id:aniwa/episodes/thumbnails/${mediaPartId}_*`)
        .execute();

      for (const resource of result.resources) {
        await this.deleteFile(resource.public_id);
      }
    } catch (error) {
      console.error('Media part episode thumbnails delete error:', error);
    }
  }

  /**
   * Kullanıcı resimlerini yükle
   */
  static async uploadUserImages(
    avatarFile?: File,
    bannerFile?: File,
    userId: string = 'temp'
  ): Promise<UploadUserImagesResult> {
    const result: UploadUserImagesResult = {};
    const timestamp = Date.now();

    try {
      // Avatar yükle
      if (avatarFile) {
        const buffer = Buffer.from(await avatarFile.arrayBuffer());
        const publicId = `aniwa/users/avatars/${userId}_${timestamp}`;
        result.avatar = await this.uploadFile(buffer, CLOUDINARY.CONFIGS.USER_AVATAR, publicId);
      }

      // Banner yükle
      if (bannerFile) {
        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        const publicId = `aniwa/users/banners/${userId}_${timestamp}`;
        result.banner = await this.uploadFile(buffer, CLOUDINARY.CONFIGS.USER_BANNER, publicId);
      }

      return result;
    } catch (error) {
      // Hata durumunda yüklenen dosyaları temizle
      if (result.avatar) {
        await this.deleteFile(result.avatar.publicId);
      }
      if (result.banner) {
        await this.deleteFile(result.banner.publicId);
      }
      throw error;
    }
  }

  /**
   * Kullanıcı resimlerini sil
   */
  static async deleteUserImages(userId: string): Promise<void> {
    try {
      const avatarResult = await cloudinary.search
        .expression(`folder:aniwa/users/avatars AND public_id:aniwa/users/avatars/${userId}_*`)
        .execute();
      
      const bannerResult = await cloudinary.search
        .expression(`folder:aniwa/users/banners AND public_id:aniwa/users/banners/${userId}_*`)
        .execute();

      // Avatar resimlerini sil
      for (const resource of avatarResult.resources) {
        await this.deleteFile(resource.public_id);
      }

      // Banner resimlerini sil
      for (const resource of bannerResult.resources) {
        await this.deleteFile(resource.public_id);
      }
    } catch (error) {
      console.error('User images delete error:', error);
    }
  }

  /**
   * Cloudinary URL'den public ID çıkarma
   */
  static extractPublicIdFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
        return null;
      }
      
      const publicIdParts = urlParts.slice(uploadIndex + 2);
      const filteredParts = publicIdParts.filter(part => !part.startsWith('v'));
      
      if (filteredParts.length === 0) {
        return null;
      }
      
      const publicId = filteredParts.join('/').split('.')[0];
      return publicId || null;
    } catch (error) {
      console.error('Public ID extraction error:', error);
      return null;
    }
  }

  /**
   * Dosya formatını kontrol et
   */
  static validateImageFile(file: Buffer, maxSize: number = CLOUDINARY.CONFIGS.ANIME_COVER.maxSize): boolean {
    // Dosya boyutu kontrolü
    if (file.length > maxSize) {
      throw new Error(`Dosya boyutu ${Math.round(maxSize / 1024 / 1024)}MB'dan büyük olamaz`);
    }

    // Dosya formatı kontrolü
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