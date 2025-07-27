import { v2 as cloudinary } from 'cloudinary';

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: Record<string, unknown>;
  resourceType?: 'image' | 'video' | 'raw';
}

export class CloudinaryService {
  /**
   * Dosya yükleme
   */
  static async uploadFile(
    file: Buffer | string,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'aniwa',
        public_id: options.publicId,
        transformation: options.transformation,
        resource_type: options.resourceType || 'image',
      };

      const result = await cloudinary.uploader.upload(file as string, uploadOptions);

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
  static async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  /**
   * Anime kapak resmi yükleme
   */
  static async uploadAnimeCover(
    file: Buffer,
    animeId: string,
    timestamp: number = Date.now()
  ): Promise<CloudinaryUploadResult> {
    const publicId = `aniwa/anime/covers/${animeId}_${timestamp}`;
    
    return this.uploadFile(file, {
      folder: 'aniwa/anime/covers',
      publicId,
      transformation: {
        width: 400,
        height: 600,
        crop: 'fill',
        quality: 'auto',
      },
    });
  }

  /**
   * Anime banner resmi yükleme
   */
  static async uploadAnimeBanner(
    file: Buffer,
    animeId: string,
    timestamp: number = Date.now()
  ): Promise<CloudinaryUploadResult> {
    const publicId = `aniwa/anime/banners/${animeId}_${timestamp}`;
    
    return this.uploadFile(file, {
      folder: 'aniwa/anime/banners',
      publicId,
      transformation: {
        width: 1200,
        height: 400,
        crop: 'fill',
        quality: 'auto',
      },
    });
  }

  /**
   * Kullanıcı avatar yükleme
   */
  static async uploadUserAvatar(
    file: Buffer,
    userId: string,
    timestamp: number = Date.now()
  ): Promise<CloudinaryUploadResult> {
    const publicId = `aniwa/users/avatars/${userId}_${timestamp}`;
    
    return this.uploadFile(file, {
      folder: 'aniwa/users/avatars',
      publicId,
      transformation: {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
      },
    });
  }

  /**
   * Kullanıcı banner yükleme
   */
  static async uploadUserBanner(
    file: Buffer,
    userId: string,
    timestamp: number = Date.now()
  ): Promise<CloudinaryUploadResult> {
    const publicId = `aniwa/users/banners/${userId}_${timestamp}`;
    
    return this.uploadFile(file, {
      folder: 'aniwa/users/banners',
      publicId,
      transformation: {
        width: 800,
        height: 200,
        crop: 'fill',
        quality: 'auto',
      },
    });
  }
} 