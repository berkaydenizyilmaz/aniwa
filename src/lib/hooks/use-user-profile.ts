import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserProfileAction } from '@/lib/actions/user/settings.actions';
import { useUserProfileStore } from '@/lib/stores/userProfile.store';
import { GetUserProfileResponse } from '@/lib/types/api/settings.api';

export function useUserProfile() {
  const { data: session } = useSession();
  const { setProfile } = useUserProfileStore();

  const query = useQuery({
    queryKey: ['user', session?.user?.id, 'profile'],
    queryFn: () => getUserProfileAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });

  // Store'u güncelle
  if (query.data && 'success' in query.data && query.data.success) {
    setProfile(query.data.data as GetUserProfileResponse);
  }

  return query;
}
