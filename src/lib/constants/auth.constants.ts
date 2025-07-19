// Auth ile ilgili sabitler
 
export const AUTH = {
  BCRYPT_SALT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_REGEX: /^[a-zA-Z0-9]+$/,
} as const; 