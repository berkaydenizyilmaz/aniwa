// Navigation domain constants - Menü ve navigasyon sabitleri

import { Crown, Edit, Shield, LayoutDashboard, Home, Play, List, User, Bell, Settings, Building2, FileText, Tv, Hash, BookOpen } from 'lucide-react';
import { UserRole } from './auth';

export const NAVIGATION_DOMAIN = {
  // Menu items
  MENU: {
    ADMIN_MENU_ITEMS: [
      { icon: Crown, label: 'Admin Paneli', href: '/yonetim', role: UserRole.ADMIN },
      { icon: Edit, label: 'Editör Paneli', href: '/editor', role: UserRole.EDITOR },
      { icon: Shield, label: 'Moderasyon Paneli', href: '/moderator', role: UserRole.MODERATOR },
    ],
    
    ADMIN_NAVIGATION_ITEMS: [
      { 
        label: 'Dashboard', 
        href: '/yonetim', 
        icon: LayoutDashboard 
      },
      { 
        label: 'Türler',
        href: '/yonetim/turler',
        icon: BookOpen
      },
      {
        label: 'Etiketler',
        href: '/yonetim/etiketler',
        icon: Hash
      },
      {
        label: 'Stüdyolar',
        href: '/yonetim/studyolar',
        icon: Building2
      },
      {
        label: 'Kullanıcılar',
        href: '/yonetim/kullanicilar',
        icon: User
      },
      {
        label: 'Yayın Platformları',
        href: '/yonetim/yayin-platformlari',
        icon: Tv
      },
      {
        label: 'Loglar',
        href: '/yonetim/loglar',
        icon: FileText
      },
    ],
    
    EDITOR_NAVIGATION_ITEMS: [
      { 
        label: 'Dashboard', 
        href: '/editor', 
        icon: LayoutDashboard 
      },
      { 
        label: 'Anime',
        href: '/editor/anime',
        icon: Play
      },
    ],
    
    HEADER_NAVIGATION_ITEMS: [
      { label: 'Anime', href: '/anime' },
      { label: 'Listeler', href: '/listeler' },
    ],
    
    BOTTOM_NAVIGATION_ITEMS: [
      { icon: Home, label: 'Ana Sayfa', href: '/' },
      { icon: Play, label: 'Anime', href: '/anime' },
      { icon: List, label: 'Listeler', href: '/listeler' },
    ],
    
    AUTH_MENU_ITEMS: [
      { icon: User, label: 'Profil', href: '/profil' },
      { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
      { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
    ],
  },
} as const;
