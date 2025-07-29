'use server';

import { logFiltersSchema, type LogFilters } from '@/lib/schemas/log.schema';
import { 
  getLogsBusiness, 
  getLogBusiness
} from '@/lib/services/business/admin/log.business';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Log listesi getirme
export async function getLogsAction(filters?: LogFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? logFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getLogsBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getLogsAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tek log getirme
export async function getLogAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getLogBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getLogAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 