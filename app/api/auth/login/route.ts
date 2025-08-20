import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

async function readCreds(req: Request) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const b = await req.json()
    return { loginId: b.loginId || b.username || '', password: b.password || '' }
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const t = await req.text()
    const p = new URLSearchParams(t)
    return { loginId: p.get('loginId') || p.get('username') || '', password: p.get('password') || '' }
  }
  if (ct.includes('multipart/form-data')) {
    const f = await req.formData()
    return { loginId: String(f.get('loginId') ?? f.get('username') ?? ''), password: String(f.get('password') ?? '') }
  }
  try {
    const b = await req.json()
    return { loginId: b.loginId || b.username || '', password: b.password || '' }
  } catch {
    const t = await req.text().catch(() => '')
    const p = new URLSearchParams(t)
    return { loginId: p.get('loginId') || p.get('username') || '', password: p.get('password') || '' }
  }
}

export async function POST(req: Request) {
  const { loginId, password } = await readCreds(req)
  if (!loginId || !password) {
    const url = new URL('/login?error=missing_credentials', req.url)
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } })
  }
  try {
    const u = await login(loginId, password)
    const to = u?.role === 'ADMIN' ? '/admin' : '/dashboard'
    const url = new URL(to, req.url)
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    const url = new URL('/login?error=invalid_credentials', req.url)
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } })
  }
}
