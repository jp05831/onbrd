import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM_EMAIL = 'Onbrd <onboarding@resend.dev>'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your Onbrd account',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
                  <tr>
                    <td style="padding:32px 40px 24px;">
                      <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#fff;">Verify your email</p>
                      <p style="margin:0 0 28px;font-size:14px;color:#737373;">Click the button below to verify your Onbrd account and get started.</p>
                      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-size:14px;font-weight:500;border-radius:8px;text-decoration:none;">Verify my email →</a>
                      <p style="margin:24px 0 0;font-size:12px;color:#525252;">Or copy this link:<br><span style="color:#3b82f6;word-break:break-all;">${verifyUrl}</span></p>
                      <p style="margin:20px 0 0;font-size:12px;color:#404040;">This link expires in 24 hours. If you didn't sign up for Onbrd, you can ignore this email.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}
