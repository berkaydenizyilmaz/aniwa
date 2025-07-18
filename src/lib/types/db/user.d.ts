// User modeline ait DB tipleri

import { User, UserProfileSettings } from '@prisma/client';

// İlişkili verilerle birlikte User tipi
export type UserWithSettings = User & {
  userSettings: UserProfileSettings | null;
};