// Email gönderme utility'si - Resend kullanarak
import { Resend } from 'resend';
import { ROUTES_DOMAIN, AUTH_DOMAIN } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

// Şifre sıfırlama email'i gönder
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  username: string
): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}${ROUTES_DOMAIN.PAGES.AUTH.RESET_PASSWORD}?token=${token}`;
    
    await resend.emails.send({
      from: 'Aniwa <noreply@aniwa.tr>',
      to: email,
      subject: 'Şifrenizi Sıfırlayın - Aniwa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${username}!</h2>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Şifremi Sıfırla
          </a>
          <p>Bu link ${AUTH_DOMAIN.BUSINESS.TOKEN_EXPIRES.PASSWORD_RESET / 60 / 60 / 1000} saat sonra geçersiz olacaktır.</p>
          <p>Eğer bu isteği siz yapmadıysanız, bu email'i görmezden gelebilirsiniz.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Bu email Aniwa tarafından gönderilmiştir.
          </p>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return false;
  }
}