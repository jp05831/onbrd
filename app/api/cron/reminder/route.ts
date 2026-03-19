import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { Resend } from 'resend'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL })
const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.onbrd.net'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await pool.query(`
      SELECT f.id, f.client_name, f.client_email, f.slug,
             u.name as owner_name, u.company_name,
             COUNT(s.id) FILTER (WHERE s.completed = false) as incomplete_steps,
             MAX(s.completed_at) as last_activity
      FROM flows f
      JOIN users u ON f.user_id = u.id
      JOIN steps s ON s.flow_id = f.id
      WHERE f.status = 'published'
        AND f.client_email IS NOT NULL
        AND f.created_at < NOW() - INTERVAL '3 days'
        AND f.created_at > NOW() - INTERVAL '14 days'
      GROUP BY f.id, f.client_name, f.client_email, f.slug, u.name, u.company_name
      HAVING COUNT(s.id) FILTER (WHERE s.completed = false) > 0
        AND (MAX(s.completed_at) IS NULL OR MAX(s.completed_at) < NOW() - INTERVAL '3 days')
    `)
    let sent = 0
    for (const flow of result.rows) {
      try {
        const senderName = flow.company_name || flow.owner_name
        await resend.emails.send({
          from: 'Onbrd <noreply@onbrd.net>',
          to: flow.client_email,
          subject: `Reminder: you have ${flow.incomplete_steps} step${flow.incomplete_steps > 1 ? 's' : ''} left to complete`,
          html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;"><tr><td align="center"><table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:520px;"><tr><td style="padding:32px 40px 8px;"><p style="margin:0;font-size:20px;font-weight:600;color:#111827;">Just a friendly reminder 👋</p></td></tr><tr><td style="padding:16px 40px 32px;"><p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.6;">Hi ${flow.client_name}, you still have <strong>${flow.incomplete_steps} step${flow.incomplete_steps > 1 ? 's' : ''}</strong> left to complete your onboarding with <strong>${senderName}</strong>.</p><a href="${APP_URL}/onboard/${flow.slug}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-size:14px;font-weight:500;border-radius:6px;text-decoration:none;">Continue Onboarding →</a></td></tr><tr><td style="padding:20px 40px;border-top:1px solid #f3f4f6;"><p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Onbrd</p></td></tr></table></td></tr></table></body></html>`,
          text: `Hi ${flow.client_name},\n\nYou have ${flow.incomplete_steps} step(s) left.\n\nContinue: ${APP_URL}/onboard/${flow.slug}`,
        })
        sent++
      } catch (e) { console.error('Reminder failed', e) }
    }
    return NextResponse.json({ success: true, sent })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
