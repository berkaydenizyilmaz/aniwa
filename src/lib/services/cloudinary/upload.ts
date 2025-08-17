// Cloudinary upload operations

import { getCloudinaryInstance } from './config';
import { 
  CloudinaryUploadOptions, 
  UploadImageResult, 
  ImageCategory, 
  UploadContext,
  SignedUploadData,
  CloudinaryUploadResponse,
  AllowedImageFormat
} from '@/lib/types/cloudinary';
import { 
  CLOUDINARY_DOMAIN,
  IMAGE_PRESET_CONFIGS, 
  CLOUDINARY_ERROR_MESSAGES 
} from '@/lib/constants/domains/cloudinary';
import { BusinessError } from '@/lib/errors/index';

// Get folder path based on image category and entity ID
const getFolderPath = (category: ImageCategory, entityId: string): string => {
  switch (category) {
    case CLOUDINARY_DOMAIN.CATEGORIES.USER_PROFILE:
      return `${CLOUDINARY_DOMAIN.FOLDERS.USERS.PROFILES}/${entityId}`;
    case CLOUDINARY_DOMAIN.CATEGORIES.USER_BANNER:
      return `${CLOUDINARY_DOMAIN.FOLDERS.USERS.BANNERS}/${entityId}`;
    case CLOUDINARY_DOMAIN.CATEGORIES.ANIME_COVER:
      return `${CLOUDINARY_DOMAIN.FOLDERS.ANIME.SERIES.COVERS}/${entityId}`;
    case CLOUDINARY_DOMAIN.CATEGORIES.ANIME_BANNER:
      return `${CLOUDINARY_DOMAIN.FOLDERS.ANIME.SERIES.BANNERS}/${entityId}`;
    case CLOUDINARY_DOMAIN.CATEGORIES.EPISODE_THUMBNAIL:
      return `${CLOUDINARY_DOMAIN.FOLDERS.ANIME.EPISODES.THUMBNAILS}/${entityId}`;
    default:
      throw new BusinessError(`Desteklenmeyen görsel kategorisi: ${category}`);
  }
};

// Get public ID for image
const getPublicId = (category: ImageCategory, entityId: string): string => {
  const folder = getFolderPath(category, entityId);
  
  switch (category) {
    case CLOUDINARY_DOMAIN.CATEGORIES.USER_PROFILE:
      return `${folder}/avatar`;
    case CLOUDINARY_DOMAIN.CATEGORIES.USER_BANNER:
      return `${folder}/banner`;
    case CLOUDINARY_DOMAIN.CATEGORIES.ANIME_COVER:
      return `${folder}/cover`;
    case CLOUDINARY_DOMAIN.CATEGORIES.ANIME_BANNER:
      return `${folder}/banner`;
    case CLOUDINARY_DOMAIN.CATEGORIES.EPISODE_THUMBNAIL:
      return `${folder}/thumbnail`;
    default:
      throw new BusinessError(`Desteklenmeyen görsel kategorisi: ${category}`);
  }
};



// Validate file before upload
const validateFile = (file: File, category: ImageCategory): void => {
  const config = IMAGE_PRESET_CONFIGS[category as keyof typeof IMAGE_PRESET_CONFIGS];
  
  if (!config) {
    throw new BusinessError(CLOUDINARY_ERROR_MESSAGES.INVALID_FORMAT);
  }

  // Check file size
  if (file.size > config.sizeLimit) {
    throw new BusinessError(CLOUDINARY_ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !config.allowedFormats.includes(fileExtension as AllowedImageFormat)) {
    throw new BusinessError(CLOUDINARY_ERROR_MESSAGES.INVALID_FORMAT);
  }
};

// Generate signed upload parameters
export const generateSignedUploadParams = async (
  context: UploadContext
): Promise<SignedUploadData> => {
  try {
    const cloudinary = getCloudinaryInstance();
    const folder = getFolderPath(context.category, context.entityId);
    const publicId = getPublicId(context.category, context.entityId);

    
    const timestamp = Math.round(Date.now() / 1000);
    
    const paramsToSign = {
      timestamp,
      folder,
      public_id: publicId,
      overwrite: true,
      unique_filename: false,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      folder,
      public_id: publicId,
    };
  } catch (error) {
    console.error('Signed upload params generation failed:', error);
    throw new BusinessError(CLOUDINARY_ERROR_MESSAGES.UPLOAD_FAILED);
  }
};

// Upload image to Cloudinary (server-side)
export const uploadImageToCloudinary = async (
  file: File,
  context: UploadContext,
  options?: Partial<CloudinaryUploadOptions>
): Promise<UploadImageResult> => {
  try {
    // Validate file
    validateFile(file, context.category);

    const cloudinary = getCloudinaryInstance();
    const folder = getFolderPath(context.category, context.entityId);
    const publicId = getPublicId(context.category, context.entityId);
    
    // Get transformation config for the category
    const categoryKey = context.category.toUpperCase().replace('-', '_') as keyof typeof IMAGE_PRESET_CONFIGS;
    const config = IMAGE_PRESET_CONFIGS[categoryKey];

    // Convert File to buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload options
    const uploadOptions: CloudinaryUploadOptions = {
      folder,
      public_id: publicId,
      resource_type: 'auto',
      quality: 'auto',
      format: 'auto',
      overwrite: true,
      unique_filename: false,
      transformation: config.transformations,
      tags: [context.category, `entity-${context.entityId}`],
      ...options,
    };

    // Add user ID tag if available
    if (context.userId) {
      uploadOptions.tags?.push(`user-${context.userId}`);
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    }) as CloudinaryUploadResponse;

    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    
    if (error instanceof BusinessError) {
      throw error;
    }

    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.UPLOAD_FAILED,
    };
  }
};

// Upload image from URL (server-side)
export const uploadImageFromUrl = async (
  imageUrl: string,
  context: UploadContext,
  options?: Partial<CloudinaryUploadOptions>
): Promise<UploadImageResult> => {
  try {
    const cloudinary = getCloudinaryInstance();
    const folder = getFolderPath(context.category, context.entityId);
    const publicId = getPublicId(context.category, context.entityId);

    
    // Get transformation config for the category
    const categoryKey = context.category.toUpperCase().replace('-', '_') as keyof typeof IMAGE_PRESET_CONFIGS;
    const config = IMAGE_PRESET_CONFIGS[categoryKey];

    // Upload options
    const uploadOptions: CloudinaryUploadOptions = {
      folder,
      public_id: publicId,

      resource_type: 'auto',
      quality: 'auto',
      format: 'auto',
      overwrite: true,
      unique_filename: false,
      transformation: config.transformations,
      tags: [context.category, `entity-${context.entityId}`],
      ...options,
    };

    // Add user ID tag if available
    if (context.userId) {
      uploadOptions.tags?.push(`user-${context.userId}`);
    }

    // Upload from URL
    const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    };
  } catch (error) {
    console.error('Cloudinary URL upload failed:', error);
    
    return {
      success: false,
      error: CLOUDINARY_ERROR_MESSAGES.UPLOAD_FAILED,
    };
  }
};
