// Constants index - Tüm sabitleri merkezi olarak export eder

// Shared constants
export * from './shared/validation';
export * from './shared/ui';
export * from './shared/system';

// Domain constants
export * from './domains/anime';
export * from './domains/auth';
export * from './domains/cloudinary';
export * from './domains/events';
export * from './domains/masterData';
export * from './domains/navigation';
export * from './domains/routes';
export * from './domains/streaming';
export * from './domains/user';

// Legacy exports for backward compatibility
export { SHARED_SYSTEM } from './shared/system';
export { ANIME_DOMAIN as ANIME } from './domains/anime';
export { AUTH_DOMAIN as AUTH } from './domains/auth';
export { CLOUDINARY_DOMAIN as CLOUDINARY } from './domains/cloudinary';
export { EVENTS_DOMAIN as EVENTS } from './domains/events';
export { MASTER_DATA_DOMAIN as MASTER_DATA } from './domains/masterData';
export { NAVIGATION_DOMAIN as NAVIGATION } from './domains/navigation';
export { ROUTES_DOMAIN as ROUTES } from './domains/routes';
export { STREAMING_DOMAIN as STREAMING } from './domains/streaming';
export { USER_DOMAIN as USER } from './domains/user';
