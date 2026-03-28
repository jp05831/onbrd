import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM_EMAIL = 'Onbrd <noreply@onbrd.net>'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

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

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Onbrd password',
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
                      <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">Reset your password</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 40px;">
                      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                        We received a request to reset your Onbrd password. Click the button below to choose a new one.
                      </p>
                      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;font-size:14px;font-weight:500;border-radius:6px;text-decoration:none;">
                        Reset password
                      </a>
                      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                        Or copy and paste this URL into your browser:<br>
                        <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
                      </p>
                      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
                        This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
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
    text: `Reset your Onbrd password\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
  })
}

export async function sendClientCompletionEmail(clientEmail: string, clientName: string, ownerName: string, completionMessage?: string | null) {
  await resend.emails.send({
    from: 'Onbrd <noreply@onbrd.net>',
    to: clientEmail,
    subject: `You're all done, ${clientName}! ✅`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;"><tr><td align="center"><table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:520px;"><tr><td style="padding:32px 40px 8px;text-align:center;"><p style="margin:0;font-size:22px;font-weight:600;color:#111827;">You're all done, ${clientName}! ✅</p></td></tr><tr><td style="padding:16px 40px 32px;text-align:center;"><p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.7;">${completionMessage || `You've completed your onboarding with ${ownerName}. They'll be in touch soon.`}</p></td></tr><tr><td style="padding:20px 40px;border-top:1px solid #f3f4f6;"><p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">© ${new Date().getFullYear()} Onbrd</p></td></tr></table></td></tr></table></body></html>`,
    text: `You're all done, ${clientName}!\n\n${completionMessage || `You've completed your onboarding with ${ownerName}. They'll be in touch soon.`}`,
  })
}

export async function sendFlowCompletionToOwner(ownerEmail: string, clientName: string) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.onbrd.net'
  await resend.emails.send({
    from: 'Onbrd <noreply@onbrd.net>',
    to: ownerEmail,
    subject: `${clientName} completed their onboarding ✅`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;"><tr><td align="center"><table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:520px;"><tr><td style="padding:32px 40px 8px;"><p style="margin:0;font-size:20px;font-weight:600;color:#111827;">🎉 ${clientName} is all done!</p></td></tr><tr><td style="padding:16px 40px 32px;"><p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">${clientName} has completed all steps in their onboarding portal.</p><a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-size:14px;font-weight:500;border-radius:6px;text-decoration:none;">View Dashboard →</a></td></tr><tr><td style="padding:20px 40px;border-top:1px solid #f3f4f6;"><p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Onbrd</p></td></tr></table></td></tr></table></body></html>`,
    text: `${clientName} completed their onboarding!\n\nView dashboard: ${APP_URL}/dashboard`,
  })
}

export async function sendExpiryWarningEmail(
  ownerEmail: string,
  ownerName: string,
  items: Array<{ stepTitle: string; clientName: string; expireAt: string }>
) {
  const itemRows = items.map(item => {
    const expireDate = new Date(item.expireAt).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    return `<tr>
      <td style="padding:8px 0;font-size:14px;color:#111827;border-bottom:1px solid #f3f4f6;">${item.stepTitle}</td>
      <td style="padding:8px 0;font-size:14px;color:#6b7280;border-bottom:1px solid #f3f4f6;">${item.clientName}</td>
      <td style="padding:8px 0;font-size:14px;color:#dc2626;border-bottom:1px solid #f3f4f6;">${expireDate}</td>
    </tr>`
  }).join('')

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ownerEmail,
    subject: `⚠️ ${items.length} uploaded file${items.length > 1 ? 's' : ''} expiring tomorrow`,
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
                      <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">Files expiring tomorrow</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 40px;">
                      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                        Hi ${ownerName}, the following uploaded files will be automatically deleted in approximately 24 hours.
                        Download them now if you need to keep a copy.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <thead>
                          <tr>
                            <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:500;border-bottom:2px solid #e5e7eb;">Step</th>
                            <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:500;border-bottom:2px solid #e5e7eb;">Client</th>
                            <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:500;border-bottom:2px solid #e5e7eb;">Expires</th>
                          </tr>
                        </thead>
                        <tbody>${itemRows}</tbody>
                      </table>
                      <a href="${APP_URL}/dashboard" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#2563eb;color:#ffffff;font-size:14px;font-weight:500;border-radius:6px;text-decoration:none;">
                        Go to Dashboard
                      </a>
                      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.6;">
                        Files are deleted automatically per the auto-expire settings you configured. 
                        You can change expiry settings from the flow editor at any time.
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
    text: `Files expiring tomorrow\n\nHi ${ownerName},\n\nThe following uploaded files will be deleted in ~24 hours:\n\n${items.map(i => `- "${i.stepTitle}" (${i.clientName}) — expires ${new Date(i.expireAt).toLocaleDateString()}`).join('\n')}\n\nDownload them now if needed: ${APP_URL}/dashboard\n\nOnbrd`,
  })
}
