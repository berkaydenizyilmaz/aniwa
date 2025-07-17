import { 
  User, 
  UserProfileSettings, 
  UserRole, 
  Theme, 
  TitleLanguage, 
  ProfileVisibility, 
  ScoreFormat,
  UserFollow
} from "@prisma/client"

// =============================================================================
// TEMEL USER TIPLERI
// =============================================================================

// Kullanıcı ile ilişkili ayarları içeren tip
export type UserWithSettings = User & {
  userSettings: UserProfileSettings | null
}

// Kullanıcı ile takip bilgileri
export type UserWithFollows = User & {
  followingUser: UserFollow[]
  followedBy: UserFollow[]
  _count: {
    followingUser: number
    followedBy: number
  }
}

// Kullanıcı profil özeti (public bilgiler)
export interface UserProfile {
  id: string
  username: string
  slug: string
  profilePicture?: string
  profileBanner?: string
  bio?: string
  roles: UserRole[]
  createdAt: Date
  userSettings?: {
    profileVisibility: ProfileVisibility
    showAnimeList: boolean
    showFavouriteAnimeSeries: boolean
    showCustomLists: boolean
  }
}

// =============================================================================
// CRUD PARAMETRELERI
// =============================================================================

// Kullanıcı oluşturma parametreleri
export interface CreateUserParams {
  email: string
  password: string
  username: string
  role?: UserRole
}

// Kullanıcı güncelleme parametreleri
export interface UpdateUserParams {
  email?: string
  username?: string
  bio?: string
  profilePicture?: string
  profileBanner?: string
  usernameChangedAt?: Date
}

// Profil ayarları güncelleme parametreleri
export interface UpdateUserSettingsParams {
  themePreference?: Theme
  titleLanguagePreference?: TitleLanguage
  displayAdultContent?: boolean
  scoreFormat?: ScoreFormat
  autoTrackOnAniwaListAdd?: boolean
  profileVisibility?: ProfileVisibility
  allowFollows?: boolean
  showAnimeList?: boolean
  showFavouriteAnimeSeries?: boolean
  showCustomLists?: boolean
}

// =============================================================================
// ARAMA VE FİLTRELEME
// =============================================================================

// Kullanıcı arama parametreleri
export interface UserSearchParams {
  query?: string
  roles?: UserRole[]
  isActive?: boolean
  createdAfter?: Date
  createdBefore?: Date
}

// Kullanıcı listesi filtreleme
export interface UserListFilters {
  role?: UserRole
  isActive?: boolean
  hasProfilePicture?: boolean
  sortBy?: 'username' | 'createdAt' | 'lastLoginAt' | 'usernameChangedAt'
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// RESPONSE TIPLERI
// =============================================================================

// Kullanıcı istatistikleri
export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  usersByRole: Record<UserRole, number>
}

// Kullanıcı aktivite özeti
export interface UserActivity {
  lastLoginAt?: Date
  usernameChangedAt?: Date
  animeListCount: number
  favouriteAnimeCount: number
  customListsCount: number
  commentsCount: number
  followersCount: number
  followingCount: number
}

// =============================================================================
// EXPORTS
// =============================================================================

// Prisma enum'larını re-export et
export { UserRole, Theme, TitleLanguage, ProfileVisibility, ScoreFormat } from "@prisma/client" 