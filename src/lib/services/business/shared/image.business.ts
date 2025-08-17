// Shared image business logic layer

import { 
  BusinessError
} from '@/lib/errors';
import { uploadImageToCloudinary } from '@/lib/services/cloudinary/upload';
import { 
  deleteImageByUrl as deleteCloudinaryImageByUrl,
  deleteImageByEntity
} from '@/lib/services/cloudinary/delete';
import { 
  generateResponsiveUrls,
  createOptimizedImageUrl,
  createThumbnailUrl 
} from '@/lib/services/cloudinary/transform';
import { logger } from '@/lib/utils/logger';
import { EVENTS_DOMAIN, CLOUDINARY_DOMAIN } from '@/lib/constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  UploadContext, 
  UploadImageResult, 
  DeleteImageResult,
  ImageCategory 
} from '@/lib/types/cloudinary';

import { 
  ImageUploadResult,
  ImageUrlsResult,
  ImageUploadOptions
} from '@/lib/types/image';

// Generic image upload business logic
export async function uploadImageBusiness(
  context: UploadContext,
  file: File,
  userId: string,
  options: ImageUploadOptions = {}
): Promise<ApiResponse<ImageUploadResult>> {
  try {
    // Delete old image if requested and URL exists
    if (options.deleteOld && options.oldImageUrl) {
      try {
        await deleteCloudinaryImageByUrl(options.oldImageUrl);
        await logger.info(
          EVENTS_DOMAIN.SYSTEM.IMAGE_DELETED,
          'Eski görsel başarıyla silindi',
          { 
            category: context.category, 
            entityId: context.entityId,
            oldImageUrl: options.oldImageUrl 
          },
          userId
        );
      } catch (deleteError) {
        // Log warning but don't fail the upload
        await logger.warn(
          EVENTS_DOMAIN.SYSTEM.IMAGE_DELETE_FAILED,
          'Eski görsel silinirken hata oluştu ama yüklemeye devam ediliyor',
          { 
            category: context.category, 
            entityId: context.entityId,
            oldImageUrl: options.oldImageUrl,
            error: deleteError instanceof Error ? deleteError.message : 'Bilinmeyen hata'
          },
          userId
        );
      }
    }

    // Upload new image
    const uploadResult = await uploadImageToCloudinary(file, context, {
      quality: options.quality,
      format: options.format,
    });

    if (!uploadResult.success || !uploadResult.data) {
      throw new BusinessError(uploadResult.error || 'Görsel yükleme başarısız oldu');
    }

    // Log successful upload
    await logger.info(
      EVENTS_DOMAIN.SYSTEM.IMAGE_UPLOADED,
      'Görsel başarıyla yüklendi',
      { 
        category: context.category, 
        entityId: context.entityId,
        secureUrl: uploadResult.data.secure_url,
        fileSize: uploadResult.data.bytes,
        dimensions: `${uploadResult.data.width}x${uploadResult.data.height}`
      },
      userId
    );

    return {
      success: true,
      data: {
        secureUrl: uploadResult.data.secure_url,
        publicId: uploadResult.data.public_id,
        width: uploadResult.data.width,
        height: uploadResult.data.height,
        format: uploadResult.data.format,
        bytes: uploadResult.data.bytes,
      }
    };
  } catch (error) {
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.IMAGE_UPLOAD_FAILED,
      'Görsel yükleme sırasında hata',
      { 
        category: context.category, 
        entityId: context.entityId,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        fileName: file.name,
        fileSize: file.size
      },
      userId
    );

    if (error instanceof BusinessError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Görsel yükleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Görsel yükleme başarısız');
  }
}

// Generic image delete business logic
export async function deleteImageBusiness(
  context: UploadContext,
  userId: string,
  imageUrl?: string | null
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    let deleteResult: DeleteImageResult;

    if (imageUrl) {
      // Delete by URL
      deleteResult = await deleteCloudinaryImageByUrl(imageUrl);
    } else {
      // Delete by entity (fallback)
      deleteResult = await deleteImageByEntity(context.category, context.entityId);
    }

    if (!deleteResult.success) {
      throw new BusinessError(deleteResult.error || 'Görsel silme başarısız oldu');
    }

    // Log successful deletion
    await logger.info(
      EVENTS_DOMAIN.SYSTEM.IMAGE_DELETED,
      'Görsel başarıyla silindi',
      { 
        category: context.category, 
        entityId: context.entityId,
        imageUrl: imageUrl || 'entity-based',
        result: deleteResult.result
      },
      userId
    );

    return {
      success: true,
      data: { deleted: deleteResult.result === 'ok' }
    };
  } catch (error) {
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.IMAGE_DELETE_FAILED,
      'Görsel silme sırasında hata',
      { 
        category: context.category, 
        entityId: context.entityId,
        imageUrl: imageUrl || 'entity-based',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      userId
    );

    if (error instanceof BusinessError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Görsel silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Görsel silme başarısız');
  }
}

