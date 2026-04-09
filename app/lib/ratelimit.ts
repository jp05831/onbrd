/**
 * Global rate limiting using Upstash Redis.
 * Falls back gracefully to allow-all if Redis is not configured
 * (so the app works in dev without Redis set up).
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL  — from Upstash console
 *   UPSTASH_REDIS_REST_TOKEN — from Upstash console
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redisClient: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redisClient
}

type LimitResult = { success: boolean; limit: number; remaining: number }

async function checkLimit(limiter: Ratelimit | null, identifier: string): Promise<LimitResult> {
  if (!limiter) return { success: true, limit: 0, remaining: 0 } // No Redis — allow all
  return limiter.limit(identifier)
}

// --- Limiters (all use sliding window) ---

export async function loginRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 m'), prefix: 'rl:login' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export async function signupRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'rl:signup' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export async function forgotPasswordRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m'), prefix: 'rl:forgot' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export async function supportRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '10 m'), prefix: 'rl:support' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export async function adminLoginRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m'), prefix: 'rl:admin' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export async function onboardRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  // Limit portal completions: 60 per IP per minute (generous for legit use, stops spam bots)
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:onboard' })
  const result = await checkLimit(limiter, ip)
  return !result.success
}

export function getIP(req: Request | { headers: { get(k: string): string | null } }): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
