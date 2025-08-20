import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/cookies'

export async function GET() {
  await clearSession()
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login?msg=logged-out', base))
  res.headers.set('Cache-Control', 'no-store')
  return res
}