// Görsel URL'lerini oluşturma
export async function getImageUrlsBusiness(
  imageUrl: string,
  category: ImageCategory,
  options: {
    includeThumbnail?: boolean;
    includeResponsive?: boolean;
    thumbnailSize?: number;
    optimizedWidth?: number;
    optimizedHeight?: number;
  } = {}
): Promise<ApiResponse<ImageUrlsResult>> {
  try {
    const {
      includeThumbnail = true,
      includeResponsive = false,
      thumbnailSize = 150,
      optimizedWidth,
      optimizedHeight
    } = options;

    const result: ImageUrlsResult = {
      original: imageUrl,
      thumbnail: includeThumbnail ? createThumbnailUrl(imageUrl, thumbnailSize) : imageUrl,
      optimized: createOptimizedImageUrl(imageUrl, {
        width: optimizedWidth,
        height: optimizedHeight,
        quality: 'auto',
        format: 'auto'
      })
    };

    // Generate responsive URLs if requested
    if (includeResponsive) {
      const responsiveCategory = category === CLOUDINARY_DOMAIN.CATEGORIES.USER_PROFILE ? CLOUDINARY_DOMAIN.CATEGORIES.USER_PROFILE 
        : category === CLOUDINARY_DOMAIN.CATEGORIES.ANIME_COVER ? CLOUDINARY_DOMAIN.CATEGORIES.ANIME_COVER 
        : null;

      if (responsiveCategory) {
        result.responsive = generateResponsiveUrls(imageUrl, responsiveCategory);
      }
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Görsel URL\'leri oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', imageUrl, category }
    );

    // If transformation fails, return original URLs
    return {
      success: true,
      data: {
        original: imageUrl,
        thumbnail: imageUrl,
        optimized: imageUrl
      }
    };
  }
}

// Helper function to create upload context
export function createImageUploadContext(
  category: ImageCategory,
  entityId: string,
  userId?: string
): UploadContext {
  return {
    category,
    entityId,
    userId
  };
}

// Helper functions for specific image categories
export const createUserProfileUploadContext = (entityId: string, userId?: string) =>
  createImageUploadContext(CLOUDINARY_DOMAIN.CATEGORIES.USER_PROFILE, entityId, userId);

export const createUserBannerUploadContext = (entityId: string, userId?: string) =>
  createImageUploadContext(CLOUDINARY_DOMAIN.CATEGORIES.USER_BANNER, entityId, userId);

export const createAnimeCoverUploadContext = (entityId: string, userId?: string) =>
  createImageUploadContext(CLOUDINARY_DOMAIN.CATEGORIES.ANIME_COVER, entityId, userId);

export const createAnimeBannerUploadContext = (entityId: string, userId?: string) =>
  createImageUploadContext(CLOUDINARY_DOMAIN.CATEGORIES.ANIME_BANNER, entityId, userId);

export const createEpisodeThumbnailUploadContext = (entityId: string, userId?: string) =>
  createImageUploadContext(CLOUDINARY_DOMAIN.CATEGORIES.EPISODE_THUMBNAIL, entityId, userId);

// Batch upload multiple images
export async function uploadMultipleImagesBusiness(
  uploads: Array<{
    context: UploadContext;
    file: File;
    options?: ImageUploadOptions;
  }>,
  userId: string
): Promise<ApiResponse<ImageUploadResult[]>> {
  try {
    const results: ImageUploadResult[] = [];
    const errors: string[] = [];

    // Process uploads sequentially to avoid overwhelming Cloudinary
    for (const upload of uploads) {
      try {
        const result = await uploadImageBusiness(
          upload.context,
          upload.file,
          userId,
          upload.options
        );
        
        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push(`${upload.context.category}-${upload.context.entityId}: ${result.error || 'Bilinmeyen hata'}`);
        }
      } catch (error) {
        errors.push(`${upload.context.category}-${upload.context.entityId}: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }

    if (errors.length > 0) {
      await logger.warn(
        EVENTS_DOMAIN.SYSTEM.BATCH_IMAGE_UPLOAD_PARTIAL_FAILURE,
        'Toplu görsel yükleme kısmen başarısız',
        { 
          successCount: results.length,
          errorCount: errors.length,
          errors: errors.slice(0, 5) // Log first 5 errors
        },
        userId
      );
    }

    return {
      success: true,
      data: results
    };
  } catch (error) {
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BATCH_IMAGE_UPLOAD_FAILED,
      'Toplu görsel yükleme tamamen başarısız',
      { 
        uploadCount: uploads.length,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      userId
    );

    throw new BusinessError('Toplu görsel yükleme başarısız');
  }
}
