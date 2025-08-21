import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { createSession } from '@/lib/cookies'

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const b = await req.json()
    return { loginId: String(b.loginId || ''), password: String(b.password || '') }
  }
  const form = await req.formData()
  return { loginId: String(form.get('loginId') || ''), password: String(form.get('password') || '') }
}

export async function POST(req: Request) {
  const { loginId, password } = await readBody(req)
  const user = await prisma.user.findUnique({ where: { loginId } })
  if (!user) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  const ok = await compare(password, user.loginPassword)
  if (!ok) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  await createSession(String(user.id))
  const path = user.role === 'ADMIN' ? '/admin' : '/dashboard'
  const wantsHtml = (req.headers.get('accept') || '').includes('text/html')
  if (wantsHtml) return NextResponse.redirect(new URL(path, req.url), { status: 303 })
  return NextResponse.json({ ok: true, redirect: path })
}
