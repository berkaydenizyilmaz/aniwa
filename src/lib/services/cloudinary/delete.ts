// Cloudinary delete operations

import { getCloudinaryInstance } from './config';
import { DeleteImageResult, ImageCategory } from '@/lib/types/cloudinary';
import { CLOUDINARY_ERROR_MESSAGES } from '@/lib/constants/cloudinary.constants';
import { BusinessError } from '@/lib/errors/index';

// Get public ID from secure URL
const getPublicIdFromUrl = (secureUrl: string): string => {
  try {
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/public_id.format
    const urlParts = secureUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    // Get everything after version (v123456)
    const pathParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
    const publicIdWithFormat = pathParts.join('/');
    
    // Remove file extension
    const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
    const publicId = lastDotIndex > 0 
      ? publicIdWithFormat.substring(0, lastDotIndex)
      : publicIdWithFormat;

    return publicId;
  } catch (error) {
    throw new BusinessError('Geçersiz Cloudinary URL formatı');
  }
};

// Get public ID for image category and entity
const getPublicIdForEntity = (category: ImageCategory, entityId: string): string => {
  switch (category) {
    case 'user-profile':
      return `aniwa/users/profiles/${entityId}/avatar`;
    case 'user-banner':
      return `aniwa/users/banners/${entityId}/banner`;
    case 'anime-cover':
      return `aniwa/anime/series/covers/${entityId}/cover`;
    case 'anime-banner':
      return `aniwa/anime/series/banners/${entityId}/banner`;
    case 'episode-thumbnail':
      return `aniwa/anime/episodes/thumbnails/${entityId}/thumbnail`;
    default:
      throw new BusinessError(`Desteklenmeyen görsel kategorisi: ${category}`);
  }
};

// Delete image by public ID
export const deleteImageByPublicId = async (publicId: string): Promise<DeleteImageResult> => {
  try {
    const cloudinary = getCloudinaryInstance();
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    return {
      success: true,
      result: result.result as 'ok' | 'not found',
    };
  } catch (error) {
    console.error('Cloudinary delete by public ID failed:', error);
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
};

// Delete image by secure URL
export const deleteImageByUrl = async (secureUrl: string): Promise<DeleteImageResult> => {
  try {
    const publicId = getPublicIdFromUrl(secureUrl);
    return await deleteImageByPublicId(publicId);
  } catch (error) {
    console.error('Cloudinary delete by URL failed:', error);
    
    if (error instanceof BusinessError) {
      throw error;
    }
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
};

// Delete image by category and entity ID
export const deleteImageByEntity = async (
  category: ImageCategory, 
  entityId: string
): Promise<DeleteImageResult> => {
  try {
    const publicId = getPublicIdForEntity(category, entityId);
    return await deleteImageByPublicId(publicId);
  } catch (error) {
    console.error('Cloudinary delete by entity failed:', error);
    
    if (error instanceof BusinessError) {
      throw error;
    }
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
};

// Delete multiple images by public IDs
export const deleteMultipleImages = async (publicIds: string[]): Promise<DeleteImageResult[]> => {
  try {
    const cloudinary = getCloudinaryInstance();
    
    const deletePromises = publicIds.map(async (publicId) => {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
          success: true,
          result: result.result as 'ok' | 'not found',
        };
      } catch (error) {
        return {
          success: false,
          error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
        };
      }
    });

    return await Promise.all(deletePromises);
  } catch (error) {
    console.error('Cloudinary batch delete failed:', error);
    
    // Return failure for all if batch operation fails
    return publicIds.map(() => ({
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    }));
  }
};

// Delete all images in a folder (for cleanup operations)
export const deleteImagesByFolder = async (folderPath: string): Promise<DeleteImageResult> => {
  try {
    const cloudinary = getCloudinaryInstance();
    
    // List all resources in the folder
    const listResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 500, // Cloudinary limit
    });

    if (listResult.resources.length === 0) {
      return {
        success: true,
        result: 'not found',
      };
    }

    // Extract public IDs
    const publicIds = listResult.resources.map((resource: { public_id: string }) => resource.public_id);

    // Delete all images in batches (Cloudinary supports up to 100 per batch)
    const batchSize = 100;
    const deletePromises = [];

    for (let i = 0; i < publicIds.length; i += batchSize) {
      const batch = publicIds.slice(i, i + batchSize);
      deletePromises.push(
        cloudinary.api.delete_resources(batch)
      );
    }

    await Promise.all(deletePromises);

    return {
      success: true,
      result: 'ok',
    };
  } catch (error) {
    console.error('Cloudinary folder delete failed:', error);
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
};

// Delete folder (after all images are deleted)
export const deleteFolder = async (folderPath: string): Promise<DeleteImageResult> => {
  try {
    const cloudinary = getCloudinaryInstance();
    
    // First delete all images in the folder
    const imagesDeleted = await deleteImagesByFolder(folderPath);
    
    if (!imagesDeleted.success) {
      return imagesDeleted;
    }

    // Then delete the folder itself
    await cloudinary.api.delete_folder(folderPath);

    return {
      success: true,
      result: 'ok',
    };
  } catch (error) {
    console.error('Cloudinary folder deletion failed:', error);
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.DELETE_FAILED,
    };
  }
};
