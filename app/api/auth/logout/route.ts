import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const c = cookies()
  const token = c.get('session')?.value || null
  if (token) {
    try {
      await prisma.session.delete({ where: { token } })
    } catch {}
    c.set('session', '', { maxAge: 0, path: '/' })
  }
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = NextResponse.redirect(`${base}/login?msg=logged-out`)
  res.headers.set('Cache-Control', 'no-store')
  return res
}
