import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Onbrd Support <noreply@onbrd.net>',
      to: 'Onbrd1@gmail.com',
      replyTo: email,
      subject: `[Support] ${subject} — from ${name}`,
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
                      <td style="padding:32px 40px 16px;">
                        <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">New support message</p>
                        <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">${subject}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 40px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                          <tr>
                            <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
                              <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">From</span>
                              <span style="font-size:14px;color:#111827;font-weight:500;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:12px 16px;">
                              <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Email</span>
                              <a href="mailto:${email}" style="font-size:14px;color:#2563eb;text-decoration:none;">${email}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 40px 32px;">
                        <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
                        <div style="font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;">
                          Reply directly to this email to respond to ${name}.
                          Sent via <a href="https://www.onbrd.net/support" style="color:#6b7280;text-decoration:none;">onbrd.net/support</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `New support message: ${subject}\n\nFrom: ${name} <${email}>\n\n${message}\n\n---\nReply to this email to respond.`,
    })

    // Auto-reply to the user
    await resend.emails.send({
      from: 'Onbrd Support <noreply@onbrd.net>',
      to: email,
      subject: `We got your message — ${subject}`,
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
                        <p style="margin:0;font-size:20px;font-weight:600;color:#111827;">We got your message</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 40px 32px;">
                        <p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.7;">
                          Hi ${name}, thanks for reaching out. We've received your message and will get back to you within a few hours.
                        </p>
                        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin-bottom:20px;">
                          <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;font-weight:500;">Your message</p>
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        </div>
                        <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
                          In the meantime, you might find an answer in our <a href="https://www.onbrd.net/blog" style="color:#2563eb;text-decoration:none;">blog and guides</a>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 40px;border-top:1px solid #f3f4f6;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Onbrd · <a href="https://www.onbrd.net" style="color:#6b7280;text-decoration:none;">onbrd.net</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Hi ${name},\n\nWe've received your message and will get back to you within a few hours.\n\nYour message:\n${message}\n\n— Onbrd Support`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Support email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
