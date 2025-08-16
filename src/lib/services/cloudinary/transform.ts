// Cloudinary transformation operations

import { CloudinaryTransformation, ImageDimensions } from '@/lib/types/cloudinary';
import { RESPONSIVE_DIMENSIONS, RESPONSIVE_BREAKPOINTS, RESPONSIVE_SIZES, THUMBNAIL_SETTINGS } from '@/lib/constants/cloudinary.constants';

// Build transformation URL for existing image
export const buildTransformationUrl = (
  baseUrl: string,
  transformations: CloudinaryTransformation[]
): string => {
  try {
    // Parse the Cloudinary URL to extract parts
    const urlParts = baseUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    // Build transformation string
    const transformationStrings = transformations.map(transform => {
      const params = [];
      
      if (transform.width) params.push(`w_${transform.width}`);
      if (transform.height) params.push(`h_${transform.height}`);
      if (transform.crop) params.push(`c_${transform.crop}`);
      if (transform.gravity) params.push(`g_${transform.gravity}`);
      if (transform.quality) params.push(`q_${transform.quality}`);
      if (transform.format) params.push(`f_${transform.format}`);
      if (transform.fetch_format) params.push(`f_${transform.fetch_format}`);
      if (transform.dpr) params.push(`dpr_${transform.dpr}`);
      
      return params.join(',');
    });

    // Insert transformations into URL
    const beforeUpload = urlParts.slice(0, uploadIndex + 1);
    const afterUpload = urlParts.slice(uploadIndex + 1);
    
    const transformedUrl = [
      ...beforeUpload,
      ...transformationStrings,
      ...afterUpload
    ].join('/');

    return transformedUrl;
  } catch (error) {
    console.error('Transformation URL build failed:', error);
    return baseUrl; // Return original URL if transformation fails
  }
};

// Generate responsive image URLs
export const generateResponsiveUrls = (
  baseUrl: string,
  category: 'USER_PROFILE' | 'ANIME_COVER'
): Array<{ url: string; width: number; height: number }> => {
  const dimensions = RESPONSIVE_DIMENSIONS[category];
  
  if (!dimensions) {
    return [{ url: baseUrl, width: 0, height: 0 }];
  }

  return dimensions.map(({ width, height }) => {
    const transformation: CloudinaryTransformation = {
      width,
      height,
      crop: 'fill',
      gravity: category === 'USER_PROFILE' ? 'face' : 'center',
      quality: 'auto',
      format: 'auto',
      fetch_format: 'auto',
      dpr: 'auto',
    };

    return {
      url: buildTransformationUrl(baseUrl, [transformation]),
      width,
      height,
    };
  });
};

// Generate srcSet string for responsive images
export const generateSrcSet = (
  baseUrl: string,
  category: 'USER_PROFILE' | 'ANIME_COVER'
): string => {
  const responsiveUrls = generateResponsiveUrls(baseUrl, category);
  
  return responsiveUrls
    .map(({ url, width }) => `${url} ${width}w`)
    .join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = (category: 'USER_PROFILE' | 'ANIME_COVER'): string => {
  const breakpoints = RESPONSIVE_BREAKPOINTS;
  const sizes = RESPONSIVE_SIZES[category];
  
  if (!sizes) {
    return '100vw';
  }
  
  return `(max-width: ${breakpoints.MOBILE}px) ${sizes.MOBILE}px, (max-width: ${breakpoints.TABLET}px) ${sizes.TABLET}px, ${sizes.DESKTOP}px`;
};

// Create optimized image URL for specific use case
export const createOptimizedImageUrl = (
  baseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit';
    gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces';
    dpr?: number | 'auto';
  } = {}
): string => {
  const transformation: CloudinaryTransformation = {
    quality: 'auto',
    format: 'auto',
    fetch_format: 'auto',
    dpr: 'auto',
    ...options,
  };

  return buildTransformationUrl(baseUrl, [transformation]);
};

// Create thumbnail URL
export const createThumbnailUrl = (
  baseUrl: string,
  size: number = THUMBNAIL_SETTINGS.DEFAULT_SIZE
): string => {
  return createOptimizedImageUrl(baseUrl, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'center',
    quality: 'auto',
    format: 'auto',
  });
};

// Create blurred placeholder URL
export const createPlaceholderUrl = (
  baseUrl: string,
  blur: number = THUMBNAIL_SETTINGS.PLACEHOLDER.BLUR
): string => {
  const transformation: CloudinaryTransformation = {
    width: THUMBNAIL_SETTINGS.PLACEHOLDER.SIZE,
    height: THUMBNAIL_SETTINGS.PLACEHOLDER.SIZE,
    crop: 'fill',
    quality: 30,
    format: 'auto',
  };

  // Add blur effect - Note: blur transformation syntax might need adjustment based on Cloudinary API
  const transformationString = `w_50,h_50,c_fill,q_30,f_auto,e_blur:${blur}`;
  
  try {
    const urlParts = baseUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return baseUrl;
    }

    const beforeUpload = urlParts.slice(0, uploadIndex + 1);
    const afterUpload = urlParts.slice(uploadIndex + 1);
    
    return [
      ...beforeUpload,
      transformationString,
      ...afterUpload
    ].join('/');
  } catch (error) {
    return baseUrl;
  }
};

// Extract image metadata from Cloudinary URL
export const extractImageMetadata = (cloudinaryUrl: string): {
  publicId: string;
  version: string;
  format: string;
} | null => {
  try {
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return null;
    }

    const pathParts = urlParts.slice(uploadIndex + 1);
    
    // Extract version (v123456)
    const version = pathParts[0]?.startsWith('v') ? pathParts[0] : '';
    
    // Extract public ID and format
    const publicIdParts = version ? pathParts.slice(1) : pathParts;
    const publicIdWithFormat = publicIdParts.join('/');
    
    const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
    const publicId = lastDotIndex > 0 
      ? publicIdWithFormat.substring(0, lastDotIndex)
      : publicIdWithFormat;
    const format = lastDotIndex > 0 
      ? publicIdWithFormat.substring(lastDotIndex + 1)
      : '';

    return {
      publicId,
      version,
      format,
    };
  } catch (error) {
    console.error('Failed to extract image metadata:', error);
    return null;
  }
};
