// Role utility fonksiyonları - Bitwise role system için

import { UserRole } from '@/lib/constants/domains/auth';

export const hasRole = (userRoles: number, role: UserRole): boolean => {
  return (userRoles & role) === role;
};

export const hasAnyRole = (userRoles: number, roles: UserRole[]): boolean => {
  return roles.some(role => hasRole(userRoles, role));
};

export const hasAllRoles = (userRoles: number, roles: UserRole[]): boolean => {
  return roles.every(role => hasRole(userRoles, role));
};
