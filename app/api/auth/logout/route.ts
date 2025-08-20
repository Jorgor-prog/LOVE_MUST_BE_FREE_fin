import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/cookies'

export async function GET() {
  await clearSession()
  const res = NextResponse.redirect(new URL('/login?msg=logged-out', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function POST() {
  return GET()
}
