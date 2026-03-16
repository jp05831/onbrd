import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM_EMAIL = 'Onbrd <noreply@onbrd.net>'

export async function sendVerificationEmail(email: string, token: string) {
  // Link goes to the API route, not the page
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your Onbrd account',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:520px;">
                  <tr>
                    <td style="padding:32px 40px 8px;">
                      <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">Verify your email address</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 40px;">
                      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                        Thanks for signing up for Onbrd. Click the button below to verify your email address and activate your account.
                      </p>
                      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;font-size:14px;font-weight:500;border-radius:6px;text-decoration:none;">
                        Verify my email
                      </a>
                      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                        Or copy and paste this URL into your browser:<br>
                        <a href="${verifyUrl}" style="color:#2563eb;word-break:break-all;">${verifyUrl}</a>
                      </p>
                      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
                        This link expires in 24 hours. If you didn't create an Onbrd account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid #f3f4f6;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Onbrd · <a href="https://onbrd.net" style="color:#6b7280;text-decoration:none;">onbrd.net</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Verify your Onbrd account\n\nClick the link below to verify your email:\n\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't sign up for Onbrd, ignore this email.`,
  })
}
