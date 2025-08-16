// Image business operation types

// Image upload result interface
export interface ImageUploadResult {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Image URLs result interface
export interface ImageUrlsResult {
  original: string;
  thumbnail: string;
  optimized: string;
  responsive?: Array<{ url: string; width: number; height: number }>;
}

// Upload options interface
export interface ImageUploadOptions {
  deleteOld?: boolean;
  oldImageUrl?: string | null;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}
