'use server';

import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth.schema';
import { registerUser as registerUserBusiness, forgotPassword as forgotPasswordBusiness } from '@/lib/services/business/auth.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

export async function registerUser(data: RegisterInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = registerSchema.parse(data);

    // Business logic'i kullan
    const result = await registerUserBusiness(validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.HOME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = forgotPasswordSchema.parse(data);

    // Business logic'i kullan
    const result = await forgotPasswordBusiness(validatedData.email);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 