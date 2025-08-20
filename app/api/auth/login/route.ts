import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') || ''
  let loginId = ''
  let password = ''

  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const form = await req.formData()
    loginId = String(form.get('loginId') ?? '')
    password = String(form.get('password') ?? '')
  } else {
    const body = await req.json().catch(() => ({} as any))
    loginId = String(body.loginId ?? '')
    password = String(body.password ?? '')
  }

  await login(loginId, password)
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return NextResponse.redirect(new URL('/', base))
}
