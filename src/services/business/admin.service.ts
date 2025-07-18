import { logError, logInfo } from '@/services/business/logger.service'
import { ServiceResult } from '@/types'
import { AdminUpdateUserValues, UserListQueryValues } from '@/schemas/admin'
import {
  countUsersForAdmin,
  findUserById,
  findUsersForAdmin,
  updateUser,
} from '@/services/db/user.db'
import { User, UserProfileSettings } from '@prisma/client'
import { LOG_EVENTS } from '@/constants/logging'

// Admin paneli için kullanıcıları ve sayfalama bilgilerini getirir.
export async function getUsersForAdmin(params: UserListQueryValues): Promise<
  ServiceResult<{
    users: (User & { userSettings: UserProfileSettings | null })[]
    total: number
    page: number
    limit: number
  }>
> {
  try {
    const { page, limit, sort, search } = params

    const [users, total] = await Promise.all([
      findUsersForAdmin({ page, limit, sort, search }),
      countUsersForAdmin({ search }),
    ])

    return {
      success: true,
      data: { users, total, page, limit },
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.ADMIN_GET_USERS_FAILED,
      message: `Admin için kullanıcılar getirilirken hata oluştu.`,
      metadata: { error: error instanceof Error ? error.message : 'Bilinmeyen hata', params },
    })
    return {
      success: false,
      error: 'Kullanıcılar getirilirken bir hata oluştu.',
    }
  }
}

// Admin tarafından bir kullanıcının bilgilerini günceller.
export async function updateUserByAdmin(
  userId: string,
  data: AdminUpdateUserValues,
  adminId: string
): Promise<ServiceResult<User>> {
  try {
    if (userId === adminId) {
      return { success: false, error: 'Admin kendi bilgilerini bu arayüzden güncelleyemez.' }
    }

    const userToUpdate = await findUserById(userId)
    if (!userToUpdate) {
      return { success: false, error: 'Güncellenecek kullanıcı bulunamadı.' }
    }

    const updatedUser = await updateUser(userId, data)

    logInfo({
      event: LOG_EVENTS.ADMIN_USER_UPDATE,
      message: `Admin (${adminId}), kullanıcıyı (${userId}) güncelledi.`,
      metadata: { userId, adminId, changes: data },
      userId: adminId,
    })

    return { success: true, data: updatedUser }
  } catch (error) {
    logError({
      event: LOG_EVENTS.ADMIN_USER_UPDATE_FAILED,
      message: `Admin tarafından kullanıcı güncellenirken hata oluştu.`,
      metadata: { userId, adminId, data, error: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      userId: adminId,
    })
    return { success: false, error: 'Kullanıcı güncellenirken bir hata oluştu.' }
  }
}
