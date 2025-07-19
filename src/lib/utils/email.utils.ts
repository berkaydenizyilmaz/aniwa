// Email gönderme utility'si - Resend kullanarak
import { Resend } from 'resend';
import { ROUTES } from '@/lib/constants/routes.constants';
import { AUTH } from '@/lib/constants/auth.constants';

const resend = new Resend(process.env.RESEND_API_KEY);

// Şifre sıfırlama email'i gönder
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  username: string
): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.PAGES.AUTH.RESET_PASSWORD}?token=${token}`;
    
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
          <p>Bu link ${AUTH.TOKEN_EXPIRES.PASSWORD_RESET / 60 / 60 / 1000} saat sonra geçersiz olacaktır.</p>
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

// Email doğrulama email'i gönder (gelecekte kullanım için)
export async function sendVerificationEmail(
  email: string,
  token: string,
  username: string
): Promise<boolean> {
  try {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.PAGES.AUTH.EMAIL_VERIFY}?token=${token}`;
    
    await resend.emails.send({
      from: 'Aniwa <noreply@aniwa.tr>',
      to: email,
      subject: 'Email Adresinizi Doğrulayın - Aniwa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${username}!</h2>
          <p>Email adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Email'i Doğrula
          </a>
          <p>Bu link ${AUTH.TOKEN_EXPIRES.EMAIL_VERIFICATION / 60 / 60 / 1000} saat sonra geçersiz olacaktır.</p>
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