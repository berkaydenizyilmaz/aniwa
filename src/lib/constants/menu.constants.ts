// Menu sabitleri

import { Crown, Edit, Shield, LayoutDashboard, Home, Play, List, User, Bell, Settings, Building2, FileText, Tv, Hash, BookOpen } from 'lucide-react';
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
    icon: BookOpen
  },
  {
    label: 'Etiketler',
    href: ROUTES.PAGES.ADMIN.TAGS,
    icon: Hash
  },
  {
    label: 'Stüdyolar',
    href: ROUTES.PAGES.ADMIN.STUDIOS,
    icon: Building2
  },
  {
    label: 'Kullanıcılar',
    href: ROUTES.PAGES.ADMIN.USERS,
    icon: User
  },
  {
    label: 'Yayın Platformları',
    href: ROUTES.PAGES.ADMIN.STREAMING_PLATFORMS,
    icon: Tv
  },
  {
    label: 'Loglar',
    href: ROUTES.PAGES.ADMIN.LOGS,
    icon: FileText
  },
] as const;

export const EDITOR_NAVIGATION_ITEMS = [
  { 
    label: 'Dashboard', 
    href: ROUTES.PAGES.EDITOR.DASHBOARD, 
    icon: LayoutDashboard 
  },
  { 
    label: 'Anime',
    href: ROUTES.PAGES.EDITOR.ANIME,
    icon: Play
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