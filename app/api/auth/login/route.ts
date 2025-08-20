import { NextResponse } from 'next/server'
import { login as doLogin } from '@/lib/auth'

export async function POST(req: Request) {
  const form = await req.formData()
  const loginId = String(form.get('loginId') || '')
  const password = String(form.get('password') || '')

  try {
    const user = await doLogin(loginId, password)
    if (!user) {
      return NextResponse.json({ error: 'invalid' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
    }
    const dest = user.role === 'ADMIN' ? '/admin' : '/'
    const base = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000'
    const res = NextResponse.redirect(new URL(dest, base))
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
}
