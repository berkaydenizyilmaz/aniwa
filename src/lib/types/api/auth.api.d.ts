// Auth API istek/yanıt tipleri

import { User } from '@prisma/client';
import { RegisterInput } from '@/lib/schemas/auth.schema';
import { CrudResponses } from '../shared';

// Auth response types
export type RegisterResponse = Pick<User, 'id' | 'username' | 'email'>;

// Auth API istek tipleri
export type RegisterRequest = RegisterInput;