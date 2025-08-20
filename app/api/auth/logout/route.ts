import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearSession } from '@/lib/cookies'

export async function GET() {
  await clearSession(cookies())
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login?msg=logged-out', base))
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function POST() {
  return GET()
}
