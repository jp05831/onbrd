/**
 * Global rate limiting backed by Postgres.
 * Works across all Vercel serverless instances simultaneously —
 * no Redis or external service required.
 *
 * Uses a sliding window counter stored in a rate_limits table.
 * Entries expire automatically (cleaned up on every check).
 */

import { Pool } from 'pg'

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) {
    const raw = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
    let rawConn = raw
    try { const u = new URL(raw); u.searchParams.delete('sslmode'); rawConn = u.toString() } catch {}
    pool = new Pool({
      connectionString: rawConn,
      ssl: { rejectUnauthorized: false },
      max: 3,
    })
  }
  return pool
}

/** Ensure the rate_limits table exists */
let tableReady = false
async function ensureTable() {
  if (tableReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id TEXT NOT NULL,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      count INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (id, window_start)
    )
  `)
  tableReady = true
}

/**
 * Sliding window rate limiter.
 * @param key      Unique identifier (e.g. "login:1.2.3.4")
 * @param maxHits  Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 * @returns true if the request should be blocked (rate limited)
 */
async function checkLimit(key: string, maxHits: number, windowMs: number): Promise<boolean> {
  try {
    await ensureTable()
    const db = getPool()
    const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs).toISOString()

    // Upsert counter for this key+window
    await db.query(`
      INSERT INTO rate_limits (id, window_start, count)
      VALUES ($1, $2, 1)
      ON CONFLICT (id, window_start)
      DO UPDATE SET count = rate_limits.count + 1
    `, [key, windowStart])

    // Read current count
    const result = await db.query(
      'SELECT count FROM rate_limits WHERE id = $1 AND window_start = $2',
      [key, windowStart]
    )
    const count = result.rows[0]?.count ?? 1

    // Clean up old windows asynchronously (don't await — fire and forget)
    const expiry = new Date(Date.now() - windowMs * 2).toISOString()
    db.query('DELETE FROM rate_limits WHERE window_start < $1', [expiry]).catch(() => {})

    return count > maxHits
  } catch {
    // If rate limit check fails (e.g. DB down), fail open — don't block legitimate users
    return false
  }
}

export function getIP(req: { headers: { get(k: string): string | null } }): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

// --- Per-endpoint limiters ---

/** Owner + client login: 10 attempts per IP per 10 minutes */
export async function loginRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`login:${ip}`, 10, 10 * 60 * 1000)
}

/** Signup: 5 accounts per IP per hour */
export async function signupRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`signup:${ip}`, 5, 60 * 60 * 1000)
}

/** Forgot password + verify email: 5 per IP per 15 minutes */
export async function forgotPasswordRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`forgot:${ip}`, 5, 15 * 60 * 1000)
}

/** Support form: 3 per IP per 10 minutes */
export async function supportRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`support:${ip}`, 3, 10 * 60 * 1000)
}

/** Admin login: 5 per IP per 15 minutes */
export async function adminLoginRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`admin:${ip}`, 5, 15 * 60 * 1000)
}

/** Onboard complete/uncomplete: 60 per IP per minute (stops bots, allows legit use) */
export async function onboardRateLimit(ip: string): Promise<boolean> {
  return checkLimit(`onboard:${ip}`, 60, 60 * 1000)
}
