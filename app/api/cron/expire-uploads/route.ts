import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import database from '../../../lib/db'
import { sendExpiryWarningEmail } from '../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Verify this is a legitimate Vercel Cron request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    warnings_sent: 0,
    files_deleted: 0,
    errors: [] as string[],
  }

  try {
    // ── 1. Send 24-hour warnings ──────────────────────────────────────────────
    const expiringSoon = await database.getExpiringUploadSteps(24)

    if (expiringSoon.length > 0) {
      // Group by owner
      const byOwner = new Map<string, typeof expiringSoon>()
      for (const step of expiringSoon) {
        const existing = byOwner.get(step.flow_user_id) ?? []
        existing.push(step)
        byOwner.set(step.flow_user_id, existing)
      }

      for (const [userId, steps] of byOwner) {
        try {
          const owner = await database.getUserById(userId)
          if (!owner?.email) continue

          await sendExpiryWarningEmail(
            owner.email,
            owner.name,
            steps.map(s => ({
              stepTitle: s.title,
              clientName: s.client_name,
              expireAt: s.expire_at!,
            }))
          )
          results.warnings_sent += steps.length
        } catch (err: any) {
          results.errors.push(`Warning email for user ${userId}: ${err.message}`)
        }
      }
    }

    // ── 2. Delete expired files ───────────────────────────────────────────────
    const expired = await database.getExpiredUploadSteps()

    for (const step of expired) {
      try {
        const fileUrl = step.uploaded_file_id!

        // Delete from Vercel Blob storage
        try {
          await del(fileUrl)
        } catch (blobErr: any) {
          // Log but don't abort — still clean DB record
          results.errors.push(`Blob delete for step ${step.id}: ${blobErr.message}`)
        }

        // Log deletion (GDPR audit trail)
        await database.logDeletion(
          step.id,
          step.flow_id,
          step.flow_user_id,
          fileUrl,
          step.uploaded_file_name
        )

        // Clear the DB record
        await database.clearUploadedFile(step.id)

        results.files_deleted++
      } catch (err: any) {
        results.errors.push(`Delete step ${step.id}: ${err.message}`)
      }
    }

    console.log('[expire-uploads cron]', results)
    return NextResponse.json({ ok: true, ...results })
  } catch (err: any) {
    console.error('[expire-uploads cron] fatal:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
