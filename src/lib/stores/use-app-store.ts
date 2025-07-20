import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '@prisma/client';

interface AppState {
  // Tema ayarları (kullanıcı ayarlarından gelecek, yoksa SYSTEM)
  theme: Theme | null;
  
  // Global error durumu
  error: string | null;
}

interface AppActions {
  // Tema ayarları
  setTheme: (theme: Theme) => void;
  clearTheme: () => void;
  
  // Error durumu
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: null, // Kullanıcı ayarlarından çekilecek
      error: null,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      clearTheme: () => set({ theme: Theme.SYSTEM }),
      
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'aniwa-app-store',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
); 