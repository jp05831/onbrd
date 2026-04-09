import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signAdminToken, isAdminEmail } from '@/app/lib/admin-auth'
import { adminLoginRateLimit, getIP } from '@/app/lib/ratelimit'

export async function POST(req: NextRequest) {
  if (await adminLoginRateLimit(getIP(req))) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })
  }

  try {
    const { access_token } = await req.json()
    if (!access_token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error } = await supabase.auth.getUser(access_token)

    if (error || !user?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Not an admin account' }, { status: 403 })
    }

    const token = signAdminToken(user.email)
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
