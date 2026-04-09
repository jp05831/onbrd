import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-change-me'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Validate the JWT — not just check cookie presence
    try {
      const secret = new TextEncoder().encode(ADMIN_JWT_SECRET)
      await jose.jwtVerify(adminToken, secret)
    } catch {
      // Token invalid or expired — clear cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
      return response
    }
  }

  if (pathname.startsWith('/client/dashboard')) {
    const clientToken = request.cookies.get('client_token')?.value
    if (!clientToken) {
      return NextResponse.redirect(new URL('/client/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/dashboard', '/client/dashboard/:path*'],
}
