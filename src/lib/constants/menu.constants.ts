// Menu sabitleri

import { Crown, Edit, Shield } from 'lucide-react';
import { ROUTES } from './routes.constants';
import { USER } from './user.constants';
 
export const ADMIN_MENU_ITEMS = [
  { icon: Crown, label: 'Admin Paneli', href: ROUTES.PAGES.ADMIN.DASHBOARD, role: USER.ROLES.ADMIN },
  { icon: Edit, label: 'Editör Paneli', href: ROUTES.PAGES.EDITOR.DASHBOARD, role: USER.ROLES.EDITOR },
  { icon: Shield, label: 'Moderasyon Paneli', href: ROUTES.PAGES.MODERATOR.DASHBOARD, role: USER.ROLES.MODERATOR },
] as const; 