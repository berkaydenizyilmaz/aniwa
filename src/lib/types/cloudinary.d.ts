// Cloudinary related type definitions

import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Base cloudinary response interface
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
}

// Upload options for different image types
export interface CloudinaryUploadOptions {
  folder: string;
  public_id?: string;
  transformation?: CloudinaryTransformation[];
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  overwrite?: boolean;
  unique_filename?: boolean;
  use_filename?: boolean;
  tags?: string[];
}

// Transformation options
export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit' | 'mfit' | 'mpad';
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  fetch_format?: 'auto';
  dpr?: 'auto' | number;
}

// Upload result types
export interface UploadImageResult {
  success: boolean;
  data?: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  error?: string;
}

// Delete result types
export interface DeleteImageResult {
  success: boolean;
  result?: 'ok' | 'not found';
  error?: string;
}

// Image format type based on allowed formats constant
export type AllowedImageFormat = typeof import('@/lib/constants/cloudinary.constants').ALLOWED_IMAGE_FORMATS[number];

// Image category types for folder organization
export type ImageCategory = 
  | 'USER_PROFILE' 
  | 'USER_BANNER' 
  | 'ANIME_COVER' 
  | 'ANIME_BANNER' 
  | 'EPISODE_THUMBNAIL';

// Upload context for different entities
export interface UploadContext {
  category: ImageCategory;
  entityId: string;
  userId?: string;
}

// Signed upload data
export interface SignedUploadData {
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
  public_id?: string;
}

// Cloudinary configuration
export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

// Image dimensions for different use cases
export interface ImageDimensions {
  width: number;
  height: number;
}

// Preset configurations for different image types
export interface ImagePresetConfig {
  dimensions: ImageDimensions;
  transformations: CloudinaryTransformation[];
  allowedFormats: readonly string[];
  maxSizeBytes: number;
}
