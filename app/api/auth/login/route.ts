import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(req: Request) {
  let loginId = ''
  let password = ''
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const b = await req.json()
    loginId = String(b.loginId || '')
    password = String(b.password || '')
  } else {
    const form = await req.formData()
    loginId = String(form.get('loginId') || '')
    password = String(form.get('password') || '')
  }
  const me = await login(loginId, password)
  if (!me) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  const url = new URL(req.url)
  const dest = me.role === 'ADMIN' ? '/admin' : '/dashboard'
  const res = NextResponse.redirect(new URL(dest, url.origin), { status: 303 })
  res.headers.set('Cache-Control', 'no-store')
  return res
}
