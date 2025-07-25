import { create } from 'zustand';
import { LoadingKey } from '@/lib/constants/loading.constants';

interface LoadingState {
  // Loading durumları - key: loading identifier, value: boolean
  loadingStates: Record<string, boolean>;
  
  // Loading durumunu ayarla
  setLoading: (key: LoadingKey, loading: boolean) => void;
  
  // Belirli bir loading durumunu kontrol et
  isLoading: (key: LoadingKey) => boolean;
  
  // Birden fazla loading durumunu kontrol et
  isAnyLoading: (keys: LoadingKey[]) => boolean;
  
  // Tüm loading durumlarını temizle
  clearAll: () => void;
  
  // Belirli bir loading durumunu temizle
  clear: (key: LoadingKey) => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingStates: {},
  
  setLoading: (key: string, loading: boolean) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    })),
  
  isLoading: (key: string) => get().loadingStates[key] || false,
  
  isAnyLoading: (keys: string[]) =>
    keys.some((key) => get().loadingStates[key] || false),
  
  clearAll: () => set({ loadingStates: {} }),
  
  clear: (key: string) =>
    set((state) => {
      const newLoadingStates = { ...state.loadingStates };
      delete newLoadingStates[key];
      return { loadingStates: newLoadingStates };
    }),
})); 