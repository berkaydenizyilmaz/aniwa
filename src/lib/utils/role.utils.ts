// Role utility functions - Role kontrolü için yardımcı fonksiyonlar

import { UserRole } from '@prisma/client';

// Temel role check fonksiyonları
export const hasRole = (userRoles: UserRole[], requiredRole: UserRole): boolean => {
  return userRoles.includes(requiredRole);
};

export const hasAnyRole = (userRoles: UserRole[], requiredRoles: UserRole[]): boolean => {
  return requiredRoles.some(role => userRoles.includes(role));
};

// Convenience methods - En çok kullanılanlar
export const isAdmin = (roles: UserRole[]): boolean => 
  roles.includes(UserRole.ADMIN);

export const isEditor = (roles: UserRole[]): boolean => 
  roles.includes(UserRole.EDITOR);

export const isModerator = (roles: UserRole[]): boolean => 
  roles.includes(UserRole.MODERATOR);

// Hierarchy-based permission checks - Pratik kullanım için
export const canModerate = (roles: UserRole[]): boolean => 
  roles.some(role => ([UserRole.MODERATOR, UserRole.ADMIN] as UserRole[]).includes(role));

export const canEdit = (roles: UserRole[]): boolean => 
  roles.some(role => ([UserRole.EDITOR, UserRole.ADMIN] as UserRole[]).includes(role));