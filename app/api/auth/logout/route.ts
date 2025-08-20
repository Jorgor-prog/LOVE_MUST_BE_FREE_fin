import { NextResponse } from 'next/server'
import { getSessionToken, clearSession } from '@/lib/cookies'
import { cookies } from 'next/headers'

export async function GET() {
  const token = getSessionToken(cookies())
  if (token) await clearSession(token)
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login?msg=logged-out', base))
  res.cookies.set('session', '', { expires: new Date(0), path: '/' })
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function POST() {
  return GET()
}
