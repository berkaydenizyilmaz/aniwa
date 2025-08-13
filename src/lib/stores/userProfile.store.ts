// User Profile store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  profileBanner?: string;
  lastLoginAt?: Date;
  usernameChangedAt?: Date;
  createdAt?: Date;
}

interface UserProfileState {
  // State
  profile: UserProfile | null;
  ownerUserId: string | null; // Persist edilen profile'ın ait olduğu kullanıcı
  isLoading: boolean;
  lastFetched: number | null; // Son fetch zamanı (cache kontrolü için)

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setOwnerUserId: (userId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLastFetched: (timestamp: number) => void;
  
  // Profile update actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateBio: (bio: string) => void;
  updateProfilePicture: (url: string) => void;
  updateProfileBanner: (url: string) => void;
  updateUsername: (username: string) => void;
  
  // Cache control
  isStale: (maxAge?: number) => boolean; // Cache'in eski olup olmadığını kontrol et
  reset: () => void;
}

const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 dakika

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      ownerUserId: null,
      isLoading: false,
      lastFetched: null,

      // Actions
      setProfile: (profile) => set({ profile }),
      setOwnerUserId: (userId) => set({ ownerUserId: userId }),
      setLoading: (isLoading) => set({ isLoading }),
      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),

      // Profile update actions
      updateProfile: (updates) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              ...updates,
            },
          });
        }
      },

      updateBio: (bio) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              bio,
            },
          });
        }
      },

      updateProfilePicture: (url) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              profilePicture: url,
            },
          });
        }
      },

      updateProfileBanner: (url) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              profileBanner: url,
            },
          });
        }
      },

      updateUsername: (username) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              username,
              usernameChangedAt: new Date(),
            },
          });
        }
      },

      // Cache control
      isStale: (maxAge = CACHE_MAX_AGE) => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > maxAge;
      },

      reset: () =>
        set({
          profile: null,
          ownerUserId: null,
          isLoading: false,
          lastFetched: null,
        }),
    }),
    {
      name: 'user-profile-store',
      // Persist edilen state
      partialize: (state) => ({ 
        profile: state.profile, 
        ownerUserId: state.ownerUserId,
        lastFetched: state.lastFetched
      }),
    }
  )
);
