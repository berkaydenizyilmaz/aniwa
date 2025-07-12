// Aniwa Projesi - Email Constants
// Bu dosya email sistemi ile ilgili sabitleri içerir

// =============================================================================
// EMAIL SABITLERI
// =============================================================================

export const EMAIL = {
  FROM: {
    DEFAULT: 'Aniwa <noreply@aniwa.com>',
    SUPPORT: 'Aniwa Destek <destek@aniwa.com>',
    NOTIFICATIONS: 'Aniwa Bildirimler <bildirimler@aniwa.com>',
  },
  
  TEMPLATES: {
    PASSWORD_RESET: {
      SUBJECT: 'Şifre Sıfırlama - Aniwa',
      TEMPLATE_ID: 'password-reset',
    },
    WELCOME: {
      SUBJECT: 'Aniwa\'ya Hoş Geldiniz!',
      TEMPLATE_ID: 'welcome',
    },
  },
} as const