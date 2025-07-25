// Menu sabitleri

import { Crown, Edit, Shield, LayoutDashboard, Tag, Home, Play, List, User, Bell, Settings } from 'lucide-react';
import { ROUTES } from './routes.constants';
import { USER } from './user.constants';
 
export const ADMIN_MENU_ITEMS = [
  { icon: Crown, label: 'Admin Paneli', href: ROUTES.PAGES.ADMIN.DASHBOARD, role: USER.ROLES.ADMIN },
  { icon: Edit, label: 'Editör Paneli', href: ROUTES.PAGES.EDITOR.DASHBOARD, role: USER.ROLES.EDITOR },
  { icon: Shield, label: 'Moderasyon Paneli', href: ROUTES.PAGES.MODERATOR.DASHBOARD, role: USER.ROLES.MODERATOR },
] as const;

export const ADMIN_NAVIGATION_ITEMS = [
  { 
    label: 'Dashboard', 
    href: ROUTES.PAGES.ADMIN.DASHBOARD, 
    icon: LayoutDashboard 
  },
  { 
    label: 'Türler',
    href: ROUTES.PAGES.ADMIN.GENRES,
    icon: Tag
  },
  {
    label: 'Etiketler',
    href: ROUTES.PAGES.ADMIN.TAGS,
    icon: Tag
  },
] as const;

export const HEADER_NAVIGATION_ITEMS = [
  { label: 'Anime', href: ROUTES.PAGES.ANIME },
  { label: 'Listeler', href: ROUTES.PAGES.LISTS },
] as const;

export const BOTTOM_NAVIGATION_ITEMS = [
  { icon: Home, label: 'Ana Sayfa', href: ROUTES.PAGES.HOME },
  { icon: Play, label: 'Anime', href: ROUTES.PAGES.ANIME },
  { icon: List, label: 'Listeler', href: ROUTES.PAGES.LISTS },
] as const;

export const AUTH_MENU_ITEMS = [
  { icon: User, label: 'Profil', href: ROUTES.PAGES.PROFILE },
  { icon: Bell, label: 'Bildirimler', href: ROUTES.PAGES.NOTIFICATIONS },
  { icon: Settings, label: 'Ayarlar', href: ROUTES.PAGES.SETTINGS },
] as const;