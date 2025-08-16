// Cloudinary configuration and initialization

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '@/lib/types/cloudinary';

// Initialize Cloudinary configuration
const initializeCloudinary = (): CloudinaryConfig => {
  const config: CloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
  };

  // Validate required environment variables
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Missing required Cloudinary environment variables');
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
    secure: config.secure,
  });

  return config;
};

// Get Cloudinary configuration
export const getCloudinaryConfig = (): CloudinaryConfig => {
  return initializeCloudinary();
};

// Get configured Cloudinary instance
export const getCloudinaryInstance = () => {
  initializeCloudinary();
  return cloudinary;
};

// Validate Cloudinary connection
export const validateCloudinaryConnection = async (): Promise<boolean> => {
  try {
    const instance = getCloudinaryInstance();
    const result = await instance.api.ping();
    return result.status === 'ok';
  } catch (error) {
    console.error('Cloudinary connection validation failed:', error);
    return false;
  }
};

export default cloudinary;
